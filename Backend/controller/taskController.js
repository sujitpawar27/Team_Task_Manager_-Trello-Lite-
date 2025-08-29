import { z } from "zod";
import Task from "../models/Task.js";
import Comment from "../models/Comment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { bad, created, notFound, ok } from "../utils/http.js";
import multer from "multer";
import { supabase, getPublicUrl } from "../lib/supabase.js";
import path from "path";
import crypto from "crypto";

export const listByProject = asyncHandler(async (req, res) => {
  const { assignee, status, q } = req.query;
  const filter = { project: req.project._id };
  if (assignee) filter.assignee = assignee;
  if (status) filter.status = status;
  if (q) filter.title = { $regex: q, $options: "i" };
  const tasks = await Task.find(filter)
    .populate("assignee", "name email")
    .sort("-createdAt");
  const withMeta = await attachCommentMeta(tasks);
  return ok(res, { tasks: withMeta });
});

export const createTask = asyncHandler(async (req, res) => {
  const schema = z.object({
    project: z.string(),
    title: z.string().min(1),
    description: z.string().optional(),
    assignee: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    status: z.enum(["todo", "in_progress", "done"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    attachments: z
      .array(
        z.object({
          url: z.string().min(1),
          name: z.string().min(1),
          size: z.number().optional(),
        })
      )
      .optional(),
  });

  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return bad(res, parsed.error.errors[0].message);
  }

  if (parsed.data.assignee) {
    const isMember = req.project.members.some((m) => {
      console.log("➡️ Comparing:", m, "vs", parsed.data.assignee);
      return (
        m.toString() === parsed.data.assignee ||
        (m.user && m.user.toString() === parsed.data.assignee)
      );
    });

    if (!isMember) {
      return bad(res, "Assignee must be a project member");
    }
  }

  const task = await Task.create({ ...parsed.data, createdBy: req.user._id });

  // If attachments were provided in the payload (client already uploaded to Supabase)
  if (parsed.data.attachments && parsed.data.attachments.length) {
    task.attachments = [
      ...(task.attachments || []),
      ...parsed.data.attachments,
    ];
    await task.save();
  }

  // If files were sent during creation, upload them and attach
  const files = req.files || [];
  if (files.length) {
    const bucket = process.env.SUPABASE_BUCKET || "attachments";
    const uploaded = [];
    for (const f of files) {
      const ext = path.extname(f.originalname);
      const rand = crypto.randomBytes(8).toString("hex");
      const key = `projects/${task.project.toString()}/tasks/${
        task._id
      }/${Date.now()}-${rand}${ext}`;
      const { error } = await supabase.storage
        .from(bucket)
        .upload(key, f.buffer, {
          contentType: f.mimetype || "application/octet-stream",
          upsert: false,
        });
      if (error) {
        // eslint-disable-next-line no-console
        console.error("Supabase upload error", error);
        continue;
      }
      const url = getPublicUrl(bucket, key);
      uploaded.push({ url: url || key, name: f.originalname, size: f.size });
    }
    if (uploaded.length) {
      task.attachments = [...(task.attachments || []), ...uploaded];
      await task.save();
    }
  }

  console.log("✅ Task created:", task._id);
  return created(res, { task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const schema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    assignee: z.string().nullable().optional(),
    dueDate: z.string().datetime().nullable().optional(),
    status: z.enum(["todo", "in_progress", "done"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    attachments: z
      .array(
        z.object({
          url: z.string().min(1),
          name: z.string().min(1),
          size: z.number().optional(),
        })
      )
      .optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return bad(res, parsed.error.errors[0].message);
  const task = await Task.findById(req.params.id);
  if (!task) return notFound(res, "Task not found");
  if (task.project.toString() !== req.project._id.toString())
    return notFound(res, "Task not in project");
  if (
    Object.prototype.hasOwnProperty.call(parsed.data, "assignee") &&
    parsed.data.assignee
  ) {
    const isMember = req.project.members.some(
      (m) => m.user.toString() === parsed.data.assignee
    );
    if (!isMember) return bad(res, "Assignee must be a project member");
  }
  // If attachments array provided, replace current attachments with provided array
  if (parsed.data.attachments && Array.isArray(parsed.data.attachments)) {
    task.attachments = parsed.data.attachments;
    // apply other fields except attachments
    const { attachments, ...rest } = parsed.data;
    task.set(rest);
  } else {
    task.set(parsed.data);
  }
  await task.save();
  return ok(res, { task });
});

export const moveTask = asyncHandler(async (req, res) => {
  console.log("Moving task:", req.params.id, req.body);
  const schema = z.object({ status: z.enum(["todo", "in_progress", "done"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return bad(res, parsed.error.errors[0].message);
  const task = await Task.findById(req.params.id);
  if (!task) return notFound(res, "Task not found");
  if (task.project.toString() !== req.project._id.toString())
    return notFound(res, "Task not in project");
  task.status = parsed.data.status;
  await task.save();
  return ok(res, { task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return notFound(res, "Task not found");
  if (task.project.toString() !== req.project._id.toString())
    return notFound(res, "Task not in project");
  await task.deleteOne();
  return ok(res, { ok: true });
});

export const addComment = asyncHandler(async (req, res) => {
  const schema = z.object({ text: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return bad(res, parsed.error.errors[0].message);
  const task = await Task.findById(req.params.id);
  if (!task) return notFound(res, "Task not found");
  const comment = await Comment.create({
    task: task._id,
    author: req.user._id,
    text: parsed.data.text,
  });
  const populated = await Comment.findById(comment._id).populate(
    "author",
    "name email"
  );
  return created(res, { comment: populated });
});

export const listComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ task: req.params.id })
    .populate("author", "name email")
    .sort("createdAt");
  return ok(res, { comments });
});

export const updateComment = asyncHandler(async (req, res) => {
  const schema = z.object({ text: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return bad(res, parsed.error.errors[0].message);
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return notFound(res, "Comment not found");
  // ensure comment belongs to task
  if (comment.task.toString() !== req.params.id)
    return notFound(res, "Comment not in task");

  // only author or project owner may edit
  const isAuthor = comment.author.toString() === req.user._id.toString();
  const member = req.project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  const isOwner = member && member.role === "owner";
  if (!isAuthor && !isOwner) return bad(res, "Permission denied");

  comment.text = parsed.data.text;
  await comment.save();
  const populated = await Comment.findById(comment._id).populate(
    "author",
    "name email"
  );
  return ok(res, { comment: populated });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return notFound(res, "Comment not found");
  if (comment.task.toString() !== req.params.id)
    return notFound(res, "Comment not in task");

  // only author or project owner may delete
  const isAuthor = comment.author.toString() === req.user._id.toString();
  const member = req.project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );
  const isOwner = member && member.role === "owner";
  if (!isAuthor && !isOwner) return bad(res, "Permission denied");

  await comment.deleteOne();
  return ok(res, { ok: true });
});

const attachCommentMeta = async (tasks) => {
  const results = await Promise.all(
    tasks.map(async (t) => {
      const count = await Comment.countDocuments({ task: t._id });
      const last = await Comment.findOne({ task: t._id })
        .sort("-createdAt")
        .select("author createdAt");
      return { ...t.toObject(), commentCount: count, lastComment: last };
    })
  );
  return results;
};

export const getTask = asyncHandler(async (req, res) => {
  console.log("🔍 Fetching task details for:", req.params.id);

  const task = await Task.findById(req.params.id);
  if (!task) return notFound(res, "Task not found");
  return ok(res, { task });
});

// multer in-memory storage for forwarding to Supabase
const upload = multer({ storage: multer.memoryStorage() });

export const uploadAttachmentsMiddleware = upload.array("files", 10);

export const uploadAttachments = asyncHandler(async (req, res) => {
  console.log(
    "🔼 Incoming uploadAttachments request for task:",
    req.params.id,
    "method:",
    req.method
  );

  const task = await Task.findById(req.params.id);
  if (!task) return notFound(res, "Task not found");
  if (task.project.toString() !== req.project._id.toString())
    return notFound(res, "Task not in project");

  const files = req.files || [];
  if (!files.length) return bad(res, "No files provided");

  const bucket = process.env.SUPABASE_BUCKET || "attachments";

  const uploaded = [];
  for (const f of files) {
    const ext = path.extname(f.originalname);
    const rand = crypto.randomBytes(8).toString("hex");
    const key = `projects/${task.project.toString()}/tasks/${
      task._id
    }/${Date.now()}-${rand}${ext}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(key, f.buffer, {
        contentType: f.mimetype || "application/octet-stream",
        upsert: false,
      });
    if (error) {
      // eslint-disable-next-line no-console
      console.error("Supabase upload error", error);
      continue;
    }
    const url = getPublicUrl(bucket, key);
    uploaded.push({
      url: url || key,
      name: f.originalname,
      size: f.size,
      path: key,
    });
  }

  if (!uploaded.length) return bad(res, "Failed to upload files");

  // Store url, name, size per requirements
  const toStore = uploaded.map(({ url, name, size }) => ({ url, name, size }));
  task.attachments = [...(task.attachments || []), ...toStore];
  await task.save();
  return ok(res, { task });
});

export const deleteAttachment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return notFound(res, "Task not found");
  if (task.project.toString() !== req.project._id.toString())
    return notFound(res, "Task not in project");

  const { name, url } = req.body || {};
  if (!name && !url) return bad(res, "name or url required");

  // remove from task.attachments by matching name+url or url
  const before = task.attachments?.length || 0;
  task.attachments = (task.attachments || []).filter((a) => {
    if (url) return a.url !== url;
    return a.name !== name;
  });
  const after = task.attachments.length;
  await task.save();

  try {
    const bucket = process.env.SUPABASE_BUCKET || "attachments";
    if (url && typeof url === "string") {
      const idx = url.indexOf(`/storage/v1/object/public/${bucket}/`);
      if (idx >= 0) {
        const key = url.substring(
          idx + `/storage/v1/object/public/${bucket}/`.length
        );
        await supabase.storage.from(bucket).remove([key]);
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Failed to delete from storage (best effort)", e);
  }

  return ok(res, { task, removed: before - after });
});

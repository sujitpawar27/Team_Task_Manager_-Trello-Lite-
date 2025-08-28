import { z } from "zod";
import Task from "../models/Task.js";
import Comment from "../models/Comment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { bad, created, notFound, ok } from "../utils/http.js";

export const listByProject = asyncHandler(async (req, res) => {
  const { assignee, status, q } = req.query;
  const filter = { project: req.project._id };
  if (assignee) filter.assignee = assignee;
  if (status) filter.status = status;
  if (q) filter.title = { $regex: q, $options: "i" };
  const tasks = await Task.find(filter)
    .populate("assignee", "name email")
    .sort("-createdAt");
  return ok(res, { tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  console.log("📥 Incoming Task Payload:", req.body);
  console.log("👤 Current User:", req.user?._id);
  console.log("📂 Project from middleware:", req.project?._id);

  const schema = z.object({
    project: z.string(),
    title: z.string().min(1),
    description: z.string().optional(),
    assignee: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    status: z.enum(["todo", "in_progress", "done"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
  });

  const parsed = schema.safeParse(req.body);
  console.log("✅ Parsed Result:", parsed);

  if (!parsed.success) {
    console.log("❌ Validation failed:", parsed.error.errors);
    return bad(res, parsed.error.errors[0].message);
  }

  // ensure assignee (if provided) is a member of the project
  if (parsed.data.assignee) {
    console.log("🔍 Checking assignee:", parsed.data.assignee);
    console.log("👥 Project Members:", req.project.members);

    const isMember = req.project.members.some((m) => {
      console.log("➡️ Comparing:", m, "vs", parsed.data.assignee);
      return (
        m.toString() === parsed.data.assignee ||
        (m.user && m.user.toString() === parsed.data.assignee) // if nested schema
      );
    });

    if (!isMember) {
      console.log("❌ Assignee is not a project member");
      return bad(res, "Assignee must be a project member");
    }
  }

  console.log("📝 Creating task with data:", parsed.data);
  const task = await Task.create({ ...parsed.data, createdBy: req.user._id });

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
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return bad(res, parsed.error.errors[0].message);
  const task = await Task.findById(req.params.id);
  if (!task) return notFound(res, "Task not found");
  if (task.project.toString() !== req.project._id.toString())
    return notFound(res, "Task not in project");
  // validate new assignee (including null allowed) is a member if set
  if (
    Object.prototype.hasOwnProperty.call(parsed.data, "assignee") &&
    parsed.data.assignee
  ) {
    const isMember = req.project.members.some(
      (m) => m.user.toString() === parsed.data.assignee
    );
    if (!isMember) return bad(res, "Assignee must be a project member");
  }
  task.set(parsed.data);
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
  return created(res, { comment });
});

export const listComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ task: req.params.id })
    .populate("author", "name email")
    .sort("createdAt");
  return ok(res, { comments });
});

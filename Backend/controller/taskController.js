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
  const schema = z.object({
    project: z.string(),
    title: z.string().min(1),
    description: z.string().optional(),
    assignee: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    status: z.enum(["todo", "in_progress", "done"]).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return bad(res, parsed.error.errors[0].message);
  const task = await Task.create({ ...parsed.data, createdBy: req.user._id });
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
  task.status = parsed.data.status;
  await task.save();
  return ok(res, { task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return notFound(res, "Task not found");
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

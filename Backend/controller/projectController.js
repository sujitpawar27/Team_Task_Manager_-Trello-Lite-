import { z } from "zod";
import Project from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, notFound, ok } from "../utils/http.js";
import { bad } from "../utils/http.js";

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ "members.user": req.user._id }).sort(
    "-createdAt"
  );
  return ok(res, { projects });
});

export const createProject = asyncHandler(async (req, res) => {
  console.log(req.body);

  const schema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
  });
  const { success, data, error } = schema.safeParse(req.body);
  if (!success) return bad(res, error.errors[0].message);
  const project = await Project.create({
    ...data,
    members: [{ user: req.user._id, role: "owner" }],
  });
  return created(res, { project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const schema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
  });
  const { success, data } = schema.safeParse(req.body);
  if (!success) return bad(res, "Invalid payload");
  req.project.set(data);
  await req.project.save();
  return ok(res, { project: req.project });
});

export const removeProject = asyncHandler(async (req, res) => {
  await req.project.deleteOne();
  return ok(res, { ok: true });
});

export const addMember = asyncHandler(async (req, res) => {
  const schema = z.object({
    userId: z.string(),
    role: z.enum(["member", "owner"]).default("member"),
  });
  const { success, data, error } = schema.safeParse(req.body);
  if (!success) return bad(res, error.errors[0].message);
  const exists = req.project.members.find(
    (m) => m.user.toString() === data.userId
  );
  if (!exists) req.project.members.push({ user: data.userId, role: data.role });
  await req.project.save();
  return ok(res, { project: req.project });
});

export const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  req.project.members = req.project.members.filter(
    (m) => m.user.toString() !== userId
  );
  await req.project.save();
  return ok(res, { project: req.project });
});


export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "members.user",
    "name email"
  );
  if (!project) return notFound(res, "Project not found");
  const member = project.members.find(
    (m) => m.user._id.toString() === req.user._id.toString()
  );
  if (!member) return forbidden(res, "Not a project member");
  return ok(res, { project });
});

export const getProjectOverview = asyncHandler(async (req, res) => {
  console.log(req.params.id);

  const project = await Project.findById(req.params.id);
  if (!project) return notFound(res, "Project not found");
  const isMember = project.members.some(
    (m) => m.user.toString() === req.user._id.toString()
  );

  return ok(res, {
    project: {
      id: project._id,
      name: project.name,
      description: project.description,
    },
    isMember,
  });
});

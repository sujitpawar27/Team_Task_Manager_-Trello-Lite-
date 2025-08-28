import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { forbidden, notFound } from "../utils/http.js";

export const requireProjectMember =
  (opts = { ownerOnly: false }) =>
  async (req, res, next) => {
    console.log("Checking project membership:", opts);
    let projectId =
      req.params.projectId ||
      req.body.project ||
      req.query.projectId ||
      req.params.id;
    console.log("Resolved projectId:", projectId);
    if (!projectId && req.params.id) {
      try {
        const task = await Task.findById(req.params.id).select("project");
        if (task) projectId = task.project?.toString();
      } catch (_) {
        // ignore lookup errors, will fall through to notFound
      }
    }

    if (!projectId) return notFound(res, "Project not found");

    const project = await Project.findById(projectId);
    if (!project) return notFound(res, "Project not found");
    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!member) return forbidden(res, "Not a project member");
    if (opts.ownerOnly && member.role !== "owner")
      return forbidden(res, "Owner role required");
    req.project = project;
    next();
  };

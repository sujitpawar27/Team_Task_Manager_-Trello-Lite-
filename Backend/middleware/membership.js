import Project from "../models/Project.js";
import { forbidden, notFound } from "../utils/http.js";

export const requireProjectMember =
  (opts = { ownerOnly: false }) =>
  async (req, res, next) => {
    console.log("Checking project membership:", opts);
    const projectId =
      req.params.projectId ||
      req.body.project ||
      req.query.projectId ||
      req.params.id;
    console.log("Project ID:", projectId);
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

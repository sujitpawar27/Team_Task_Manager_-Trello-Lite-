import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireProjectMember } from "../middleware/membership.js";
import {
  addMember,
  createProject,
  getProject,
  listProjects,
  removeMember,
  removeProject,
  updateProject,
} from "../controller/projectController.js";

const r = Router();

r.use(auth);

r.get("/", listProjects);
r.post("/", createProject);

r.patch("/:id", requireProjectMember({ ownerOnly: true }), updateProject);
r.delete("/:id", requireProjectMember({ ownerOnly: true }), removeProject);

r.post("/:id/members", requireProjectMember({ ownerOnly: true }), addMember);
r.delete(
  "/:id/members/:userId",
  requireProjectMember({ ownerOnly: true }),
  removeMember
);
r.get("/:id", requireProjectMember(), getProject);
export default r;

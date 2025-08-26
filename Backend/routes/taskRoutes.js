import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireProjectMember } from "../middleware/membership.js";
import {
  addComment,
  createTask,
  deleteTask,
  listByProject,
  listComments,
  moveTask,
  updateTask,
} from "../controller/taskController.js";

const r = Router();

r.use(auth);

r.get("/project/:projectId", requireProjectMember(), listByProject);

r.post("/", requireProjectMember(), createTask);

r.patch("/:id", requireProjectMember(), updateTask);
r.patch("/:id/move", requireProjectMember(), moveTask);

r.delete("/:id", requireProjectMember(), deleteTask);

r.get("/:id/comments", requireProjectMember(), listComments);
r.post("/:id/comments", requireProjectMember(), addComment);

export default r;

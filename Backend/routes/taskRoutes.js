import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireProjectMember } from "../middleware/membership.js";
import {
  addComment,
  createTask,
  deleteTask,
  updateComment,
  deleteComment,
  listByProject,
  listComments,
  moveTask,
  updateTask,
  getTask,
  uploadAttachments,
  uploadAttachmentsMiddleware,
  deleteAttachment,
} from "../controller/taskController.js";

const r = Router();

r.use(auth);

r.get("/project/:projectId", requireProjectMember(), listByProject);
r.get("/:id", requireProjectMember(), getTask);
r.post("/", requireProjectMember(), uploadAttachmentsMiddleware, createTask);

r.patch("/:id", requireProjectMember(), updateTask);
r.patch("/:id/move", requireProjectMember(), moveTask);

r.post(
  	"/:id/attachments",
  	requireProjectMember(),
  	uploadAttachmentsMiddleware,
  	uploadAttachments
);
r.delete("/:id/attachments", requireProjectMember(), deleteAttachment);

r.delete("/:id", requireProjectMember(), deleteTask);

r.get("/:id/comments", requireProjectMember(), listComments);
r.post("/:id/comments", requireProjectMember(), addComment);
r.patch("/:id/comments/:commentId", requireProjectMember(), updateComment);
r.delete("/:id/comments/:commentId", requireProjectMember(), deleteComment);

export default r;

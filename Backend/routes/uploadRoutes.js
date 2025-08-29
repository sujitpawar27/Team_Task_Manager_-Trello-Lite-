import { Router } from "express";
import {
  uploadFile,
  uploadMiddleware,
} from "../controller/uploadController.js";
import { auth } from "../middleware/auth.js";

const r = Router();

// Authenticated upload endpoint. Accepts single file in field `file`.
r.post("/", auth, uploadMiddleware, uploadFile);

export default r;

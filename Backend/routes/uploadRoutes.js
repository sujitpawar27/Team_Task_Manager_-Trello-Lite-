import { Router } from "express";
import {
  uploadFile,
  uploadMiddleware,
} from "../controller/uploadController.js";
import { auth } from "../middleware/auth.js";

const r = Router();

r.post("/", auth, uploadMiddleware, uploadFile);

export default r;

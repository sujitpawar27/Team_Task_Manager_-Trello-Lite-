import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { searchUsers } from "../controller/UserController.js";

const r = Router();
r.use(auth);
r.get("/", searchUsers);
export default r;

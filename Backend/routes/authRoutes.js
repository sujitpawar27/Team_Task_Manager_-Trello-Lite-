import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { login, me, register } from "../controller/authController.js";
const r = Router();

r.post("/register", register);
r.post("/login", login);
r.get("/me", auth, me);

export default r;

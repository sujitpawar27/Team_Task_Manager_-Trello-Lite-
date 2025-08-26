import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { bad, created, ok, unauthorized } from "../utils/http.js";

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });

export const register = asyncHandler(async (req, res) => {
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return bad(res, parsed.error.errors[0].message);
  const exists = await User.findOne({ email: parsed.data.email });
  if (exists) return bad(res, "Email already in use");
  const user = await User.create(parsed.data);
  const token = sign(user._id);
  return created(res, {
    user: { id: user._id, name: user.name, email: user.email },
    token,
  });
});

export const login = asyncHandler(async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return bad(res, parsed.error.errors[0].message);
  const user = await User.findOne({ email: parsed.data.email });
  if (!user) return unauthorized(res, "Invalid credentials");
  const okPass = await user.comparePassword(parsed.data.password);
  if (!okPass) return unauthorized(res, "Invalid credentials");
  const token = sign(user._id);
  return ok(res, {
    user: { id: user._id, name: user.name, email: user.email },
    token,
  });
});

export const me = asyncHandler(async (req, res) => {
  return ok(res, { user: req.user });
});

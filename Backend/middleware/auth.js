import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { unauthorized } from "../utils/http.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] ;
    if (!token) return unauthorized(res);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return unauthorized(res);
    req.user = user;
    next();
  } catch (e) {
    return unauthorized(res);
  }
};

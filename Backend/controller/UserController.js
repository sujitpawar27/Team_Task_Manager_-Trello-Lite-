import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok, bad } from "../utils/http.js";

export const searchUsers = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q || q.length < 1) return bad(res, "Query required");
  // search name or email
  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ],
  })
    .select("_id name email")
    .limit(10);
  return ok(res, { users });
});

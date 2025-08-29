import multer from "multer";
import { supabase, getPublicUrl } from "../lib/supabase.js";
import path from "path";
import crypto from "crypto";

// multer in-memory storage
const upload = multer({ storage: multer.memoryStorage() });
export const uploadMiddleware = upload.single("file");

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file provided" });

    const bucket = process.env.SUPABASE_BUCKET || "attachments";
    const ext = path.extname(file.originalname) || "";
    const rand = crypto.randomBytes(8).toString("hex");
    const key = `uploads/${Date.now()}-${rand}${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(key, file.buffer, {
        contentType: file.mimetype || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Supabase upload error", error);
      return res.status(500).json({ error: "Failed to upload file" });
    }

    const url = getPublicUrl(bucket, key);
    return res
      .status(200)
      .json({ url: url || null, name: file.originalname, size: file.size });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};

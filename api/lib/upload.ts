import { put } from "@vercel/blob";
import type { Request, Response } from "express";

/**
 * Expects multipart/form-data with a single file field named "file"
 * (parsed by multer upstream into req.file).
 */
export async function handleUpload(req: Request, res: Response) {
  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `uploads/${Date.now()}-${safeName}`;

    const blob = await put(key, file.buffer, {
      access: "public",
      contentType: file.mimetype,
    });

    res.status(201).json({ url: blob.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Upload failed" });
  }
}

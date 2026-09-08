import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import type { Request, Response } from "express";
import { verifyToken } from "./auth.js";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 15 * 1024 * 1024;

/**
 * POST /upload-token
 */
export async function handleUploadToken(req: Request, res: Response) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = req.body as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_TYPES,
        maximumSizeInBytes: MAX_SIZE_BYTES,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {
      },
    });
    res.status(200).json(jsonResponse);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Upload authorization failed" });
  }
}

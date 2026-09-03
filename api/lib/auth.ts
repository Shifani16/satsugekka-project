import crypto from "crypto";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

function secret(): string {
    const s = process.env.AUTH_SECRET;
    if (!s) throw new Error("Missing required env var: AUTH_SECRET");
    return s;
}

export function signToken(username: string): string {
    const payload = JSON.stringify({ u: username, exp: Date.now() + TOKEN_TTL_MS });
    const payloadB64 = Buffer.from(payload).toString("base64url");
    const sig = crypto.createHmac("sha256", secret()).update(payloadB64).digest("base64url");
    return `${payloadB64}.${sig}`;
}

export function verifyToken(token: string): { u: string; exp: number } | null {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;

  const expectedSig = crypto.createHmac("sha256", secret()).update(payloadB64).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function checkAdminCredentials(username: string, password: string): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUsername || !expectedHash) return false;
  if (username !== expectedUsername) return false;
  return bcrypt.compare(password, expectedHash);
}

/** Express middleware — protects all admin write routes. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

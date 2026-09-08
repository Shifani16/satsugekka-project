// utils/adminApi.js
const TOKEN_KEY = "admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** fetch() wrapper that attaches the admin bearer token automatically. */
export async function adminFetch(url: string, init: RequestInit = {}) {
  return fetch(url, {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...authHeaders(),
    },
  });
}

/** Uploads a file directly to Vercel Blob from the browser (bypasses the
 *  serverless function's request-body size limit) and returns its public URL. */
export async function uploadImage(baseURL: string, file: File): Promise<string> {
  const { upload } = await import("@vercel/blob/client");
  const token = getToken();

  try {
    const blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: `${baseURL}/upload-token`,
      // Passed through to the server route so it can authorize the upload.
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return blob.url;
  } catch (err: any) {
    throw new Error(err.message || "Image upload failed");
  }
}

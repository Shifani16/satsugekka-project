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

/** Uploads a file to the /upload endpoint and returns its public URL. */
export async function uploadImage(baseURL: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await adminFetch(`${baseURL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Image upload failed");
  }

  const data = await res.json();
  return data.url as string;
}

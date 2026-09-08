const GITHUB_API = "https://api.github.com";

function requiredEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

function githubConfig() {
  return {
    token: requiredEnv("GITHUB_TOKEN"),
    owner: requiredEnv("GITHUB_OWNER"),
    repo: requiredEnv("GITHUB_REPO"),
    branch: process.env.GITHUB_BRANCH || "main",
  };
}

async function githubFetch(url: string, token: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
  });
  return res;
}

/** Returns the file's current sha, or null if it doesn't exist yet. */
export async function getFileSha(filePath: string): Promise<string | null> {
  const { token, owner, repo, branch } = githubConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
  const res = await githubFetch(url, token);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getFileSha failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.sha as string;
}

/** Creates or updates a file in the repo, committing directly to the configured branch. */
export async function putFile(
  filePath: string,
  content: string,
  message: string,
): Promise<void> {
  const { token, owner, repo, branch } = githubConfig();
  const sha = await getFileSha(filePath);
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`;

  const res = await githubFetch(url, token, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub putFile failed: ${res.status} ${await res.text()}`);
  }
}

/** Deletes a file from the repo. No-ops (does not throw) if the file is already gone. */
export async function deleteFile(filePath: string, message: string): Promise<void> {
  const { token, owner, repo, branch } = githubConfig();
  const sha = await getFileSha(filePath);
  if (!sha) return;

  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await githubFetch(url, token, {
    method: "DELETE",
    body: JSON.stringify({ message, sha, branch }),
  });

  if (!res.ok) {
    throw new Error(`GitHub deleteFile failed: ${res.status} ${await res.text()}`);
  }
}

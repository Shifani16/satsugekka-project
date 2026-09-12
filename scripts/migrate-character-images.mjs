// Finds any content still pointing at supabase.co-hosted images (character
// avatars, blog/translation thumbnails), downloads them, re-uploads them to
// Vercel Blob, and rewrites the URLs. Run this locally, then commit the result.
//
// Usage:
//   npm install @vercel/blob gray-matter --no-save
//   BLOB_READ_WRITE_TOKEN=... GITHUB_TOKEN=... GITHUB_OWNER=Shifani16 \
//     GITHUB_REPO=satsugekka-project GITHUB_BRANCH=main \
//     node scripts/migrate-character-images.mjs

import { put } from "@vercel/blob";
import matter from "gray-matter";

const GITHUB_API = "https://api.github.com";
const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH = "main", BLOB_READ_WRITE_TOKEN } = process.env;

if (!BLOB_READ_WRITE_TOKEN || !GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
  console.error(
    "Set BLOB_READ_WRITE_TOKEN, GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO before running this script.",
  );
  process.exit(1);
}

function authHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function getFile(path) {
  const url = `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  const data = await res.json();
  return { sha: data.sha, content: Buffer.from(data.content, "base64").toString("utf-8") };
}

async function listDir(path) {
  const url = `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Failed to list ${path}: ${res.status}`);
  return res.json();
}

async function putFile(path, content, sha, message) {
  const url = `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch: GITHUB_BRANCH,
      sha,
    }),
  });
  if (!res.ok) throw new Error(`Failed to write ${path}: ${res.status} ${await res.text()}`);
}

async function reuploadIfSupabase(url, label) {
  if (!url || !url.includes(".supabase.co")) return url;

  console.log(`Downloading: ${label}`);
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  Failed to download (${res.status}), leaving URL as-is`);
    return url;
  }

  const contentType = res.headers.get("content-type") || "image/png";
  const buffer = Buffer.from(await res.arrayBuffer());
  const ext = contentType.split("/")[1]?.split(";")[0] || "png";
  const key = `uploads/migrated-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const blob = await put(key, buffer, { access: "public", contentType, token: BLOB_READ_WRITE_TOKEN });
  console.log(`  -> ${blob.url}`);
  return blob.url;
}

async function migrateCharacters() {
  const file = await getFile("content/characters.json");
  if (!file) return;

  const chars = JSON.parse(file.content);
  let changed = false;
  for (const char of chars) {
    const newUrl = await reuploadIfSupabase(char.char_img, `character: ${char.char_name}`);
    if (newUrl !== char.char_img) {
      char.char_img = newUrl;
      changed = true;
    }
  }

  if (changed) {
    await putFile(
      "content/characters.json",
      JSON.stringify(chars, null, 2) + "\n",
      file.sha,
      "Migrate character images off Supabase Storage",
    );
    console.log("Updated content/characters.json");
  }
}

async function migrateMarkdownDir(dirPath, label) {
  const entries = await listDir(dirPath);
  for (const entry of entries) {
    if (entry.type !== "file" || !entry.name.endsWith(".md")) continue;

    const file = await getFile(`${dirPath}/${entry.name}`);
    const { data, content } = matter(file.content);

    if (data.thumbnail_src && data.thumbnail_src.includes(".supabase.co")) {
      data.thumbnail_src = await reuploadIfSupabase(data.thumbnail_src, `${label}: ${entry.name}`);
      const updated = matter.stringify(content, data);
      await putFile(`${dirPath}/${entry.name}`, updated, file.sha, `Migrate ${label} image: ${entry.name}`);
      console.log(`Updated ${dirPath}/${entry.name}`);
    }
  }
}

await migrateCharacters();
await migrateMarkdownDir("content/blog", "blog thumbnail");
await migrateMarkdownDir("content/translation", "translation thumbnail");
console.log("Done.");

import matter from "gray-matter";
import {cached, invalidate} from "./cache.js";

const GITHUB_API = "https://api.github.com";

function githubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !owner || !repo) {
    throw new Error("Missing GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO env vars");
  }
  return { token, owner, repo, branch };
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

interface GithubDirEntry {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url: string | null;
}

async function listDirectory(dirPath: string): Promise<GithubDirEntry[]> {
  const { token, owner, repo, branch } = githubConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${dirPath}?ref=${branch}`;
  const res = await fetch(url, { headers: authHeaders(token) });

  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub listDirectory failed: ${res.status} ${await res.text()}`);

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function fetchRawFile(downloadUrl: string): Promise<string> {
  const res = await fetch(downloadUrl);
  if (!res.ok) throw new Error(`Failed to fetch raw file: ${res.status}`);
  return res.text();
}

/** Fetches a single file's content via the Contents API (works even for private repos, unlike download_url in some edge cases). */
async function fetchFileContent(filePath: string): Promise<string | null> {
  const { token, owner, repo, branch } = githubConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
  const res = await fetch(url, { headers: authHeaders(token) });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub fetchFileContent failed: ${res.status} ${await res.text()}`);

  const data = await res.json();
  if (Array.isArray(data) || !data.content) return null;
  return Buffer.from(data.content, "base64").toString("utf-8");
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ---------- Blog ----------

export interface BlogPost {
  post_id: string;
  title: string;
  content: string;
  thumbnail_src: string;
  short_description: string;
  linkhref: string;
  created_at: string;
  updated_at: string;
}

function parseBlogFile(slug: string, raw: string): BlogPost {
  const { data, content } = matter(raw);
  return {
    post_id: slug,
    title: data.title || slug,
    content,
    thumbnail_src: data.thumbnail_src || "",
    short_description: data.short_description || "",
    linkhref: `/blog/${slug}`,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || data.created_at || new Date().toISOString(),
  };
}

export async function listBlogPosts(): Promise<BlogPost[]> {
  return cached("blog:list", async () => {
    const entries = await listDirectory("content/blog");
    const files = entries.filter((e) => e.type === "file" && e.name.endsWith(".md") && e.download_url);

    const posts = await Promise.all(
      files.map(async (f) => {
        const raw = await fetchRawFile(f.download_url!);
        return parseBlogFile(f.name.replace(/\.md$/, ""), raw);
      }),
    );

    return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  });
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return cached(`blog:one:${slug}`, async () => {
    const raw = await fetchFileContent(`content/blog/${slug}.md`);
    if (!raw) return null;
    return parseBlogFile(slug, raw);
  });
}

export function buildBlogMarkdown(post: {
  title: string;
  content: string;
  thumbnail_src: string;
  short_description: string;
  created_at: string;
  updated_at: string;
}): string {
  return matter.stringify(post.content, {
    title: post.title,
    thumbnail_src: post.thumbnail_src,
    short_description: post.short_description,
    created_at: post.created_at,
    updated_at: post.updated_at,
  });
}

export function blogSlugFromTitle(title: string): string {
  return slugify(title);
}

export function blogFilePath(slug: string): string {
  return `content/blog/${slug}.md`;
}

export function invalidateBlogCache(slug?: string) {
  invalidate("blog:list");
  if (slug) invalidate(`blog:one:${slug}`);
}

// ---------- Translation ----------

export interface TranslationPost {
  translation_id: string;
  title: string;
  content: string;
  thumbnail_src: string;
  short_description: string;
  linkhref: string;
  created_at: string;
  updated_at: string;
}

function parseTranslationFile(slug: string, raw: string): TranslationPost {
  const { data, content } = matter(raw);
  return {
    translation_id: slug,
    title: data.title || slug,
    content: content.trim(),
    thumbnail_src: data.thumbnail_src || "",
    short_description: data.short_description || "",
    linkhref: `/translation/${slug}`,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || data.created_at || new Date().toISOString(),
  };
}

export async function listTranslationPosts(): Promise<TranslationPost[]> {
  return cached("translation:list", async () => {
    const entries = await listDirectory("content/translation");
    const files = entries.filter((e) => e.type === "file" && e.name.endsWith(".md") && e.download_url);

    const posts = await Promise.all(
      files.map(async (f) => {
        const raw = await fetchRawFile(f.download_url!);
        return parseTranslationFile(f.name.replace(/\.md$/, ""), raw);
      }),
    );

    return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  });
}

export async function getTranslationPost(slug: string): Promise<TranslationPost | null> {
  return cached(`translation:one:${slug}`, async () => {
    const raw = await fetchFileContent(`content/translation/${slug}.md`);
    if (!raw) return null;
    return parseTranslationFile(slug, raw);
  });
}

export function buildTranslationMarkdown(post: {
  title: string;
  content: string;
  thumbnail_src: string;
  short_description: string;
  created_at: string;
  updated_at: string;
}): string {
  return matter.stringify(post.content, {
    title: post.title,
    thumbnail_src: post.thumbnail_src,
    short_description: post.short_description,
    created_at: post.created_at,
    updated_at: post.updated_at,
  });
}

export function translationSlugFromTitle(title: string): string {
  return slugify(title);
}

export function translationFilePath(slug: string): string {
  return `content/translation/${slug}.md`;
}

export function invalidateTranslationCache(slug?: string) {
  invalidate("translation:list");
  if (slug) invalidate(`translation:one:${slug}`);
}

// ---------- Characters ----------

export interface Character {
  id: number;
  char_id: string;
  char_name: string;
  char_img: string;
  created_at: string;
  updated_at: string;
}

export async function listCharacters(): Promise<Character[]> {
  return cached("characters:list", async () => {
    const raw = await fetchFileContent("content/characters.json");
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Character[];
    } catch {
      return [];
    }
  });
}

export async function getCharacter(id: number): Promise<Character | null> {
  const chars = await listCharacters();
  return chars.find((c) => c.id === id) || null;
}

export function characterFilePath(): string {
  return "content/characters.json";
}

export function serializeCharacters(chars: Character[]): string {
  return JSON.stringify(chars, null, 2) + "\n";
}

export function invalidateCharacterCache() {
  invalidate("characters:list");
}

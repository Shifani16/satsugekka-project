import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");
const TRANSLATION_DIR = path.join(CONTENT_DIR, "translation");
const CHARACTERS_FILE = path.join(CONTENT_DIR, "characters.json");

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

export interface TranslationPost {
  translation_id: string; // slug
  title: string;
  content: string;
  thumbnail_src: string;
  short_description: string;
  linkhref: string;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: number;
  char_id: string;
  char_name: string;
  char_img: string;
  created_at: string;
  updated_at: string;
}

function safeReadDir(dir: string): string[] {
    try {
        return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    } catch {
        return [];
    }
}

function slugify(input: string): string {
    return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function listBlogPosts(): BlogPost[] {
    const files = safeReadDir(BLOG_DIR);
    const posts = files.map((file) => readBlogFile(file));
    return posts.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
}

function readBlogFile(filename: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.md$/, "");
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

export function getBlogPost(slug: string): BlogPost | null {
  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(BLOG_DIR, filename))) return null;
  return readBlogFile(filename);
}

export function buildBlogMarkdown(post: {
  title: string;
  content: string;
  thumbnail_src: string;
  short_description: string;
  created_at: string;
  updated_at: string;
}): string {
  const frontmatter = matter.stringify(post.content, {
    title: post.title,
    thumbnail_src: post.thumbnail_src,
    short_description: post.short_description,
    created_at: post.created_at,
    updated_at: post.updated_at,
  });
  return frontmatter;
}

export function blogSlugFromTitle(title: string): string {
  return slugify(title);
}

export function blogFilePath(slug: string): string {
  return `content/blog/${slug}.md`;
}

// ---------- Translation ----------

export function listTranslationPosts(): TranslationPost[] {
  const files = safeReadDir(TRANSLATION_DIR);
  const posts = files.map((file) => readTranslationFile(file));
  return posts.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

function readTranslationFile(filename: string): TranslationPost {
  const raw = fs.readFileSync(path.join(TRANSLATION_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.md$/, "");
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

export function getTranslationPost(slug: string): TranslationPost | null {
  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(TRANSLATION_DIR, filename))) return null;
  return readTranslationFile(filename);
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

// ---------- Characters ----------

export function listCharacters(): Character[] {
  try {
    const raw = fs.readFileSync(CHARACTERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getCharacter(id: number): Character | null {
  return listCharacters().find((c) => c.id === id) || null;
}

export function characterFilePath(): string {
  return "content/characters.json";
}

export function serializeCharacters(chars: Character[]): string {
  return JSON.stringify(chars, null, 2) + "\n";
}

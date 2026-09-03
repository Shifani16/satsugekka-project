// One-time migration: pulls your existing blog/translation/character data out of
// Supabase and writes it into api/content/ as Markdown/JSON files.
//
// Usage:
//   1. npm install @supabase/supabase-js gray-matter --no-save
//   2. SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/migrate-from-supabase.mjs
//   3. Review the generated files in api/content/, then commit and push them.
//   4. You can delete this script and remove @supabase/supabase-js afterward.

import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_ANON_KEY env vars before running this script.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BLOG_DIR = path.join("api", "content", "blog");
const TRANSLATION_DIR = path.join("api", "content", "translation");
const CHARACTERS_FILE = path.join("api", "content", "characters.json");

fs.mkdirSync(BLOG_DIR, { recursive: true });
fs.mkdirSync(TRANSLATION_DIR, { recursive: true });

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function migrateBlogs() {
  const { data, error } = await supabase.from("blog").select("*");
  if (error) throw error;

  for (const post of data || []) {
    const slug = slugify(post.title);
    const markdown = matter.stringify(post.content || "", {
      title: post.title,
      thumbnail_src: post.thumbnail_src || "",
      short_description: post.short_description || "",
      created_at: post.created_at || new Date().toISOString(),
      updated_at: post.updated_at || post.created_at || new Date().toISOString(),
    });
    fs.writeFileSync(path.join(BLOG_DIR, `${slug}.md`), markdown);
    console.log(`Wrote blog post: ${slug}.md`);
  }
}

async function migrateTranslations() {
  const { data, error } = await supabase.from("translation_post").select("*");
  if (error) throw error;

  for (const post of data || []) {
    const slug = slugify(post.title);
    // Old format used ";" to separate lines — convert to one line per statement.
    const content = (post.content || "")
      .split(";")
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n");

    const markdown = matter.stringify(content, {
      title: post.title,
      thumbnail_src: post.thumbnail_src || "",
      short_description: post.short_description || "",
      created_at: post.created_at || new Date().toISOString(),
      updated_at: post.updated_at || post.created_at || new Date().toISOString(),
    });
    fs.writeFileSync(path.join(TRANSLATION_DIR, `${slug}.md`), markdown);
    console.log(`Wrote translation post: ${slug}.md`);
  }
}

async function migrateCharacters() {
  const { data, error } = await supabase.from("character").select("*");
  if (error) throw error;
  fs.writeFileSync(CHARACTERS_FILE, JSON.stringify(data || [], null, 2) + "\n");
  console.log(`Wrote ${data?.length || 0} characters to characters.json`);
}

await migrateBlogs();
await migrateTranslations();
await migrateCharacters();
console.log("Migration complete. Review the files, then commit and push them.");

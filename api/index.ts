import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  listBlogPosts,
  getBlogPost,
  buildBlogMarkdown,
  blogSlugFromTitle,
  blogFilePath,
  invalidateBlogCache,
  listTranslationPosts,
  getTranslationPost,
  buildTranslationMarkdown,
  translationSlugFromTitle,
  translationFilePath,
  invalidateTranslationCache,
  listCharacters,
  getCharacter,
  characterFilePath,
  serializeCharacters,
  invalidateCharacterCache,
  type Character,
} from "./lib/content.js";
import { putFile, deleteFile } from "./lib/github.js";
import { checkAdminCredentials, signToken, requireAdmin } from "./lib/auth.js";
import { handleUploadToken } from "./lib/upload.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Satsugekka API is online!");
});

// ---------------- Blog ----------------

app.get("/my-blog", async (_req: Request, res: Response) => {
  try {
    const blogs = await listBlogPosts();
    res.status(200).json({ message: "Getting all blog data!", count: blogs.length, blogs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/my-blog/:id", async (req: Request, res: Response) => {
  try {
    const post = await getBlogPost(String(req.params.id));
    if (!post) return res.status(404).json({ error: "Blog post not found" });
    res.status(200).json(post);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/my-blog", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, content, short_description, thumbnail_src } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }

    const slug = blogSlugFromTitle(title);
    if (await getBlogPost(slug)) {
      return res.status(409).json({ error: "A post with this title already exists" });
    }

    const now = new Date().toISOString();
    const markdown = buildBlogMarkdown({
      title,
      content,
      short_description: short_description || "",
      thumbnail_src: thumbnail_src || "",
      created_at: now,
      updated_at: now,
    });

    await putFile(blogFilePath(slug), markdown, `Add blog post: ${title}`);
    invalidateBlogCache(slug);

    res.status(201).json((await getBlogPost(slug)) ?? { post_id: slug, title, content });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/my-blog/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const existing = await getBlogPost(id);
    if (!existing) return res.status(404).json({ error: "Blog post not found" });

    const { title, content, short_description, thumbnail_src } = req.body;
    const markdown = buildBlogMarkdown({
      title: title ?? existing.title,
      content: content ?? existing.content,
      short_description: short_description ?? existing.short_description,
      thumbnail_src: thumbnail_src ?? existing.thumbnail_src,
      created_at: existing.created_at,
      updated_at: new Date().toISOString(),
    });

    await putFile(blogFilePath(id), markdown, `Update blog post: ${id}`);
    invalidateBlogCache(id);
    res.status(200).json(await getBlogPost(id));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/my-blog/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await deleteFile(blogFilePath(id), `Delete blog post: ${id}`);
    invalidateBlogCache(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------- Translation ----------------

app.get("/translation-posts", async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await listTranslationPosts());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/translation-posts/:slug", async (req: Request, res: Response) => {
  try {
    const post = await getTranslationPost(String(req.params.slug));
    if (!post) return res.status(404).json({ error: "Translation post not found" });
    res.status(200).json(post);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/translation-posts", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, content, short_description, thumbnail_src } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }

    const slug = translationSlugFromTitle(title);
    if (await getTranslationPost(slug)) {
      return res.status(409).json({ error: "A post with this title already exists" });
    }

    const now = new Date().toISOString();
    const markdown = buildTranslationMarkdown({
      title,
      content,
      short_description: short_description || "",
      thumbnail_src: thumbnail_src || "",
      created_at: now,
      updated_at: now,
    });

    await putFile(translationFilePath(slug), markdown, `Add translation post: ${title}`);
    invalidateTranslationCache(slug);
    res.status(201).json(await getTranslationPost(slug));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/translation-posts/:slug", requireAdmin, async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const existing = await getTranslationPost(slug);
    if (!existing) return res.status(404).json({ error: "Translation post not found" });

    const { title, content, short_description, thumbnail_src } = req.body;
    const markdown = buildTranslationMarkdown({
      title: title ?? existing.title,
      content: content ?? existing.content,
      short_description: short_description ?? existing.short_description,
      thumbnail_src: thumbnail_src ?? existing.thumbnail_src,
      created_at: existing.created_at,
      updated_at: new Date().toISOString(),
    });

    await putFile(translationFilePath(slug), markdown, `Update translation post: ${slug}`);
    invalidateTranslationCache(slug);
    res.status(200).json(await getTranslationPost(slug));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/translation-posts/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await deleteFile(translationFilePath(id), `Delete translation post: ${id}`);
    invalidateTranslationCache(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------- Characters ----------------

app.get("/characters", async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await listCharacters());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/characters/:id", async (req: Request, res: Response) => {
  try {
    const char = await getCharacter(Number(String(req.params.id)));
    if (!char) return res.status(404).json({ error: "Character not found" });
    res.status(200).json(char);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/characters", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { char_id, char_name, char_img } = req.body;
    if (!char_id || !char_name) {
      return res.status(400).json({ error: "char_id and char_name are required" });
    }

    const chars = await listCharacters();
    const now = new Date().toISOString();
    const newChar: Character = {
      id: chars.length ? Math.max(...chars.map((c) => c.id)) + 1 : 1,
      char_id,
      char_name,
      char_img: char_img || "",
      created_at: now,
      updated_at: now,
    };
    const updated = [...chars, newChar];

    await putFile(characterFilePath(), serializeCharacters(updated), `Add character: ${char_name}`);
    invalidateCharacterCache();
    res.status(201).json(newChar);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/characters/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(String(req.params.id));
    const chars = await listCharacters();
    const idx = chars.findIndex((c) => c.id === id);
    if (idx === -1) return res.status(404).json({ error: "Character not found" });

    const updatedChar: Character = {
      ...chars[idx],
      ...req.body,
      id,
      updated_at: new Date().toISOString(),
    };
    const updated = [...chars];
    updated[idx] = updatedChar;

    await putFile(
      characterFilePath(),
      serializeCharacters(updated),
      `Update character: ${updatedChar.char_name}`,
    );
    invalidateCharacterCache();
    res.status(200).json(updatedChar);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/characters/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(String(req.params.id));
    const chars = await listCharacters();
    const updated = chars.filter((c) => c.id !== id);

    await putFile(characterFilePath(), serializeCharacters(updated), `Delete character id ${id}`);
    invalidateCharacterCache();
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------- Auth ----------------

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const ok = await checkAdminCredentials(username, password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid cred" });
  }

  const token = signToken(username);
  res.json({ success: true, message: "Welcome", token });
});

// ---------------- Uploads ----------------

app.post("/upload-token", handleUploadToken);

export default app;

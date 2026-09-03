import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer"
import {
  listBlogPosts,
  getBlogPost,
  buildBlogMarkdown,
  blogSlugFromTitle,
  blogFilePath,
  listTranslationPosts,
  getTranslationPost,
  buildTranslationMarkdown,
  translationSlugFromTitle,
  translationFilePath,
  listCharacters,
  getCharacter,
  characterFilePath,
  serializeCharacters,
  type Character,
} from "./lib/content.js";
import { putFile, deleteFile } from "./lib/github.js";
import { checkAdminCredentials, signToken, requireAdmin } from "./lib/auth.js";
import { handleUpload } from "./lib/upload.js";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024 } });

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production" || process.env.RUN_LOCAL_SERVER === "true") {
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Satsugekka API is online!");
});

// ---------------- Blog ----------------

app.get("/my-blog", (_req: Request, res: Response) => {
  const blogs = listBlogPosts();
  res.status(200).json({ message: "Getting all blog data!", count: blogs.length, blogs });
});

app.get("/my-blog/:id", (req: Request, res: Response) => {
  const post = getBlogPost(String(req.params.id));
  if (!post) return res.status(404).json({ error: "Blog post not found" });
  res.status(200).json(post);
});

app.post("/my-blog", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, content, short_description, thumbnail_src } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }

    const slug = blogSlugFromTitle(title);
    if (getBlogPost(slug)) {
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

    res.status(201).json(getBlogPost(slug) ?? { post_id: slug, title, content });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/my-blog/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const existing = getBlogPost(String(req.params.id));
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

    await putFile(blogFilePath(String(req.params.id)), markdown, `Update blog post: ${String(req.params.id)}`);
    res.status(200).json(getBlogPost(String(req.params.id)));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/my-blog/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    await deleteFile(blogFilePath(String(req.params.id)), `Delete blog post: ${String(req.params.id)}`);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------- Translation ----------------

app.get("/translation-posts", (_req: Request, res: Response) => {
  res.status(200).json(listTranslationPosts());
});

app.get("/translation-posts/:slug", (req: Request, res: Response) => {
  const post = getTranslationPost(String(req.params.slug));
  if (!post) return res.status(404).json({ error: "Translation post not found" });
  res.status(200).json(post);
});

app.post("/translation-posts", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, content, short_description, thumbnail_src } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }

    const slug = translationSlugFromTitle(title);
    if (getTranslationPost(slug)) {
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
    res.status(201).json(getTranslationPost(slug));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/translation-posts/:slug", requireAdmin, async (req: Request, res: Response) => {
  try {
    const existing = getTranslationPost(String(req.params.slug));
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

    await putFile(
      translationFilePath(String(req.params.slug)),
      markdown,
      `Update translation post: ${String(req.params.slug)}`,
    );
    res.status(200).json(getTranslationPost(String(req.params.slug)));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/translation-posts/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    await deleteFile(translationFilePath(String(req.params.id)), `Delete translation post: ${String(req.params.id)}`);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------- Characters ----------------

app.get("/characters", (_req: Request, res: Response) => {
  res.status(200).json(listCharacters());
});

app.get("/characters/:id", (req: Request, res: Response) => {
  const char = getCharacter(Number(String(req.params.id)));
  if (!char) return res.status(404).json({ error: "Character not found" });
  res.status(200).json(char);
});

app.post("/characters", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { char_id, char_name, char_img } = req.body;
    if (!char_id || !char_name) {
      return res.status(400).json({ error: "char_id and char_name are required" });
    }

    const chars = listCharacters();
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
    res.status(201).json(newChar);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/characters/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(String(req.params.id));
    const chars = listCharacters();
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
    res.status(200).json(updatedChar);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/characters/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(String(req.params.id));
    const chars = listCharacters();
    const updated = chars.filter((c) => c.id !== id);

    await putFile(characterFilePath(), serializeCharacters(updated), `Delete character id ${id}`);
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

app.post("/upload", requireAdmin, upload.single("file"), handleUpload);

export default app;

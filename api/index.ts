import express, { json, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Pool } from "pg";
import { supabase } from "./supabaseClient.js";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));

app.use(cors({ origin: '*' }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/", (req: Request, res: Response) => {
  res.send("Satsugekka API is online! 🌸");
});

app.get("/my-blog", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.status(200).json({
      message: "Getting all blog data!",
      count: data?.length || 0,
      blogs: data,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// app.post("/my-blog", async (req: Request, res: Response) => {
//   try {
//     const { title, content, linkhref, short_description, thumbnail_src } =
//       req.body;

//     const { data, error } = await supabase
//       .from("blog")
//       .insert([{ title, content, linkhref, short_description, thumbnail_src }])
//       .select()
//       .single();

//     if (error) throw error;
//     res.status(201).json(data);
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.put("/my-blog/:id", async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const { data, error } = await supabase
//       .from("blog")
//       .update(updates)
//       .eq("post_id", id)
//       .select()
//       .single();

//     if (error) throw error;
//     res.status(200).json(data);
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// });

app.get("/my-blog/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .eq("post_id", id)
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err: any) {
    res.status(404).json({ error: "Blog post not found" });
  }
});

app.delete("/my-blog/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("blog").delete().eq("post_id", id);

    if (error) throw error;
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/translation-posts/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("translation_post")
      .delete()
      .eq("translation_id", id);

    if (error) throw error;
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/translation-posts", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("translation_post")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/translation-posts/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const fullPath = `/translation/${slug}`;

    const { data, error } = await supabase
      .from("translation_post")
      .select("*")
      .eq("linkhref", fullPath)
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err: any) {
    res.status(404).json({ error: "Translation post not found" });
  }
});

app.put("/translation-posts/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const fullPath = `/translation/${slug}`;

    const { data, error } = await supabase
      .from("translation_post")
      .update(req.body)
      .eq("linkhref", fullPath)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/translation-posts", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("translation_post")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/characters", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("character").select("*");

    if (error) throw error;
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/characters/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("character")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/characters", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("character")
      .insert([req.body])
      .select()
      .single();

    if (error) throw Error;
    res.status(201).json(data)
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/characters/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("character").delete().eq("id", id);

    if (error) throw error;
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/characters/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("character")
      .update(req.body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/my-blog", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("blog")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/my-blog/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("blog")
      .update(req.body)
      .eq("post_id", id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  console.log(`Login attempt: ${username} with password: ${password}`);

  const { data: isSuccess, error } = await supabase.rpc("check_admin_login", {
    p_username: username,
    p_password: password,
  });

  if (error) {
    console.error("Supabase RPC Error:", error);
    return res.status(500).json({ message: "Database error" });
  }

  if (!isSuccess) {
    return res.status(401).json({ message: "Invalid cred" });
  }

  res.json({ success: true, message: "Welcome" });
});

export default app;
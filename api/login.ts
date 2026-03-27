import { createClient } from "@supabase/supabase-js";
import express from "express";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const { data: isSuccess, error } = await supabase.rpc("check_admin_login", {
    p_username: username,
    p_password: password,
  });

  if (error || !isSuccess) {
    return res.status(401).json({ message: "Invalid cred" });
  }

  res.json({ success: true, message: "Welcome" });
});

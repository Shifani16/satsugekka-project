// Usage: node scripts/hash-password.mjs "yourPasswordHere"
// Copy the printed hash into ADMIN_PASSWORD_HASH in your api/.env (and in Vercel's env vars).
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log(hash);

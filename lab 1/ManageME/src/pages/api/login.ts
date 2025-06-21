import type { APIRoute } from "astro";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import type { User } from "../../models/User";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGODB_URI || dotenv.config().parsed?.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}
const client = new MongoClient(uri);

const JWT_SECRET = "your_jwt_secret";
const REFRESH_SECRET = "your_refresh_secret";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let login = "";
  let password = "";

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await request.json();
    login = data.login;
    password = data.password;
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    login = form.get("login")?.toString() || "";
    password = form.get("password")?.toString() || "";
  }

  await client.connect();
  const db = client.db("manageme");
  const user = await db.collection("users").findOne<User>({ login });

  if (
    !user ||
    !user.passwordHash ||
    !(await bcrypt.compare(password, user.passwordHash))
  ) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }

  const token = jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: "7d" });

  return new Response(JSON.stringify({ token, refreshToken }), {
    status: 200,
    headers: {
      "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=900`,
      "Content-Type": "application/json"
    }
  });
};
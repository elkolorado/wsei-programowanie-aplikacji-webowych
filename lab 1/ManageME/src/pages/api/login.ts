import type { APIRoute } from "astro";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { User } from "../../models/User";

export const prerender = false;
// Example user (replace with DB lookup in real app)
const user: User = {
  id: "1",
  login: "admin",
  passwordHash: await bcrypt.hash("password123", 10), // store hash, not plain password
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  email: "admin@example.com",
};

const JWT_SECRET = "your_jwt_secret";
const REFRESH_SECRET = "your_refresh_secret";

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

  if (
    login !== user.login ||
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
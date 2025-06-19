import type { APIRoute } from "astro";
import jwt from "jsonwebtoken";
import type { User } from "../../models/User";
import bcrypt from "bcryptjs";

export const prerender = false;
// Example user (replace with DB lookup)
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

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("token")?.value;
  if (!token) return new Response(null, { status: 401 });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    if (payload.id !== user.id) throw new Error();
    // Exclude passwordHash from the response
    const { passwordHash, ...userWithoutPassword } = user;
    return new Response(JSON.stringify(userWithoutPassword), { status: 200 });
  } catch {
    return new Response(null, { status: 401 });
  }
};
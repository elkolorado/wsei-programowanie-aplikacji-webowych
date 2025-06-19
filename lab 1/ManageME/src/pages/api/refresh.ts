import type { APIRoute } from "astro";
import jwt from "jsonwebtoken";

export const prerender = false;

const JWT_SECRET = "your_jwt_secret";
const REFRESH_SECRET = "your_refresh_secret";

export const POST: APIRoute = async ({ request }) => {
  const { refreshToken } = await request.json();

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string };
    const token = jwt.sign({ id: payload.id }, JWT_SECRET, { expiresIn: "15m" });
    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid refresh token" }), { status: 401 });
  }
};
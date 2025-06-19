import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0"
    }
  });
};
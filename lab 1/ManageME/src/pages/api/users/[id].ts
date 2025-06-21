import { MongoClient } from "mongodb";
import type { APIRoute } from "astro";
import dotenv from "dotenv";
import type { User } from "../../../models/User";

dotenv.config();
const uri = process.env.MONGODB_URI || dotenv.config().parsed?.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}
const client = new MongoClient(uri);

export const GET: APIRoute = async ({ params }) => {
  const userId = params.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
  }

  await client.connect();
  const db = client.db("manageme");
  const user = await db.collection("users").findOne({ id: userId });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  // Map to User model (remove _id and passwordHash)
  const result: User = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    login: user.login,
    email: user.email,
  };
  
  return new Response(JSON.stringify(result), { status: 200 });
};
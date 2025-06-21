import { MongoClient } from "mongodb";
import type { APIRoute } from "astro";
import dotenv from "dotenv";
import type { User } from "../../models/User";

dotenv.config();
const uri = process.env.MONGODB_URI || dotenv.config().parsed?.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}
const client = new MongoClient(uri);

export const GET: APIRoute = async () => {
  await client.connect();
  const db = client.db("manageme");
  const users = await db.collection("users").find().toArray();

  // Map to User model (remove _id and passwordHash)
  const result: User[] = users.map((u: any) => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    login: u.login,
    email: u.email,
  }));

  return new Response(JSON.stringify(result), { status: 200 });
};


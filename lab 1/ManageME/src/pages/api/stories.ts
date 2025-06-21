import { MongoClient } from "mongodb";
import type { APIRoute } from "astro";
import dotenv from "dotenv";
import type { Story } from "../../models/Story";

dotenv.config();
const uri = process.env.MONGODB_URI || dotenv.config().parsed?.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI environment variable is not set");
const client = new MongoClient(uri);

export const GET: APIRoute = async () => {
  await client.connect();
  const db = client.db("manageme");
  const stories = await db.collection("stories").find().toArray();
  const result: Story[] = stories.map((s: any) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    priority: s.priority,
    projectId: s.projectId,
    createdAt: s.createdAt,
    state: s.state,
    ownerId: s.ownerId,
  }));
  return new Response(JSON.stringify(result), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  let story: Story;

  if (contentType.includes("application/json")) {
    story = await request.json();
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    story = {
      id: form.get("id")?.toString() || "",
      name: form.get("name")?.toString() || "",
      description: form.get("description")?.toString() || "",
      priority: (form.get("priority")?.toString() as "low" | "medium" | "high") || "low",
      projectId: form.get("projectId")?.toString() || "",
      createdAt: new Date().toISOString(),
      state: (["todo", "doing", "done"].includes(form.get("state")?.toString() || "") 
        ? form.get("state")?.toString() 
        : "todo") as "todo" | "doing" | "done",
      ownerId: form.get("ownerId")?.toString() || "",
    };
  } else {
    return new Response(JSON.stringify({ error: "Unsupported content type" }), { status: 400 });
  }

  if (!story.id || !story.name) {
    return new Response(JSON.stringify({ error: "Story ID and name are required" }), { status: 400 });
  }

  await client.connect();
  const db = client.db("manageme");
  await db.collection("stories").insertOne(story);

  return new Response(JSON.stringify(story), { status: 201 });
};
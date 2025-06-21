import { MongoClient } from "mongodb";
import type { APIRoute } from "astro";
import dotenv from "dotenv";
import type { Story } from "../../../models/Story";

dotenv.config();
const uri = process.env.MONGODB_URI || dotenv.config().parsed?.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI environment variable is not set");
const client = new MongoClient(uri);

export const GET: APIRoute = async ({ params }) => {
  const storyId = params.id;
  if (!storyId) {
    return new Response(JSON.stringify({ error: "Story ID is required" }), { status: 400 });
  }

    await client.connect();
    const db = client.db("manageme");
    const story = await db.collection("stories").findOne({ id: storyId });
    if (!story) {
        return new Response(JSON.stringify({ error: "Story not found" }), { status: 404 });
    }

    const result: Story = {
        id: story.id,
        name: story.name,
        description: story.description,
        priority: story.priority,
        projectId: story.projectId,
        createdAt: story.createdAt,
        state: story.state,
        ownerId: story.ownerId,
    };
    return new Response(JSON.stringify(result), { status: 200 });
};

export const DELETE: APIRoute = async ({ params }) => {
  const storyId = params.id;
  if (!storyId) {
    return new Response(JSON.stringify({ error: "Story ID is required" }), { status: 400 });
  }

  await client.connect();
  const db = client.db("manageme");
  const result = await db.collection("stories").deleteOne({ id: storyId });

  if (result.deletedCount === 0) {
    return new Response(JSON.stringify({ error: "Story not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: "Story deleted successfully" }), { status: 200 });
};

export const PUT: APIRoute = async ({ request, params }) => {
  const storyId = params.id;
  if (!storyId) {
    return new Response(JSON.stringify({ error: "Story ID is required" }), { status: 400 });
  }

  const contentType = request.headers.get("content-type") || "";
  let story: Partial<Story>;

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
  const result = await db.collection("stories").updateOne({ id: storyId }, { $set: story });

  if (result.matchedCount === 0) {
    return new Response(JSON.stringify({ error: "Story not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: "Story updated successfully" }), { status: 200 });
};


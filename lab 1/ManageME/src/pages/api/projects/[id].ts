import { MongoClient } from "mongodb";
import type { APIRoute } from "astro";
import dotenv from "dotenv";
import type { Story } from "../../../models/Project";

dotenv.config();
const uri = process.env.MONGODB_URI || dotenv.config().parsed?.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI environment variable is not set");
const client = new MongoClient(uri);

export const GET: APIRoute = async ({ params }) => {
  const projectId = params.id;
  if (!projectId) {
    return new Response(JSON.stringify({ error: "Project ID is required" }), { status: 400 });
  }

  await client.connect();
  const db = client.db("manageme");
  const project = await db.collection("projects").findOne({ id: projectId });

  if (!project) {
    return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
  }

  const result: Story = {
    id: project.id,
    name: project.name,
    description: project.description,
    // Add other fields as necessary
  };
  
  return new Response(JSON.stringify(result), { status: 200 });
};

export const DELETE: APIRoute = async ({ params }) => {
  const projectId = params.id;
  if (!projectId) {
    return new Response(JSON.stringify({ error: "Project ID is required" }), { status: 400 });
  }

  await client.connect();
  const db = client.db("manageme");
  const result = await db.collection("projects").deleteOne({ id: projectId });

  if (result.deletedCount === 0) {
    return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: "Project deleted successfully" }), { status: 200 });
};

export const PUT: APIRoute = async ({ request, params }) => {
  const projectId = params.id;
  if (!projectId) {
    return new Response(JSON.stringify({ error: "Project ID is required" }), { status: 400 });
  }

  const contentType = request.headers.get("content-type") || "";
  let project: Story;

  if (contentType.includes("application/json")) {
    project = await request.json();
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    project = {
      id: form.get("id")?.toString() || "",
      name: form.get("name")?.toString() || "",
      description: form.get("description")?.toString() || "",
      // Add other fields as necessary
    };
  } else {
    return new Response(JSON.stringify({ error: "Unsupported content type" }), { status: 400 });
  }

  if (!project.id || !project.name) {
    return new Response(JSON.stringify({ error: "Project ID and name are required" }), { status: 400 });
  }

  await client.connect();
  const db = client.db("manageme");
  const result = await db.collection("projects").updateOne(
    { id: projectId },
    { $set: project }
  );

  if (result.matchedCount === 0) {
    return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(project), { status: 200 });
};
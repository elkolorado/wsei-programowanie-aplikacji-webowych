import { MongoClient } from "mongodb";
import type { APIRoute } from "astro";
import dotenv from "dotenv";
import type { Project } from "../../models/Project";

dotenv.config();
const uri = process.env.MONGODB_URI || dotenv.config().parsed?.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI environment variable is not set");
const client = new MongoClient(uri);

export const GET: APIRoute = async () => {
  await client.connect();
  const db = client.db("manageme");
  const projects = await db.collection("projects").find().toArray();
  const result: Project[] = projects.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
  }));
  return new Response(JSON.stringify(result), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  let project: Project;

  if (contentType.includes("application/json")) {
    project = await request.json();
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    project = {
      id: form.get("id")?.toString() || "",
      name: form.get("name")?.toString() || "",
      description: form.get("description")?.toString() || "",
    };
  } else {
    return new Response(JSON.stringify({ error: "Unsupported content type" }), { status: 400 });
  }

  if (!project.id || !project.name) {
    return new Response(JSON.stringify({ error: "Project ID and name are required" }), { status: 400 });
  }

  await client.connect();
  const db = client.db("manageme");
  await db.collection("projects").insertOne(project);

  return new Response(JSON.stringify(project), { status: 201 });
};
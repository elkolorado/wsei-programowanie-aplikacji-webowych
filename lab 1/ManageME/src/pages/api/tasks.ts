import { MongoClient } from "mongodb";
import type { APIRoute } from "astro";
import dotenv from "dotenv";
import type { Task } from "../../models/Task";

dotenv.config();
const uri = process.env.MONGODB_URI || dotenv.config().parsed?.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI environment variable is not set");
const client = new MongoClient(uri);

export const GET: APIRoute = async () => {
  await client.connect();
  const db = client.db("manageme");
  const tasks = await db.collection("tasks").find().toArray();
  const result: Task[] = tasks.map((t: any) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    priority: t.priority,
    storyId: t.storyId,
    estimatedHours: t.estimatedHours,
    state: t.state,
    createdAt: t.createdAt,
    startDate: t.startDate,
    endDate: t.endDate,
    assignedUserId: t.assignedUserId,
    projectId: t.projectId,
  }));
  return new Response(JSON.stringify(result), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  let task: Task;

  if (contentType.includes("application/json")) {
    task = await request.json();
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    task = {
      id: form.get("id")?.toString() || "",
      name: form.get("name")?.toString() || "",
      description: form.get("description")?.toString() || "",
      priority: (form.get("priority")?.toString() as "low" | "medium" | "high") || "low",
      storyId: form.get("storyId")?.toString() || "",
      estimatedHours: parseFloat(form.get("estimatedHours")?.toString() || "0"),
      state: (["todo", "doing", "done"].includes(form.get("state")?.toString() || "") 
        ? form.get("state")?.toString() 
        : "todo") as "todo" | "doing" | "done",
      createdAt: new Date().toISOString(),
      startDate: form.get("startDate")?.toString() || "",
      endDate: form.get("endDate")?.toString() || "",
      assignedUserId: form.get("assignedUserId")?.toString() || "",
      projectId: form.get("projectId")?.toString() || "",
    };
  } else {
    return new Response(JSON.stringify({ error: "Unsupported content type" }), { status: 400 });
  }

  if (!task.id || !task.name) {
    return new Response(JSON.stringify({ error: "Task ID and name are required" }), { status: 400 });
  }

  await client.connect();
  const db = client.db("manageme");
  await db.collection("tasks").insertOne(task);

  return new Response(JSON.stringify(task), { status: 201 });
};


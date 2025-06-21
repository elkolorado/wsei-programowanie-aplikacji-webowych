import { MongoClient } from "mongodb";
import type { APIRoute } from "astro";
import dotenv from "dotenv";
import type { Task } from "../../../models/Task";

dotenv.config();
const uri = process.env.MONGODB_URI || dotenv.config().parsed?.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI environment variable is not set");
const client = new MongoClient(uri);

export const GET: APIRoute = async ({ params }) => {
    const taskId = params.id;
    if (!taskId) {
        return new Response(JSON.stringify({ error: "Task ID is required" }), { status: 400 });
    }

    await client.connect();
    const db = client.db("manageme");
    const task = await db.collection("tasks").findOne({ id: taskId });

    if (!task) {
        return new Response(JSON.stringify({ error: "Task not found" }), { status: 404 });
    }

    const result: Task = {
        id: task.id,
        name: task.name,
        description: task.description,
        priority: task.priority,
        storyId: task.storyId,
        estimatedHours: task.estimatedHours,
        state: task.state,
        createdAt: task.createdAt,
        startDate: task.startDate,
        endDate: task.endDate,
        assignedUserId: task.assignedUserId,
        projectId: task.projectId,
    };
    return new Response(JSON.stringify(result), { status: 200 });
}

export const DELETE: APIRoute = async ({ params }) => {
    const taskId = params.id;
    if (!taskId) {
        return new Response(JSON.stringify({ error: "Task ID is required" }), { status: 400 });
    }

    await client.connect();
    const db = client.db("manageme");
    const result = await db.collection("tasks").deleteOne({ id: taskId });

    if (result.deletedCount === 0) {
        return new Response(JSON.stringify({ error: "Task not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Task deleted successfully" }), { status: 200 });
};

export const PUT: APIRoute = async ({ request, params }) => {
    const taskId = params.id;
    if (!taskId) {
        return new Response(JSON.stringify({ error: "Task ID is required" }), { status: 400 });
    }

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
    const result = await db.collection("tasks").updateOne({ id: taskId }, { $set: task });

    if (result.matchedCount === 0) {
        return new Response(JSON.stringify({ error: "Task not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(task), { status: 200 });
}


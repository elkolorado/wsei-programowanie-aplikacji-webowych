import React, { useState } from "react";
import { TaskService} from "../services/TaskService";
import type { Task } from "../models/Task";
const AddTaskForm: React.FC = () => {
  const [task, setTask] = useState<Partial<Task>>({
    name: "",
    description: "",
    priority: "low",
    storyId: "",
    estimatedHours: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Task = {
      id: crypto.randomUUID(),
      name: task.name || "Untitled Task",
      description: task.description || "",
      priority: task.priority as Task["priority"],
      storyId: task.storyId || "default-story-id", // Replace with actual story ID
      estimatedHours: task.estimatedHours || 0,
      state: "todo" as Task["state"],
      createdAt: new Date().toISOString(),
    };

    TaskService.addTask(newTask);
    alert("Task added successfully!");
    setTask({ name: "", description: "", priority: "low", storyId: "", estimatedHours: 0 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
      </div>
      <div>
        <label>Priority:</label>
        <select
          value={task.priority}
          onChange={(e) => setTask({ ...task, priority: e.target.value as Task["priority"] })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label>Story ID:</label>
        <input
          type="text"
          value={task.storyId}
          onChange={(e) => setTask({ ...task, storyId: e.target.value })}
        />
      </div>
      <div>
        <label>Estimated Hours:</label>
        <input
          type="number"
          value={task.estimatedHours}
          onChange={(e) => setTask({ ...task, estimatedHours: parseInt(e.target.value, 10) })}
        />
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
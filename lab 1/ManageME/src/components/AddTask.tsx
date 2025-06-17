import React, { useState } from "react";
import { TaskService } from "../services/TaskService";
import type { Task } from "../models/Task";
import { StoryService } from "../services/StoryService";
import { ProjectService } from "../services/ProjectService";
const AddTaskForm: React.FC = () => {
  const [stories, setStories] = useState<{ id: string; name: string }[]>([]);

  const [task, setTask] = useState<Partial<Task>>({
    name: "",
    description: "",
    priority: "low",
    storyId: "",
    estimatedHours: 0,
  });

  React.useEffect(() => {
    const activeProject = ProjectService.getActiveProject();
    if (activeProject) {
      const projectStories = StoryService.getStoriesByProject(activeProject.id);
      setStories(projectStories.map(s => ({ id: s.id, name: s.name })));
    } else {
      setStories([]);
    }

    // subscribe to story changes
    const handleStoryChange = () => {
      const updatedStories = StoryService.getStoriesByProject(activeProject?.id || "");
      setStories(updatedStories.map(s => ({ id: s.id, name: s.name })));
    };
    StoryService.subscribe(handleStoryChange);
  }, []);

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
      projectId: ProjectService.getActiveProject()?.id || "default-project-id",
    };

    TaskService.addTask(newTask);
    alert("Task added successfully!");
    setTask({ name: "", description: "", priority: "low", storyId: "", estimatedHours: 0 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="mb-4">Add New Task</h4>
      <div className="mb-3">
        <label className="form-label">Name:</label>
        <input
          required
          type="text"
          className="form-control"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          placeholder="Enter task name"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description:</label>
        <textarea
          className="form-control"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          placeholder="Enter task description"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Priority:</label>
        <select
          className="form-select"
          value={task.priority}
          onChange={(e) => setTask({ ...task, priority: e.target.value as Task["priority"] })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Story:</label>
        <select
          required
          className="form-select"
          value={task.storyId}
          onChange={(e) => setTask({ ...task, storyId: e.target.value })}
        >
          <option value="">Select a story</option>
          {stories.map(story => (
            <option key={story.id} value={story.id}>
              {story.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Estimated Hours:</label>
        <input
          type="number"
          className="form-control"
          value={task.estimatedHours}
          onChange={(e) => setTask({ ...task, estimatedHours: parseInt(e.target.value, 10) })}
          min={0}
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
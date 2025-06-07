import React, { useState, useEffect } from "react";
import { StoryService } from "../services/StoryService";
import { ProjectService } from "../services/ProjectService";
import Button from "./Button";
import type { Story } from "../models/Story";

const StoryList: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filter, setFilter] = useState<"todo" | "doing" | "done" | "all">("all");
  const [newStory, setNewStory] = useState<Partial<Story>>({
    name: "",
    description: "",
    priority: "low",
    state: "todo",
  });
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadStoriesForActiveProject = () => {
    const activeProject = ProjectService.getActiveProject();
    if (activeProject) {
      setStories(StoryService.getStoriesByProject(activeProject.id));
    } else {
      setStories([]);
    }
  };

  useEffect(() => {
    // Load stories for the initial active project
    loadStoriesForActiveProject();

    // Subscribe to active project changes
    const handleProjectChange = () => loadStoriesForActiveProject();
    ProjectService.subscribe(handleProjectChange);

    // Cleanup subscription on unmount
    return () => {
      ProjectService.unsubscribe(handleProjectChange);
    };
  }, []);

  const handleCreateOrUpdateStory = () => {
    const activeProject = ProjectService.getActiveProject();
    if (!activeProject) {
      alert("No active project selected!");
      return;
    }

    if (editingStory) {
      // Update existing story
      const updatedStory: Story = {
        ...editingStory,
        name: newStory.name || editingStory.name,
        description: newStory.description || editingStory.description,
        priority: newStory.priority as "low" | "medium" | "high",
        state: newStory.state as "todo" | "doing" | "done",
      };
      StoryService.updateStory(updatedStory);
    } else {
      // Create new story
      const story: Story = {
        id: Date.now().toString(),
        name: newStory.name || "Untitled Story",
        description: newStory.description || "",
        priority: newStory.priority as "low" | "medium" | "high",
        projectId: activeProject.id,
        createdAt: new Date().toISOString(),
        state: newStory.state as "todo" | "doing" | "done",
        ownerId: "1", // Mocked owner ID
      };
      StoryService.addStory(story);
    }

    setStories(StoryService.getStoriesByProject(activeProject.id));
    setShowForm(false);
    setNewStory({ name: "", description: "", priority: "low", state: "todo" });
    setEditingStory(null);
  };

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
    setNewStory({
      name: story.name,
      description: story.description,
      priority: story.priority,
      state: story.state,
    });
    setShowForm(true);
  };

  const handleDeleteStory = (id: string) => {
    StoryService.deleteStory(id);
    const activeProject = ProjectService.getActiveProject();
    if (activeProject) {
      setStories(StoryService.getStoriesByProject(activeProject.id));
    }
  };

  const filteredStories =
    filter === "all"
      ? stories
      : stories.filter((story) => story.state === filter);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Stories</h3>
        <div>
          <Button onClick={() => setFilter("all")} className="btn btn-secondary btn-sm">
            All
          </Button>
          <Button onClick={() => setFilter("todo")} className="btn btn-primary btn-sm">
            Todo
          </Button>
          <Button onClick={() => setFilter("doing")} className="btn btn-warning btn-sm">
            Doing
          </Button>
          <Button onClick={() => setFilter("done")} className="btn btn-success btn-sm">
            Done
          </Button>
        </div>
      </div>

      <Button onClick={() => setShowForm(true)} className="btn btn-primary mb-3">
        {editingStory ? "Edit Story" : "Create New Story"}
      </Button>

      {showForm && (
        <div className="mb-3">
          <h4>{editingStory ? "Edit Story" : "Create New Story"}</h4>
          <div className="mb-2">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={newStory.name}
              onChange={(e) => setNewStory({ ...newStory, name: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label>Description</label>
            <textarea
              className="form-control"
              value={newStory.description}
              onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label>Priority</label>
            <select
              className="form-select"
              value={newStory.priority}
              onChange={(e) => setNewStory({ ...newStory, priority: e.target.value as "low" | "medium" | "high" })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="mb-2">
            <label>State</label>
            <select
              className="form-select"
              value={newStory.state}
              onChange={(e) => setNewStory({ ...newStory, state: e.target.value as "todo" | "doing" | "done" })}
            >
              <option value="todo">Todo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
          <Button onClick={handleCreateOrUpdateStory} className="btn btn-success me-2">
            Save
          </Button>
          <Button onClick={() => setShowForm(false)} className="btn btn-secondary">
            Cancel
          </Button>
        </div>
      )}

      <ul className="list-group">
        {filteredStories.map((story) => (
          <li key={story.id} className="list-group-item">
            <h5>{story.name}</h5>
            <p>{story.description}</p>
            <span className="badge bg-info text-dark">{story.priority}</span>
            <div className="mt-2">
              <Button
                onClick={() => handleEditStory(story)}
                className="btn btn-secondary btn-sm me-2"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteStory(story.id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
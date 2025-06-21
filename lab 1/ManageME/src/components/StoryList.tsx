import React, { useState, useEffect } from "react";
import { StoryService } from "../services/StoryService";
import { ProjectService } from "../services/ProjectService";
import Button from "./Button";
import type { Story } from "../models/Story";
import type { Project } from "../models/Project";
import Modal from "./Modal";
import { UserService } from "../services/UserService";

const StoryList: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filter, setFilter] = useState<"todo" | "doing" | "done" | "all">("all");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [storyDetails, setNewStory] = useState<Partial<Story>>({
    name: "",
    description: "",
    priority: "low",
    state: "todo",
  });
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadStoriesForActiveProject = () => {
    const activeProject = ProjectService.getActiveProject();
    setActiveProject(activeProject);
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

  const handleCreateOrUpdateStory = async () => {
    const activeProject = ProjectService.getActiveProject();
    if (!activeProject) {
      alert("No active project selected!");
      return;
    }

    if (editingStory) {
      // Update existing story
      const updatedStory: Story = {
        ...editingStory,
        name: storyDetails.name || editingStory.name,
        description: storyDetails.description || editingStory.description,
        priority: storyDetails.priority as "low" | "medium" | "high",
        state: storyDetails.state as "todo" | "doing" | "done",
      };
      StoryService.updateStory(updatedStory);
    } else {
      // Create new story
      const loggedInUser = await UserService.getLoggedInUser();
      const story: Story = {
        id: Date.now().toString(),
        name: storyDetails.name || "Untitled Story",
        description: storyDetails.description || "",
        priority: storyDetails.priority as "low" | "medium" | "high",
        projectId: activeProject.id,
        createdAt: new Date().toISOString(),
        state: storyDetails.state as "todo" | "doing" | "done",
        ownerId: loggedInUser?.id || "default-user-id",
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

  if (!activeProject) {
    return (
      <div className="alert alert-warning">
        Please select a project to view and manage stories & tasks.
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
        <div className="d-flex">
          <h3>Stories</h3>
          <Button onClick={() => setShowForm(true)} className="btn btn-primary mb-3 ms-3">
            Create New Story
          </Button>
        </div>
        <div>
          <div className="d-flex gap-2" role="group" aria-label="Story state filter">
            <Button
              onClick={() => setFilter("all")}
              className={`btn btn-sm ${filter === "all" ? "btn-dark" : "btn-outline-secondary"}`}
            >
              All
            </Button>
            <Button
              onClick={() => setFilter("todo")}
              className={`btn btn-sm ${filter === "todo" ? "btn-primary" : "btn-outline-primary"}`}
            >
              Todo
            </Button>
            <Button
              onClick={() => setFilter("doing")}
              className={`btn btn-sm ${filter === "doing" ? "btn-warning" : "btn-outline-warning"}`}
            >
              Doing
            </Button>
            <Button
              onClick={() => setFilter("done")}
              className={`btn btn-sm ${filter === "done" ? "btn-success" : "btn-outline-success"}`}
            >
              Done
            </Button>
          </div>
        </div>
      </div>

      <Modal
        openModal={showForm}
        closeModal={() => {
          setShowForm(false)
          setEditingStory(null)
          setNewStory({ name: "", description: "", priority: "low", state: "todo" });
        }}
      >
        <div className="mb-3">
          <h4>{editingStory ? "Edit Story" : "Create New Story"}</h4>
          <div className="mb-2">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={storyDetails.name}
              onChange={(e) => setNewStory({ ...storyDetails, name: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label>Description</label>
            <textarea
              className="form-control"
              value={storyDetails.description}
              onChange={(e) => setNewStory({ ...storyDetails, description: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label>Priority</label>
            <select
              className="form-select"
              value={storyDetails.priority}
              onChange={(e) => setNewStory({ ...storyDetails, priority: e.target.value as "low" | "medium" | "high" })}
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
              value={storyDetails.state}
              onChange={(e) => setNewStory({ ...storyDetails, state: e.target.value as "todo" | "doing" | "done" })}
            >
              <option value="todo">Todo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
          <Button onClick={handleCreateOrUpdateStory} className="btn btn-primary me-2 w-100">
            Save
          </Button>
        </div>
      </Modal>


      <ul className="list-group">
        {filteredStories.map((story) => (
          <li key={story.id} className="list-group-item d-flex justify-content-between align-items-start">
            <div>

              <div className="d-flex align-items-center mb-1">
                <h5 className="mb-0 me-2">{story.name}</h5>
                <span
                  className={`badge ${story.priority === "high"
                    ? "bg-danger"
                    : story.priority === "medium"
                      ? "bg-warning text-dark"
                      : "bg-info text-dark"
                    }`}
                >
                  {story.priority}
                </span>
                <span
                  className={`ms-2 badge ${story.state === "done"
                    ? "bg-success"
                    : story.state === "doing"
                      ? "bg-warning text-dark"
                      : "bg-primary"
                    }`}
                >
                  {story.state}
                </span>
              </div>
              <p className="mb-1">{story.description}</p>
              <div className="d-flex flex-wrap gap-3 text-muted small">
                <span>
                  <i className="bi bi-calendar me-1"></i>
                  Created: {new Date(story.createdAt).toLocaleDateString()}
                </span>
                <span>
                  <i className="bi bi-person me-1"></i>
                  Owner: {UserService.getUserById(story.ownerId)?.firstName || "Unknown"}
                </span>
              </div>
            </div>
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
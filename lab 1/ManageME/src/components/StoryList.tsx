import React, { useState, useEffect } from "react";
import { StoryService } from "../services/StoryService";
import type { Story } from "../services/StoryService";
import { ProjectStateService } from "../services/ProjectStateService";
import Button from "./Button";

const StoryList: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filter, setFilter] = useState<"todo" | "doing" | "done" | "all">("all");

  useEffect(() => {
    const activeProject = ProjectStateService.getActiveProject();
    if (activeProject) {
      setStories(StoryService.getStoriesByProject(activeProject.id));
    }
  }, []);

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
      <ul className="list-group">
        {filteredStories.map((story) => (
          <li key={story.id} className="list-group-item">
            <h5>{story.name}</h5>
            <p>{story.description}</p>
            <span className="badge bg-info text-dark">{story.priority}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
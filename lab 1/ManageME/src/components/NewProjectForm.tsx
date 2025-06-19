import React, { useState } from "react";
import { ProjectService } from "../services/ProjectService";
import type { Project } from "../models/Project";
import Button from "./Button";

interface NewProjectFormProps {
  onSuccess?: () => void;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
    };
    ProjectService.addProject(newProject);
    setName("");
    setDescription("");
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add New Project</h4>
      <div className="mb-3">
        <label className="form-label">Name:</label>
        <input
          required
          type="text"
          className="form-control"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Project name"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description:</label>
        <textarea
          className="form-control"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Project description"
        />
      </div>
      <Button onClick={() => {}} className="btn btn-primary w-100" >
        Add Project
      </Button>
    </form>
  );
};

export default NewProjectForm;
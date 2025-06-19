import React, { useState } from "react";
import { ProjectService } from "../services/ProjectService";
import type { Project } from "../models/Project";
import Button from "./Button";

interface EditProjectFormProps {
  project: Project;
  onSuccess?: () => void;
}

const EditProjectForm: React.FC<EditProjectFormProps> = ({ project, onSuccess }) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProject: Project = {
      ...project,
      name,
      description,
    };
    ProjectService.updateProject(updatedProject);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Edit Project</h4>
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
      <Button onClick={() => {}} className="btn btn-success w-100" >
        Save Changes
      </Button>
    </form>
  );
};

export default EditProjectForm;
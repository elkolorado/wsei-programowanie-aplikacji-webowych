import React, { useState, useEffect } from "react";
import Button from "./Button";
import { ProjectService } from "../services/ProjectService";
import type { Project } from "../models/Project";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from localStorage on component mount
  useEffect(() => {
    const storedProjects = ProjectService.getAllProjects();
    setProjects(storedProjects);
    setIsLoading(false);
  }, []);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "New Project",
      description: "Description",
    };
    ProjectService.addProject(newProject);
    setProjects(ProjectService.getAllProjects());
  };

  const deleteProject = (id: string) => {
    ProjectService.deleteProject(id);
    setProjects(ProjectService.getAllProjects());
  };

  const updateProject = (updatedProject: Project) => {
    ProjectService.updateProject(updatedProject);
    setProjects(ProjectService.getAllProjects());
  };

  return (
    <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button onClick={addProject} className="btn btn-primary">
            Add Project
          </Button>
        </div>
        <ul className="list-group">
          {isLoading ? (
            <>
              <li className="list-group-item placeholder-glow">
                <div className="d-flex justify-content-between">
                  <span className="placeholder col-12 placeholder-lg p-4"></span>
                </div>
              </li>
              <li className="list-group-item placeholder-glow">
                <div className="d-flex justify-content-between">
                  <span className="placeholder col-12 placeholder-lg p-4"></span>
                </div>
              </li>
              <li className="list-group-item placeholder-glow">
                <div className="d-flex justify-content-between">
                  <span className="placeholder col-12 placeholder-lg p-4"></span>
                </div>
              </li>
            </>
          ) : (
            projects.map((project) => (
              <li key={project.id} className="list-group-item mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{project.name}</h5>
                    <p className="mb-1 text-muted">{project.description}</p>
                  </div>
                  <div>
                    <Button
                      onClick={() => deleteProject(project.id)}
                      className="btn btn-danger btn-sm me-2"
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() =>
                        updateProject({ ...project, name: "Updated Name" })
                      }
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
  );
};

export default ProjectList;
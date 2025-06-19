import React, { useState, useEffect } from "react";
import Button from "./Button";
import { ProjectService } from "../services/ProjectService";
import type { Project } from "../models/Project";
import Modal from "./Modal";
import NewProjectForm from "./NewProjectForm";
import EditProjectForm from "./EditProjectForm";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const storedProjects = ProjectService.getAllProjects();
    setProjects(storedProjects);
    const active = ProjectService.getActiveProject?.();
    setActiveProjectId(active?.id ?? null);
    setIsLoading(false);

    // Subscribe to project changes
    const handleProjectChange = () => {
      const updatedProjects = ProjectService.getAllProjects();
      setProjects(updatedProjects);
      const activeProject = ProjectService.getActiveProject();
      setActiveProjectId(activeProject?.id ?? null);
    }
    ProjectService.subscribe(handleProjectChange);
  }, []);

  const deleteProject = (id: string) => {
    ProjectService.deleteProject(id);
    if (activeProjectId === id) setActiveProjectId(null);
  };

  const handleSetActive = (project: Project) => {
    ProjectService.setActiveProject(project);
  };

  return (
    <div>

      <Modal openModal={showNewModal} closeModal={() => setShowNewModal(false)}>
        <NewProjectForm onSuccess={() => setShowNewModal(false)} />
      </Modal>

      <Modal openModal={showEditModal} closeModal={() => setShowEditModal(false)}>
        {editingProject && (
          <EditProjectForm
            project={editingProject}
            onSuccess={() => setShowEditModal(false)}
          />
        )}
      </Modal>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button onClick={() => setShowNewModal(true)} className="btn btn-primary">
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
          </>
        ) : (
          projects.map((project) => (
            <li
              key={project.id}
              className={`list-group-item mb-2${activeProjectId === project.id ? " border-primary border-3" : ""}`}
              style={activeProjectId === project.id ? { border: "2px solid #0d6efd" } : {}}
            >
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
                    onClick={() => { setEditingProject(project); setShowEditModal(true); }
                    }
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleSetActive(project)}
                    className="btn btn-success btn-sm me-2"
                  >
                    Set Active
                  </Button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div >
  );
};

export default ProjectList;
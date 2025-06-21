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
    let isMounted = true;

    const fetchProjects = async () => {
      const storedProjects = await ProjectService.getAllProjects();
      if (isMounted) setProjects(storedProjects);
      const active = await ProjectService.getActiveProject?.();
      if (isMounted) setActiveProjectId(active?.id ?? null);
      if (isMounted) setIsLoading(false);
    };

    fetchProjects();

    // Subscribe to project changes
    const handleProjectChange = async () => {
      const updatedProjects = await ProjectService.getAllProjects();
      if (isMounted) setProjects(updatedProjects);
      const activeProject = ProjectService.getActiveProject();
      if (isMounted) setActiveProjectId(activeProject?.id ?? null);
    };
    ProjectService.subscribe(handleProjectChange);

    return () => {
      isMounted = false;
      ProjectService.unsubscribe?.(handleProjectChange);
    };
  }, []);

  const deleteProject = async (id: string) => {
    await ProjectService.deleteProject(id);
    if (activeProjectId === id) setActiveProjectId(null);
  };

  const handleSetActive = async (project: Project) => {
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
        <div className="d-flex">

          <h3>Projects</h3>
          <Button onClick={() => setShowNewModal(true)} className="btn btn-primary ms-3">
            Add Project
          </Button>
        </div>
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
              onClick={() => handleSetActive(project)}
              role="button"
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
                    className="btn btn-secondary btn-sm me-2"
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
import type { Project } from "../models/Project";

export const ProjectStateService = class {
  private static activeProject: Project | null = null;

  static setActiveProject(project: Project): void {
    this.activeProject = project;
    localStorage.setItem("active-project", JSON.stringify(project));
  }

  static getActiveProject(): Project | null {
    if (!this.activeProject) {
      const storedProject = localStorage.getItem("active-project");
      if (storedProject) {
        this.activeProject = JSON.parse(storedProject);
      }
    }
    return this.activeProject;
  }
};
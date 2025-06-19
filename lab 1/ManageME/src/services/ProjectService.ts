import { ApiService } from "./ApiService";
import type { Project } from "../models/Project";
import { StoryService } from "./StoryService";

export class ProjectService extends ApiService<Project> {
  private static instance: ProjectService = new ProjectService();
  private static activeProject: Project | null = null;
  private static listeners: ((project: Project | null) => void)[] = [];

  private constructor() {
    super("manage-me-projects");
  }

  // Static method to get all projects
  static getAllProjects(): Project[] {
    return this.instance.getAll();
  }

  // Static method to add a project
  static addProject(project: Project): void {
    this.instance.add(project);
    this.setActiveProject(project);
    this.notifyListeners();
  }

  // Static method to update a project
  static updateProject(updatedProject: Project): void {
    this.instance.update(updatedProject, (project) => project.id === updatedProject.id);
    this.notifyListeners();

  }

  // Static method to delete a project
  static deleteProject(id: string): void {
    // relation
    console.log("Deleting project with ID:", id);
    const stories = StoryService.getStoriesByProject(id);
    console.log("Found stories for project:", stories);
    stories.forEach(story => {
      StoryService.deleteStory(story.id);
    });
    this.instance.delete((project) => project.id === id);
    this.notifyListeners();

  }

  // Set the active project and notify listeners
  static setActiveProject(project: Project): void {
    this.activeProject = project;
    localStorage.setItem("active-project", JSON.stringify(project));
    this.notifyListeners();
  }

  // Get the active project
  static getActiveProject(): Project | null {
    if (!this.activeProject) {
      const storedProject = localStorage.getItem("active-project");
      if (storedProject) {
        this.activeProject = JSON.parse(storedProject);
      }
    }
    return this.activeProject;
  }

  // Subscribe to changes in the active project
  static subscribe(listener: (project: Project | null) => void): void {
    this.listeners.push(listener);
  }

  // Unsubscribe from changes in the active project
  static unsubscribe(listener: (project: Project | null) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  // Notify all listeners about the active project change
  private static notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.activeProject));
  }
}
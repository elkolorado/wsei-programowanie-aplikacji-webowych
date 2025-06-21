import { ApiService } from "./ApiService";
import type { Project } from "../models/Project";
import { StoryService } from "./StoryService";

export class ProjectService extends ApiService<Project> {
  private static instance: ProjectService = new ProjectService();
  private static activeProject: Project | null = null;
  private static listeners: ((project: Project | null) => void)[] = [];

  private constructor() {
    super("projects");
  }

  // Static method to get all projects
  static async getAllProjects(): Promise<Project[]> {
    return await this.instance.getAll();
  }

  // Static method to add a project
  static async addProject(project: Project): Promise<void> {
    await this.instance.add(project);
    this.setActiveProject(project);
    this.notifyListeners();
  }

  // Static method to update a project
  static async updateProject(updatedProject: Project): Promise<void> {
    await this.instance.update(updatedProject.id, updatedProject);
    this.notifyListeners();
  }

  // Static method to delete a project
  static async deleteProject(id: string): Promise<void> {
    console.log("Deleting project with ID:", id);
    const stories = await StoryService.getStoriesByProject(id);
    console.log("Found stories for project:", stories);
    for (const story of stories) {
      await StoryService.deleteStory(story.id);
    }
    await this.instance.delete(id);
    if (this.activeProject && this.activeProject.id === id) {
      this.activeProject = null; // Clear active project if deleted
      localStorage.removeItem("active-project");
    }
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

import type { Story } from "../models/Story";
import { ApiService } from "./ApiService";
import { TaskService } from "./TaskService";



export class StoryService extends ApiService<Story> {
  private static instance: StoryService = new StoryService();

  private constructor() {
    super("manage-me-stories");
  }

  // Static method to get all stories
  static getAllStories(): Story[] {
    return this.instance.getAll();
  }

  // Static method to get stories by project
  static getStoriesByProject(projectId: string): Story[] {
    return this.getAllStories().filter((story) => story.projectId === projectId);
  }

  // Static method to add a story
  static addStory(story: Story): void {
    this.instance.add(story);
    this.notifyListeners();
  }

  // Static method to update a story
  static updateStory(updatedStory: Story): void {
    this.instance.update(updatedStory, (story) => story.id === updatedStory.id);
    this.notifyListeners();
  }

  // Static method to delete a story
  static deleteStory(id: string): void {

    // relation
    const tasks = TaskService.getTasksByStory(id);
    tasks.forEach(task => {
      TaskService.deleteTask(task.id);
    });
    this.instance.delete((story) => story.id === id);

    this.notifyListeners();
  }

  private static listeners: Array<(stories: Story[]) => void> = [];

  // Subscribe to changes in stories
  static subscribe(listener: (stories: Story[]) => void): void {
    this.listeners.push(listener);
  }

  // Unsubscribe from changes in stories
  static unsubscribe(listener: (stories: Story[]) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  // Notify all listeners about stories change
  static notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getAllStories()));
  }
}
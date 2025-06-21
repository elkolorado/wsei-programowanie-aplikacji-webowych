import type { Story } from "../models/Story";
import { ApiService } from "./ApiService";
import { TaskService } from "./TaskService";



export class StoryService extends ApiService<Story> {
  private static instance: StoryService = new StoryService();

  private constructor() {
    super("stories");
  }

  // Static method to get all stories
  static async getAllStories(): Promise<Story[]> {
    return await this.instance.getAll();
  }

  // Static method to get stories by project
  static async getStoriesByProject(projectId: string): Promise<Story[]> {
    return (await this.getAllStories()).filter((story) => story.projectId === projectId);
  }

  // Static method to add a story
  static async addStory(story: Story): Promise<void> {
    await this.instance.add(story);
    await this.notifyListeners();
  }

  // Static method to update a story
  static async updateStory(updatedStory: Story): Promise<void> {
    await this.instance.update(updatedStory.id, updatedStory);
    await this.notifyListeners();
  }

  // Static method to delete a story
  static async deleteStory(id: string): Promise<void> {

    // relation
    const tasks = await TaskService.getTasksByStory(id);
    for (const task of tasks) {
      TaskService.deleteTask(task.id);
    }
    await this.instance.delete(id);

    await this.notifyListeners();
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
  static async notifyListeners(): Promise<void> {
    const stories = await this.getAllStories();
    this.listeners.forEach((listener) => listener(stories));
  }
}
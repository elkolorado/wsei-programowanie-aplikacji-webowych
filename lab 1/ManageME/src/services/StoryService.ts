import { ApiService } from "./ApiService";

export interface Story {
  id: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  projectId: string;
  createdAt: string;
  state: "todo" | "doing" | "done";
  ownerId: string;
}

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
  }

  // Static method to update a story
  static updateStory(updatedStory: Story): void {
    this.instance.update(updatedStory, (story) => story.id === updatedStory.id);
  }

  // Static method to delete a story
  static deleteStory(id: string): void {
    this.instance.delete((story) => story.id === id);
  }
}
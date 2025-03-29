import type { User } from "./UserService";
import type { Project } from "../models/Project";

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

const LOCAL_STORAGE_NAME = "manage-me-stories";

export const StoryService = class {
  static getAllStories(): Story[] {
    const stories = localStorage.getItem(LOCAL_STORAGE_NAME);
    return stories ? JSON.parse(stories) : [];
  }

  static getStoriesByProject(projectId: string): Story[] {
    return this.getAllStories().filter((story) => story.projectId === projectId);
  }

  static addStory(story: Story): void {
    const stories = this.getAllStories();
    stories.push(story);
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(stories));
  }

  static updateStory(updatedStory: Story): void {
    let stories = this.getAllStories();
    stories = stories.map((story) =>
      story.id === updatedStory.id ? updatedStory : story
    );
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(stories));
  }

  static deleteStory(id: string): void {
    let stories = this.getAllStories();
    stories = stories.filter((story) => story.id !== id);
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(stories));
  }
};
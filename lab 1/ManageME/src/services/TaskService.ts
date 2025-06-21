import type { Task } from "../models/Task";
import { ApiService } from "./ApiService";

export class TaskService extends ApiService<Task> {
  private static instance: TaskService = new TaskService();
  private static listeners: ((project: TaskService | null) => void)[] = [];

  private constructor() {
    super("tasks");
  }

  // Static method to get all tasks for the current project
  static async getAllTasks(): Promise<Task[]> {
    return await this.instance.getAll();
  }

  // Static method to get tasks by project
  static async getTasksByProject(projectId: string): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter((task) => task.projectId === projectId);
  }

  // Static method to get tasks by story
  static async getTasksByStory(storyId: string): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter((task) => task.storyId === storyId);
  }

  // Static method to add a task
  static async addTask(task: Task): Promise<void> {
    await this.instance.add(task);
    this.notifyListeners();
  }

  // Static method to update a task
  static async updateTask(updatedTask: Task): Promise<void> {
    await this.instance.update(updatedTask.id, updatedTask);
    this.notifyListeners();
  }

  // Static method to delete a task
  static async deleteTask(id: string): Promise<void> {
    await this.instance.delete(id);
    this.notifyListeners();
  }

  // Subscribe to changes in the task service
  static subscribe(listener: (task: TaskService | null) => void): void {
    this.listeners.push(listener);
  }

  // Unsubscribe from changes in the task service
  static unsubscribe(listener: (task: TaskService | null) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  // Notify all listeners about changes
  static notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.instance));
  }
}

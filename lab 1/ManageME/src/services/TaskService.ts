import type { Task } from "../models/Task";
import { ApiService } from "./ApiService";



export class TaskService extends ApiService<Task> {
  private static instance: TaskService = new TaskService();
    private static listeners: ((project: TaskService | null) => void)[] = [];

  private constructor() {
    super("manage-me-tasks");
  }

  // Static method to get all tasks for the current project
  static getAllTasks(): Task[] {
    return this.instance.getAll();
  }

  // Static method to get tasks by project
  static getTasksByProject(projectId: string): Task[] {
    return this.getAllTasks().filter((task) => task.projectId === projectId);
  }

  // Static method to get tasks by story
  static getTasksByStory(storyId: string): Task[] {
    return this.getAllTasks().filter((task) => task.storyId === storyId);
  }

  // Static method to add a task
  static addTask(task: Task): void {
    this.instance.add(task);
  }

  // Static method to update a task
  static updateTask(updatedTask: Task): void {
    this.instance.update(updatedTask, (task) => task.id === updatedTask.id);
  }

  // Static method to delete a task
  static deleteTask(id: string): void {
    this.instance.delete((task) => task.id === id);
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
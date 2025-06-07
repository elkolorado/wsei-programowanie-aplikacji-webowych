import type { Task } from "../models/Task";
import { ApiService } from "./ApiService";



export class TaskService extends ApiService<Task> {
  private static instance: TaskService = new TaskService();

  private constructor() {
    super("manage-me-tasks");
  }

  // Static method to get all tasks
  static getAllTasks(): Task[] {
    return this.instance.getAll();
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
}
import type { User } from "../models/User";
import { ApiService } from "./ApiService";

export class UserService extends ApiService<User> {
  private static instance: UserService = new UserService();
  private static loggedInUser: User | null = null;

  private constructor() {
    super("users");
  }

  // Static method to get all users
  static async getAllUsers(): Promise<User[]> {
    return await this.instance.getAll();
  }

  // Static method to get a user by ID
  static async getUserById(id: string): Promise<User | null> {
    return await this.instance.getById(id);
  }


  // Static method to add a user
  static async addUser(user: User): Promise<void> {
    await this.instance.add(user);
  }

  // Static method to update a user
  static async updateUser(updatedUser: User): Promise<void> {
    await this.instance.update(updatedUser.id, updatedUser);
  }

  // Static method to delete a user
  static async deleteUser(id: string): Promise<void> {
    await this.instance.delete(id);
  }

  // Static method to get the logged-in user
  static async getLoggedInUser(): Promise<User | null> {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}
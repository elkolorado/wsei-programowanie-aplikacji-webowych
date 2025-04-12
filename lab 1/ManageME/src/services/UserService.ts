import { ApiService } from "./ApiService";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
}

export class UserService extends ApiService<User> {
  private static instance: UserService = new UserService();
  private static loggedInUser: User | null = null;

  private constructor() {
    super("manage-me-users");
  }

  // Static method to get all users
  static getAllUsers(): User[] {
    return this.instance.getAll();
  }

  // Static method to add a user
  static addUser(user: User): void {
    this.instance.add(user);
  }

  // Static method to update a user
  static updateUser(updatedUser: User): void {
    this.instance.update(updatedUser, (user) => user.id === updatedUser.id);
  }

  // Static method to delete a user
  static deleteUser(id: string): void {
    this.instance.delete((user) => user.id === id);
  }

  // Static method to set the logged-in user
  static setLoggedInUser(user: User): void {
    this.loggedInUser = user;
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("logged-in-user", JSON.stringify(user));
    }
  }

  // Static method to get the logged-in user
  static getLoggedInUser(): User | null {
    if (!this.loggedInUser) {
      if (typeof window !== "undefined" && window.localStorage) {
        const storedUser = localStorage.getItem("logged-in-user");
        if (storedUser) {
          this.loggedInUser = JSON.parse(storedUser);
        }
      }
    }
    return this.loggedInUser;
  }
}
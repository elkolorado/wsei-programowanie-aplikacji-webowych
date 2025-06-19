export type UserRole = "admin" | "devops" | "developer";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  login?: string; // Optional for some operations
  passwordHash?: string; // Optional for some operations
  email?: string; // Optional for some operations
}
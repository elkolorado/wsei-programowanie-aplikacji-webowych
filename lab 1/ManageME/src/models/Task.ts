export interface Task {
  id: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  storyId: string; // Associated story
  estimatedHours: number;
  state: "todo" | "doing" | "done";
  createdAt: string;
  startDate?: string; // Populated when state changes to "doing"
  endDate?: string; // Populated when state changes to "done"
  assignedUserId?: string; // User responsible for the task
  projectId: string; // Associated project
}
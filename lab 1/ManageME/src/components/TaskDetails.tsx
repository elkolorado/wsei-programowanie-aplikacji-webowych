import React, { useState } from "react";
import { TaskService } from "../services/TaskService";
import { UserService } from "../services/UserService";
import { StoryService } from "../services/StoryService";
import Button from "./Button";
import type { Task } from "../models/Task";

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onClose }) => {
  const [assignedUserId, setAssignedUserId] = useState(task.assignedUserId || "");
  const [state, setState] = useState(task.state);

  const users = UserService.getAllUsers().filter(
    (user) => user.role === "developer" || user.role === "devops"
  );

  const handleAssignUser = () => {
    if (!assignedUserId) return;

    const updatedTask: Task = {
      ...task,
      assignedUserId,
      state: "doing",
      startDate: new Date().toISOString(),
    };
    TaskService.updateTask(updatedTask);
    setState("doing");
  };

  const handleMarkAsDone = () => {
    const updatedTask: Task = {
      ...task,
      state: "done",
      endDate: new Date().toISOString(),
    };
    TaskService.updateTask(updatedTask);
    setState("done");
    onClose(); // Close the details view after marking as done
  };

  const handleDeleteTask = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      TaskService.deleteTask(task.id);
      onClose(); // Close the details view after deletion
    }
  };

  const story = StoryService.getAllStories().find((s) => s.id === task.storyId);

  return (
    <div className="">
      <h3 className="card-title mb-3">Task Details</h3>
      <ul className="list-group list-group-flush mb-3">
        <li className="list-group-item">
          <strong>Name:</strong> {task.name}
        </li>
        <li className="list-group-item">
          <strong>Description:</strong> {task.description}
        </li>
        <li className="list-group-item">
          <strong>Priority:</strong> {task.priority}
        </li>
        <li className="list-group-item">
          <strong>Story:</strong> {story?.name || "N/A"}
        </li>
        <li className="list-group-item">
          <strong>Estimated Hours:</strong> {task.estimatedHours}
        </li>
        <li className="list-group-item">
          <strong>State:</strong> <span className={`badge bg-${state === "done" ? "success" : state === "doing" ? "primary" : "secondary"}`}>{state}</span>
        </li>
        <li className="list-group-item">
          <strong>Start Date:</strong> {task.startDate || <span className="text-muted">Not started</span>}
        </li>
        <li className="list-group-item">
          <strong>End Date:</strong> {task.endDate || <span className="text-muted">Not completed</span>}
        </li>
        <li className="list-group-item">
          <strong>Assigned User:</strong>{" "}
          {task.assignedUserId
            ? UserService.getAllUsers().find((u) => u.id === task.assignedUserId)?.firstName
            : <span className="text-muted">Not assigned</span>}
        </li>
      </ul>

      {state === "todo" && (
        <div className="mb-3">
          <label className="form-label">Assign User:</label>
          <select
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            className="form-select mb-2"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} ({user.role})
              </option>
            ))}
          </select>
          <Button onClick={handleAssignUser} className="btn btn-primary w-100">
            Assign User
          </Button>
        </div>
      )}

      {state === "doing" && (
        <Button onClick={handleMarkAsDone} className="btn btn-success w-100 mb-2">
          Mark as Done
        </Button>
      )}

      <Button onClick={handleDeleteTask} className="btn btn-danger w-100 mb-2">
        Delete Task
      </Button>
    </div>
  );
};

export default TaskDetails;
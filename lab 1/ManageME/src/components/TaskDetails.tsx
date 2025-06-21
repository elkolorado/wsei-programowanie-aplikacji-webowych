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
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState<Partial<Task>>(task);
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
    onClose();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTask: Task = {
      ...task,
      ...editTask,
    };
    TaskService.updateTask(updatedTask);
    setIsEditing(false);
    
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

  if (isEditing) {
    return (
      <form onSubmit={handleEditSubmit}>
        <h3 className="card-title mb-3">Edit Task</h3>
        <div className="mb-2">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={editTask.name}
            onChange={e => setEditTask({ ...editTask, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-2">
          <label>Description:</label>
          <textarea
            className="form-control"
            value={editTask.description}
            onChange={e => setEditTask({ ...editTask, description: e.target.value })}
          />
        </div>
        <div className="mb-2">
          <label>Priority:</label>
          <select
            className="form-select"
            value={editTask.priority}
            onChange={e => setEditTask({ ...editTask, priority: e.target.value as Task["priority"] })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-2">
          <label>Story:</label>
          <select
            className="form-select"
            value={editTask.storyId}
            onChange={e => setEditTask({ ...editTask, storyId: e.target.value })}
          >
            <option value="">Select a story</option>
            {StoryService.getAllStories().map(story => (
              <option key={story.id} value={story.id}>
                {story.name}
              </option>
            ))}
          </select>
        </div>


        <div className="mb-2">
          <label>Estimated Hours:</label>
          <input
            type="number"
            className="form-control"
            value={editTask.estimatedHours}
            onChange={e => setEditTask({ ...editTask, estimatedHours: parseInt(e.target.value, 10) })}
            min={0}
          />
        </div>
        <div className="mb-2">
          <label>State:</label>
          <select
            className="form-select"
            value={state}
            onChange={e => setEditTask({ ...editTask, state: e.target.value as Task["state"] })}
          >
            <option value="todo">Todo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="mb-2">
          <label>Start Date:</label>
          <input
            type="datetime-local"
            className="form-control"
            value={editTask.startDate || ""}
            onChange={e => setEditTask({ ...editTask, startDate: e.target.value })}
          />
        </div>
        <div className="mb-2">
          <label>End Date:</label>
          <input
            type="datetime-local"
            className="form-control"
            value={editTask.endDate || ""}
            onChange={e => setEditTask({ ...editTask, endDate: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-success w-100 mb-2">Save</button>
        <Button onClick={() => setIsEditing(false)} className="btn btn-secondary w-100 mb-2">Cancel</Button>
      </form>
    );
  }

  return (
    <div className="card p-3">
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
          <strong>State:</strong>{" "}
          <span className={`badge bg-${state === "done" ? "success" : state === "doing" ? "primary" : "secondary"}`}>
            {state}
          </span>
        </li>
        <li className="list-group-item">
          <strong>Start Date:</strong>{" "}
          {task.startDate || <span className="text-muted">Not started</span>}
        </li>
        <li className="list-group-item">
          <strong>End Date:</strong>{" "}
          {task.endDate || <span className="text-muted">Not completed</span>}
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

      <div className="d-grid gap-2">
        <Button onClick={() => setIsEditing(true)} className="btn btn-secondary mb-2">
          Edit Task
        </Button>
        <Button onClick={handleDeleteTask} className="btn btn-danger mb-2">
          Delete Task
        </Button>
      </div>
    </div>
  );
};

export default TaskDetails;
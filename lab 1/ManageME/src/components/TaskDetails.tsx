import React, { useState } from "react";
import { TaskService} from "../services/TaskService";
import type { Task } from "../services/TaskService";
import { UserService} from "../services/UserService";
import type { User } from "../services/UserService";
import { StoryService } from "../services/StoryService";
import Button from "./Button";

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
  };

  const story = StoryService.getAllStories().find((s) => s.id === task.storyId);

  return (
    <div className="task-details">
      <h3>Task Details</h3>
      <p><strong>Name:</strong> {task.name}</p>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Story:</strong> {story?.name || "N/A"}</p>
      <p><strong>Estimated Hours:</strong> {task.estimatedHours}</p>
      <p><strong>State:</strong> {state}</p>
      <p><strong>Start Date:</strong> {task.startDate || "Not started"}</p>
      <p><strong>End Date:</strong> {task.endDate || "Not completed"}</p>
      <p>
        <strong>Assigned User:</strong>{" "}
        {task.assignedUserId
          ? UserService.getAllUsers().find((u) => u.id === task.assignedUserId)?.firstName
          : "Not assigned"}
      </p>

      {state === "todo" && (
        <div>
          <label>Assign User:</label>
          <select
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            className="form-select"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} ({user.role})
              </option>
            ))}
          </select>
          <Button onClick={handleAssignUser} className="btn btn-primary mt-2">
            Assign User
          </Button>
        </div>
      )}

      {state === "doing" && (
        <Button onClick={handleMarkAsDone} className="btn btn-success mt-2">
          Mark as Done
        </Button>
      )}

      <Button onClick={onClose} className="btn btn-secondary mt-2">
        Close
      </Button>
    </div>
  );
};

export default TaskDetails;
import React, { useState, useEffect } from "react";
import { TaskService} from "../services/TaskService";
import type { Task } from "../models/Task";
import TaskDetails from "./TaskDetails";
import AddTaskForm from "./AddTask";

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(TaskService.getAllTasks());
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
    setTasks(TaskService.getAllTasks());
  };

  const renderColumn = (state: "todo" | "doing" | "done") => (
    <div className="kanban-column">
      <h4>{state.toUpperCase()}</h4>
      {tasks
        .filter((task) => task.state === state)
        .map((task) => (
          <div
            key={task.id}
            className="kanban-task"
            onClick={() => handleTaskClick(task)}
          >
            <h5>{task.name}</h5>
            <p>{task.description}</p>
          </div>
        ))}
    </div>
  );

  return (
    <div className="kanban-board">
        <h2>Kanban Board</h2>
        <AddTaskForm />
      {selectedTask && (
        <TaskDetails task={selectedTask} onClose={handleCloseDetails} />
      )}
      <div className="kanban-columns">
        {renderColumn("todo")}
        {renderColumn("doing")}
        {renderColumn("done")}
      </div>
    </div>
  );
};

export default KanbanBoard;
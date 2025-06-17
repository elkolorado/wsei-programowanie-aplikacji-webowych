import React, { useState, useEffect } from "react";
import { TaskService } from "../services/TaskService";
import type { Task } from "../models/Task";
import TaskDetails from "./TaskDetails";
import AddTaskForm from "./AddTask";
import Modal from "./Modal";
import { ProjectService } from "../services/ProjectService";

const KanbanBoard: React.FC = () => {
  const [modal, setModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(TaskService.getAllTasks());

    // subscribe to task changes
    const handleTaskChange = () => setTasks(TaskService.getAllTasks());
    TaskService.subscribe(handleTaskChange);

    ProjectService.subscribe(() => {
      const activeProject = ProjectService.getActiveProject();
      if (activeProject) {
        setTasks(TaskService.getTasksByProject(activeProject.id));
      } else {
        setTasks([]);
      }
    });
    // Cleanup subscription on unmount
    return () => {
      TaskService.unsubscribe(handleTaskChange);
    };

    // subscribe to active project changes

  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
    setTasks(TaskService.getAllTasks());
  };

  // Handle drop event to update task state
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newState: Task["state"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.state !== newState) {
      const updatedTask: Task = {
        ...task,
        state: newState,
        ...(newState === "doing" && !task.startDate ? { startDate: new Date().toISOString() } : {}),
        ...(newState === "done" && !task.endDate ? { endDate: new Date().toISOString() } : {}),
      };
      TaskService.updateTask(updatedTask);
      setTasks(TaskService.getAllTasks());
    }
  };

  const renderColumn = (state: Task["state"]) => (
    <div className="kanban-column card flex-grow-1 mx-2" onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, state)}>
      <div
        className={`card-header text-center ${state === "todo"
          ? "bg-primary text-white"
          : state === "doing"
            ? "bg-warning text-dark"
            : state === "done"
              ? "bg-success text-white"
              : ""
          }`}
      >
        <h4 className="mb-0">{state.toUpperCase()}</h4>
      </div>
      <div className="card-body p-2">
        {tasks
          .filter((task) => task.state === state)
          .map((task) => (
            <div
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
              key={task.id}
              className={`kanban-task card mb-2 shadow-sm cursor-pointer ${task.state === "todo"
                ? "border-primary"
                : task.state === "doing"
                  ? "border-warning"
                  : task.state === "done"
                    ? "border-success"
                    : ""
                }`}
              onClick={() => handleTaskClick(task)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body p-2">
                <h5 className="card-title mb-1">{task.name}</h5>
                <p className="card-text small mb-0">{task.description}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="kanban-board mt-5">
      <div className="d-flex">
        <h2>Kanban Board</h2>
        <button className="btn btn-primary ms-3" onClick={() => setModal(true)}>
          Add Task
        </button>
      </div>

      <Modal
        openModal={modal}
        closeModal={() => setModal(false)}
      >
        <AddTaskForm />

      </Modal>
      <Modal
        openModal={!!selectedTask}
        closeModal={handleCloseDetails}
      >
        {selectedTask && (
          <TaskDetails task={selectedTask} onClose={handleCloseDetails} />
        )}
      </Modal>

      <div className="d-flex justify-content-between">
        {renderColumn("todo")}
        {renderColumn("doing")}
        {renderColumn("done")}
      </div>
    </div >
  );
};

export default KanbanBoard;
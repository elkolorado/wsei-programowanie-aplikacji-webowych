import React, { useState, useEffect } from "react";
import { TaskService } from "../services/TaskService";
import type { Task } from "../models/Task";
import TaskDetails from "./TaskDetails";
import AddTaskForm from "./AddTask";
import Modal from "./Modal";
import { ProjectService } from "../services/ProjectService";
import { UserService } from "../services/UserService";
import TaskCard from "./TaskCard";
import type { User } from "../models/User";

const KanbanBoard: React.FC = () => {
  const [modal, setModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setTasks(await TaskService.getAllTasks());
    };
    fetchTasks();

    // subscribe to task changes
    const handleTaskChange = async () => setTasks(await TaskService.getAllTasks());
    TaskService.subscribe(handleTaskChange);

    ProjectService.subscribe(async () => {
      const activeProject = ProjectService.getActiveProject();
      if (activeProject) {
        setTasks(await TaskService.getTasksByProject(activeProject.id));
      } else {
        setTasks([]);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      TaskService.unsubscribe(handleTaskChange);
    };
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetails = async () => {
    setSelectedTask(null);
    setTasks(await TaskService.getAllTasks());
  };

  // Handle drop event to update task state
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newState: Task["state"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.state !== newState) {
      const updatedTask: Task = {
        ...task,
        state: newState,
        ...(newState === "todo"
          ? { startDate: undefined, endDate: undefined }
          : newState === "doing"
            ? {
              startDate: task.startDate ?? new Date().toISOString(),
              endDate: undefined
            }
            : newState === "done"
              ? {
                startDate: task.startDate ?? new Date().toISOString(),
                endDate: task.endDate ?? new Date().toISOString()
              }
              : {}),
      };
      await TaskService.updateTask(updatedTask);
      setTasks(await TaskService.getAllTasks());
    }
  };

  const handleTaskCardDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers: User[] = await UserService.getAllUsers();
      setUsers(allUsers);
    };
    fetchUsers();
  }, []);

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
          .map((task) => {
            const user = task.assignedUserId
              ? users.find((u) => u.id === task.assignedUserId)
              : null;
            return (
              <TaskCard
                key={task.id}
                task={task}
                user={user}
                onClick={handleTaskClick}
                onDragStart={handleTaskCardDragStart}
              />
            );
          })}
      </div>
    </div>
  );


  return (
    <div className="kanban-board mt-5">
      <div className="d-flex mb-4">
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


    </div>
  );
};

export default KanbanBoard;
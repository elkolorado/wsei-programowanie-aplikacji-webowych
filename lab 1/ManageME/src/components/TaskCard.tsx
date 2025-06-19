import type { Task } from "../models/Task";
import type { User } from "../models/User";

type TaskCardProps = {
    task: Task;
    user: User | null | undefined;
    onClick: (task: Task) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, user, onClick, onDragStart }) => {
    const initials = user
        ? (user.firstName?.[0] || "") + (user.lastName?.[0] || "")
        : "";
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            key={task.id}
            className={`card mb-3 shadow-sm border-3 ${task.state === "todo"
                ? "border-primary"
                : task.state === "doing"
                    ? "border-warning"
                    : task.state === "done"
                        ? "border-success"
                        : ""
                }`}
            onClick={() => onClick(task)}
            style={{ cursor: "pointer" }}
        >
            <div className="card-body d-flex align-items-start gap-3">
                {/* Avatar */}
                <div
                    className="rounded-circle bg-light border d-flex align-items-center justify-content-center fw-bold text-dark flex-shrink-0"
                    style={{ width: 48, height: 48, fontSize: 18 }}
                    title={user ? `${user.firstName} ${user.lastName}` : "Unassigned"}
                >
                    {user ? initials.toUpperCase() : "?"}
                </div>
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="card-title mb-0">{task.name}</h5>
                    </div>
                    <p className="card-text text-muted small mb-2">{task.description}</p>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                        {task.priority && (
                            <span className={`badge ${task.priority === "high"
                                ? "bg-danger"
                                : task.priority === "medium"
                                    ? "bg-warning text-dark"
                                    : "bg-secondary"
                                }`}>
                                <i className="bi bi-exclamation-circle"></i>
                                {task.priority}
                            </span>
                        )}
                        <span className="badge bg-info text-dark">
                            <i className="bi bi-clock"></i>
                            {task.estimatedHours == 0 ? "Not estimated" : task.estimatedHours + " story points"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
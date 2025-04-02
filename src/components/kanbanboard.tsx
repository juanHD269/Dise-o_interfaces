import { Task, TaskStatus } from "@/types/task";
import TaskCard from "./taskcard";

interface Props {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

const columns: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "📋 Por Hacer" },
  { status: "in-progress", label: "🚧 En Proceso" },
  { status: "done", label: "✅ Completadas" },
];

export default function KanbanBoard({ tasks, onStatusChange, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => (
        <div key={col.status}>
          <h3 className="text-lg font-semibold mb-2">{col.label}</h3>
          <div className="bg-gray-100 p-3 rounded-xl min-h-[150px] space-y-3">
            {tasks.filter((t) => t.status === col.status).length === 0 && (
              <p className="text-sm text-gray-500">Sin tareas</p>
            )}
            {tasks
              .filter((t) => t.status === col.status)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

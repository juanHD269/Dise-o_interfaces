import { Task, TaskStatus } from "@/types/task";
import { ArrowRight, ArrowLeft, Trash2 } from "lucide-react";

// ✅ Mapa para avanzar estado
const nextStatusMap: Record<TaskStatus, TaskStatus | null> = {
  todo: "in-progress",
  "in-progress": "done",
  done: null,
};

// ✅ Mapa para retroceder estado
const prevStatusMap: Record<TaskStatus, TaskStatus | null> = {
  todo: null,
  "in-progress": "todo",
  done: "in-progress",
};

interface Props {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onStatusChange, onDelete }: Props) {
  const next = nextStatusMap[task.status];
  const prev = prevStatusMap[task.status];

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border space-y-2">
      <h4 className="text-lg font-bold text-gray-900">{task.title}</h4>

      {task.description && (
        <p className="text-sm text-gray-700">{task.description}</p>
      )}

      {task.dueDate && (
        <p className="text-xs text-gray-600 flex items-center gap-1">
          <svg
            className="w-4 h-4 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {task.dueDate}
        </p>
      )}

      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-2">
          {prev && (
            <button
              onClick={() => onStatusChange(task.id, prev)}
              className="p-1.5 rounded-full bg-white border hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              title="Retroceder estado"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          {next && (
            <button
              onClick={() => onStatusChange(task.id, next)}
              className="p-1.5 rounded-full bg-white border hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              title="Avanzar estado"
            >
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-full bg-white border hover:bg-red-100 text-red-500 hover:text-red-700"
          title="Eliminar tarea"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

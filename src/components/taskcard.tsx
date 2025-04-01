"use client";
import { Task, TaskStatus } from "@/types/task";
import { Trash2, RotateCcw } from "lucide-react";

interface Props {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

const statusOrder: TaskStatus[] = ["todo", "in-progress", "done"];

export default function TaskCard({ task, onStatusChange, onDelete }: Props) {
  const currentIndex = statusOrder.indexOf(task.status);
  const nextStatus = statusOrder[currentIndex + 1];
  const prevStatus = statusOrder[currentIndex - 1];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative">
      <button
        onClick={() => onDelete(task.id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
        title="Eliminar tarea"
      >
        <Trash2 size={16} />
      </button>

      <h4 className="font-semibold text-gray-800">{task.title}</h4>

      {task.dueDate && (
        <p className="text-sm text-gray-500 mt-1">
          📅 {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
      {task.description && (
        <p className="text-sm text-gray-600 mt-2">{task.description}</p>
      )}

      <div className="flex gap-2 mt-4">
        {prevStatus && (
          <button
            onClick={() => onStatusChange(task.id, prevStatus)}
            className="text-sm flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
          >
            <RotateCcw size={14} />
            Devolver
          </button>
        )}

        {nextStatus && (
          <button
            onClick={() => onStatusChange(task.id, nextStatus)}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            Mover a: {nextStatus === "in-progress" ? "En Proceso" : "Completadas"}
          </button>
        )}
      </div>
    </div>
  );
}

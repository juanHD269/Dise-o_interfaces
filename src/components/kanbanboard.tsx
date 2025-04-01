// src/components/kanbanboard.tsx
"use client";
import { Task, TaskStatus } from "@/types/task";
import TaskCard from "./taskcard";

interface Props {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

const columns: { title: string; status: TaskStatus }[] = [
  { title: "📋 Por Hacer", status: "todo" },
  { title: "🚧 En Proceso", status: "in-progress" },
  { title: "✅ Completadas", status: "done" },
];

export default function KanbanBoard({ tasks, onStatusChange, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => {
        const filtered = tasks.filter((task) => task.status === col.status);
        return (
          <div key={col.status} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold mb-4">{col.title}</h3>
            <div className="space-y-4">
              {filtered.length > 0 ? (
                filtered.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400">Sin tareas</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

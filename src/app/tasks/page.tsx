"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/uselocalstorage";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { v4 as uuidv4 } from "uuid";
import KanbanBoard from "@/components/kanbanboard";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TasksPage() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [projects] = useLocalStorage<Project[]>("projects", []);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const searchParams = useSearchParams();
  const selectedProjectId = searchParams.get("projectId");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  if (!currentUser || !selectedProjectId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newTask: Task = {
      id: uuidv4(),
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      projectId: selectedProjectId,
      status: "todo",
    };

    setTasks([...tasks, newTask]);
    setFormData({ title: "", description: "", dueDate: "" });
  };

  const filteredTasks = tasks.filter((t) => t.projectId === selectedProjectId);

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-10 text-gray-800">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Volver al Panel Principal
      </Link>

      <section>
        <h1 className="text-2xl font-bold mb-4">📝 Crear Nueva Tarea</h1>
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow border"
        >
          <input
            type="text"
            placeholder="Título"
            className="col-span-1 p-2 rounded border placeholder:text-gray-800 text-gray-800"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Descripción"
            className="col-span-1 p-2 rounded border placeholder:text-gray-800 text-gray-800"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <input
            type="date"
            className="col-span-1 p-2 rounded border text-gray-800"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
          <button
            type="submit"
            className="mt-2 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition col-span-full md:col-auto"
          >
            Agregar Tarea
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">📌 Tareas</h2>
        <KanbanBoard
          tasks={filteredTasks}
          onStatusChange={(taskId, newStatus) => {
            const updated = tasks.map((t) =>
              t.id === taskId ? { ...t, status: newStatus } : t
            );
            setTasks(updated);
          }}
          onDelete={(taskId) => {
            const confirmDelete = confirm("¿Eliminar esta tarea?");
            if (confirmDelete) {
              setTasks(tasks.filter((t) => t.id !== taskId));
            }
          }}
        />
      </section>
    </main>
  );
}

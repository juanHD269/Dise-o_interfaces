"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/uselocalstorage";
import { Task } from "@/types/task";
import { v4 as uuidv4 } from "uuid";
import KanbanBoard from "@/components/kanbanboard";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function TasksClient() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const searchParams = useSearchParams();
  const selectedProjectId = searchParams.get("projectId");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    } else {
      window.location.href = "/login";
    }
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-indigo-600 hover:underline mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Volver al Panel Principal
      </Link>

      <section>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">📝 Crear Nueva Tarea</h1>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-4 gap-4 bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl border border-gray-200"
        >
          <input
            type="text"
            placeholder="Título"
            className="col-span-1 p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Descripción"
            className="col-span-1 p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <input
            type="date"
            className="col-span-1 p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
          <button
            type="submit"
            className="mt-2 md:mt-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all col-span-full md:col-auto"
          >
            Agregar Tarea
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📌 Tareas</h2>
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-4">
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
        </div>
      </section>
    </main>
  );
}

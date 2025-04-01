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
    projectId: "",
    assignedTo: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUser(user);

      const accessibleProjects = projects.filter(
        (p) => p.userId === user.id || p.participants.includes(user.email)
      );

      if (!selectedProjectId && accessibleProjects.length > 0) {
        setFormData((prev) => ({
          ...prev,
          projectId: accessibleProjects[0].id,
        }));
      }
    }
  }, [projects, selectedProjectId]);

  if (!currentUser) return null;

  // 🔍 Mostrar proyectos donde soy dueño o participante
  const accessibleProjects = projects.filter(
    (p) => p.userId === currentUser.id || p.participants.includes(currentUser.email)
  );

  const selectedProject = accessibleProjects.find(
    (p) => p.id === formData.projectId
  );

  // ✅ Miembros: creador + participantes sin duplicados
  const projectMembers = selectedProject
    ? Array.from(new Set([selectedProject.userId, ...selectedProject.participants]))
    : [];

  const filteredTasks = tasks.filter(
    (task) =>
      accessibleProjects.some((p) => p.id === task.projectId) &&
      (!selectedProjectId || task.projectId === selectedProjectId)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newTask: Task = {
      id: uuidv4(),
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      projectId: formData.projectId,
      status: "todo",
      assignedTo: formData.assignedTo,
    };

    setTasks([...tasks, newTask]);
    setFormData({ ...formData, title: "", description: "", dueDate: "", assignedTo: "" });
  };

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-10">
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
            className="col-span-1 p-2 rounded border"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Descripción"
            className="col-span-1 p-2 rounded border"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <input
            type="date"
            className="col-span-1 p-2 rounded border"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
          <select
            className="col-span-1 p-2 rounded border"
            value={formData.projectId}
            onChange={(e) =>
              setFormData({ ...formData, projectId: e.target.value })
            }
          >
            {accessibleProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Selector de encargado */}
          <select
            className="col-span-1 p-2 rounded border"
            value={formData.assignedTo}
            onChange={(e) =>
              setFormData({ ...formData, assignedTo: e.target.value })
            }
          >
            <option value="">Selecciona responsable</option>
            {projectMembers.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>

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
            const updatedTasks = tasks.map((t) =>
              t.id === taskId ? { ...t, status: newStatus } : t
            );
            setTasks(updatedTasks);
          }}
          onDelete={(taskId) => {
            const confirmed = confirm("¿Eliminar esta tarea?");
            if (confirmed) {
              setTasks(tasks.filter((t) => t.id !== taskId));
            }
          }}
        />
      </section>
    </main>
  );
}

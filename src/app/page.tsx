"use client";

import { useEffect, useState } from "react";
import NewProjectForm from "@/components/newprojectform";
import ProjectProgress from "@/components/projectprogress";
import { useLocalStorage } from "@/hooks/uselocalstorage";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useLocalStorage<Project[]>("projects", []);
  const [tasks] = useLocalStorage<Task[]>("tasks", []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    } else {
      window.location.href = "/login"; // 🔁 Redirige al login si no hay usuario
    }
  }, []);

  if (!currentUser) return null;

  const userProjects = projects.filter((p) => p.userId === currentUser.id);

  const handleAddProject = (project: { id: string; name: string }) => {
    setProjects([...projects, { ...project, userId: currentUser.id }]);
  };

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-10">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">👋 Hola, {currentUser.name}</h1>
        <button
          onClick={() => {
            localStorage.removeItem("currentUser");
            location.href = "/login";
          }}
          className="text-sm text-red-500 hover:underline"
        >
          Cerrar sesión
        </button>
      </header>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">📁 Mis Proyectos</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <PlusCircle size={18} />
            Nuevo Proyecto
          </button>
        </div>

        {userProjects.length === 0 ? (
          <p className="text-gray-400">Aún no tienes proyectos.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProjects.map((project) => (
              <Link
                key={project.id}
                href={`/tasks?projectId=${project.id}`}
                className="block border rounded-xl p-4 shadow hover:shadow-md transition"
              >
                <ProjectProgress project={project} tasks={tasks} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <NewProjectForm
          onClose={() => setShowForm(false)}
          onSave={handleAddProject}
        />
      )}
    </main>
  );
}

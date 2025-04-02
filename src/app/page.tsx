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
    <main className="bg-gradient-to-r from-indigo-400 to-purple-500 text-gray-100 min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">👋 Hola, {currentUser.name}</h1>
        <button
          onClick={() => {
            localStorage.removeItem("currentUser");
            location.href = "/login";
          }}
          className="text-sm text-white-500 hover:underline"
        >
          Cerrar sesión
        </button>
      </header>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">📁 Mis Proyectos</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            <PlusCircle size={20} />
            Nuevo Proyecto
          </button>
        </div>

        {userProjects.length === 0 ? (
          <p className="text-gray-200">Aún no tienes proyectos.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userProjects.map((project) => (
              <Link
                key={project.id}
                href={`/tasks?projectId=${project.id}`}
                className="block bg-white border border-gray-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-100"
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

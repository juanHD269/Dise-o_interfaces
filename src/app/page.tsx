"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/uselocalstorage";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import ProjectProgress from "@/components/projectprogress";
import { PlusCircle, LogOut } from "lucide-react";
import NewProjectForm from "@/components/newprojectform";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [projects, setProjects] = useLocalStorage<Project[]>("projects", []);
  const [tasks] = useLocalStorage<Task[]>("tasks", []);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      router.push("/login");
    } else {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  if (!currentUser) return null;

  const userProjects = projects.filter(p => p.userId === currentUser.id);

  const handleAddProject = (project: { id: string; name: string; participants: string[] }) => {
    setProjects([
      ...projects,
      {
        ...project,
        userId: currentUser.id,
      },
    ]);
  };
  

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🎯 Bienvenido, {currentUser.name}</h1>
            <p className="text-gray-500 mt-1">Tus proyectos personales</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              <PlusCircle size={18} />
              Nuevo Proyecto
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm border rounded-xl hover:bg-gray-100"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        </header>

        {userProjects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-600">
            <p>No tienes proyectos aún.</p>
          </div>
        ) : (
          <section className="grid md:grid-cols-2 gap-6">
            {userProjects.map((project) => (
              <ProjectProgress key={project.id} project={project} tasks={tasks} />
            ))}
          </section>
        )}
      </div>

      {showForm && (
        <NewProjectForm
          onClose={() => setShowForm(false)}
          onSave={handleAddProject}
        />
      )}
    </main>
  );
}

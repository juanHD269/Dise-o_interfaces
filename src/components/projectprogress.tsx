// src/components/projectprogress.tsx
"use client";
import { Task } from "@/types/task";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";

interface ProjectProgressProps {
  project: Project;
  tasks: Task[];
}

export default function ProjectProgress({ project, tasks }: ProjectProgressProps) {
  const router = useRouter();
  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const completed = projectTasks.filter((task) => task.status === "done").length;
  const total = projectTasks.length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const handleClick = () => {
    router.push(`/tasks?projectId=${project.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition cursor-pointer"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{project.name}</h3>
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-gray-600">
        {completed} de {total} tareas completadas ({progress}%)
      </p>
    </div>
  );
}

import { Project } from "@/types/project";
import { Task } from "@/types/task";

interface Props {
  project: Project;
  tasks: Task[];
}

export default function ProjectProgress({ project, tasks }: Props) {
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const completed = projectTasks.filter((t) => t.status === "done").length;
  const total = projectTasks.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
      <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-1">
        {completed} de {total} tareas completadas
      </p>
    </div>
  );
}

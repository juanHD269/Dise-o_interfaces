// src/types/task.ts
export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  projectId: string;
  status: TaskStatus;
  assignedTo?: string; // correo del responsable
}

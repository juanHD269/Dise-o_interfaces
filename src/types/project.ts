// src/types/project.ts
export interface Project {
  id: string;
  name: string;
  userId: string; // creador
  participants: string[]; // correos de participantes
}

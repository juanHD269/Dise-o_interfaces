"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  onClose: () => void;
  onSave: (project: { id: string; name: string; participants: string[] }) => void;
}

export default function NewProjectForm({ onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);

  const handleAddParticipant = () => {
    const email = participantEmail.trim();
    if (email && !participants.includes(email)) {
      setParticipants([...participants, email]);
      setParticipantEmail("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject = {
      id: uuidv4(),
      name: name.trim(),
      participants,
    };

    onSave(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Nuevo Proyecto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre del proyecto"
            className="w-full border border-gray-300 rounded-xl p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Agregar participante (correo)"
                className="flex-1 border p-2 rounded-xl"
                value={participantEmail}
                onChange={(e) => setParticipantEmail(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddParticipant}
                className="bg-blue-600 text-white px-3 rounded-xl hover:bg-blue-700"
              >
                Añadir
              </button>
            </div>
            <ul className="text-sm text-gray-600 list-disc pl-5">
              {participants.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

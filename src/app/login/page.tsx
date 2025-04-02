"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { USERS } from "@/lib/users";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      router.push("/");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-purple-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Bienvenido de nuevo</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" />
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full text-gray-700 pl-10 pr-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full text-gray-700 pl-10 pr-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white py-2 rounded-lg font-semibold transition"
          >
            Ingresar
          </button>
        </form>
        </div>
    </main>
  );
}

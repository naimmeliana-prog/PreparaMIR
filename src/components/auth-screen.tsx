"use client";
import { useState } from "react";

interface AuthScreenProps {
  onLoginSuccess: (username: string) => void;
}

export function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    setLoading(true);
    setError(null);

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Algo salió mal.");
      }

      onLoginSuccess(data.username);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl animate-fade-in">
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 text-3xl shadow-lg shadow-teal-500/20">
            🩺
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {isRegister ? "Crear cuenta MIR" : "Iniciar sesión MIR"}
            </h1>
            <p className="text-xs text-slate-400 mt-1.5">
              {isRegister
                ? "Regístrate para guardar tu progreso y chats de forma individual."
                : "Introduce tus credenciales para recuperar tus estadísticas."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre de usuario"
              disabled={loading}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-950/50 transition duration-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-950/50 transition duration-200"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-900/50 bg-rose-950/30 px-4 py-3 text-xs font-semibold text-rose-400">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 py-3.5 text-sm font-bold tracking-wide text-white shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {loading ? "Procesando..." : isRegister ? "Registrarse" : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-slate-800/60">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 hover:underline transition"
          >
            {isRegister
              ? "¿Ya tienes cuenta? Inicia sesión aquí"
              : "¿No tienes cuenta aún? Regístrate aquí"}
          </button>
        </div>
      </div>
    </div>
  );
}

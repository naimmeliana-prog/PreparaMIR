"use client";

import { useEffect, useState } from "react";
import type { Stats } from "@/lib/types";

export function StatsView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stats", { cache: "no-store" });
      if (res.ok) setStats(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-slate-400">
        <div className="animate-pulse text-sm">Cargando progreso…</div>
      </div>
    );
  }

  if (!stats || stats.totalAnswered === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="max-w-md rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-2xl">
            📊
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            Aún no tienes estadísticas
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Responde a tus primeras preguntas de test y aquí verás tu progreso
            global y por especialidad.
          </p>
          <button
            onClick={load}
            className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Actualizar
          </button>
        </div>
      </div>
    );
  }

  const accuracy = stats.accuracy;
  const accuracyColor =
    accuracy >= 75 ? "text-emerald-600" : accuracy >= 50 ? "text-amber-600" : "text-rose-600";

  const maxCat = Math.max(1, ...stats.perCategory.map((c) => c.total));

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 p-5 sm:p-8">
        {/* headline metric */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Precisión global
            </div>
            <div className={`mt-1 text-4xl font-extrabold ${accuracyColor}`}>
              {accuracy}%
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {stats.totalCorrect} aciertos de {stats.totalAnswered}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Preguntas respondidas
            </div>
            <div className="mt-1 text-4xl font-extrabold text-slate-800">
              {stats.totalAnswered}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              siguen practicando 💪
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Sesiones de chat
            </div>
            <div className="mt-1 text-4xl font-extrabold text-slate-800">
              {stats.conversations}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              conversaciones guardadas
            </div>
          </div>
        </div>

        {/* per category */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800">
              Rendimiento por especialidad
            </h3>
            <button
              onClick={load}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50"
            >
              ↻ Actualizar
            </button>
          </div>
          <div className="space-y-4">
            {stats.perCategory.map((c) => {
              const catAcc = Math.round((c.correct / c.total) * 100);
              const width = (c.total / maxCat) * 100;
              const color =
                catAcc >= 75
                  ? "bg-emerald-500"
                  : catAcc >= 50
                    ? "bg-amber-500"
                    : "bg-rose-500";
              return (
                <div key={c.category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {c.category}
                    </span>
                    <span className="text-slate-500">
                      {c.correct}/{c.total} · {catAcc}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

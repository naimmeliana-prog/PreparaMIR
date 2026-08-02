"use client";

import { useEffect, useState } from "react";
import type { Stats, CategoryStat } from "@/lib/types";

interface ExamHistoryRun {
  id: string;
  title: string;
  date: string;
  correct: number;
  wrong: number;
  blank: number;
  score: number;
  total: number;
  categories: Record<string, { total: number; correct: number }>;
}

const DEFAULT_CATEGORIES = [
  "Anatomía",
  "Cardiología",
  "Neumología",
  "Digestivo",
  "Endocrinología",
  "Neurología",
  "Infecciosas",
  "Hematología",
  "Pediatría",
  "Psiquiatría",
  "Obstetricia y Ginecología",
  "Nefrología",
];

export function StatsView() {
  const [dbStats, setDbStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<ExamHistoryRun[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // 1. Cargar del backend (para preguntas sueltas del tutor/quizzes si hay)
      const res = await fetch("/api/stats", { cache: "no-store" });
      if (res.ok) setDbStats(await res.json());
    } catch {}
    
    try {
      // 2. Cargar de localStorage (historial de exámenes realizados localmente)
      const saved = localStorage.getItem("mir_exam_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {}
    
    setLoading(false);
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

  // Combinar estadísticas de base de datos local y localStorage
  let totalAnswered = dbStats?.totalAnswered ?? 0;
  let totalCorrect = dbStats?.totalCorrect ?? 0;
  let totalWrong = totalAnswered - totalCorrect;

  // Acumular del historial local
  history.forEach((run) => {
    totalAnswered += (run.correct + run.wrong);
    totalCorrect += run.correct;
    totalWrong += run.wrong;
  });

  const accuracy = totalAnswered === 0 ? 0 : Math.round((totalCorrect / totalAnswered) * 100);
  const netPoints = Number((totalCorrect - totalWrong * 0.33).toFixed(2));
  
  // Exámenes aprobados (con >= 60% de aciertos)
  const approvedExams = history.filter((run) => {
    const runAcc = run.total === 0 ? 0 : (run.correct / run.total) * 100;
    return runAcc >= 60;
  }).length;

  // Preguntas por especialidad
  const categoryStats: Record<string, { total: number; correct: number }> = {};
  DEFAULT_CATEGORIES.forEach((cat) => {
    categoryStats[cat] = { total: 0, correct: 0 };
  });

  // Sumar de la base de datos
  if (dbStats?.perCategory) {
    dbStats.perCategory.forEach((c) => {
      if (categoryStats[c.category] !== undefined) {
        categoryStats[c.category].total += c.total;
        categoryStats[c.category].correct += c.correct;
      }
    });
  }

  // Sumar del historial local
  history.forEach((run) => {
    Object.entries(run.categories || {}).forEach(([cat, data]) => {
      const canonicalCat = DEFAULT_CATEGORIES.find(
        (c) => c.toLowerCase() === cat.toLowerCase()
      ) || cat;
      
      if (!categoryStats[canonicalCat]) {
        categoryStats[canonicalCat] = { total: 0, correct: 0 };
      }
      categoryStats[canonicalCat].total += data.total;
      categoryStats[canonicalCat].correct += data.correct;
    });
  });

  const maxCategoryTotal = Math.max(1, ...Object.values(categoryStats).map((c) => c.total));

  // Objetivo MIR (1000 preguntas)
  const GOAL = 1000;
  const goalPercent = Math.min(100, Math.round((totalAnswered / GOAL) * 100));

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/30">
      <div className="mx-auto max-w-4xl p-5 sm:p-8 space-y-6">
        
        {/* Encabezado */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📊</span>
              <div>
                <h1 className="text-2xl font-bold">Tu progreso</h1>
                <p className="mt-1 text-sm text-slate-300">Analiza tu evolución y ajusta tu plan de estudio.</p>
              </div>
            </div>
            <button
              onClick={load}
              className="rounded-xl border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/20 transition active:scale-95"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas Clave */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          <MetricCard label="Precisión global" value={`${accuracy}%`} subtitle={`${totalCorrect} de ${totalAnswered} aciertos`} highlight={accuracy >= 60} />
          <MetricCard label="Aciertos" value={totalCorrect} subtitle="correctas" />
          <MetricCard label="Puntos netos" value={netPoints} subtitle="Aciertos - Fallos/3" />
          <MetricCard label="Intentos" value={totalAnswered} subtitle="preguntas hechas" />
          <MetricCard label="Fallos totales" value={totalWrong} subtitle="incorrectas" />
          <MetricCard label="Exámenes ≥60%" value={approvedExams} subtitle="con éxito" />
        </div>

        {/* Objetivo MIR Progress Bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wide">
            <span>Objetivo MIR</span>
            <span className="text-indigo-600 font-extrabold">{totalAnswered} / {GOAL} preguntas</span>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 transition-all duration-500"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5">
            Te faltan <span className="font-bold text-slate-700">{Math.max(0, GOAL - totalAnswered)} preguntas</span> para alcanzar el objetivo de 1.000 preguntas de entrenamiento.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Evolución de aciertos */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">📈 Evolución de aciertos</h3>
            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <span className="text-3xl mb-2">📉</span>
                <p className="text-xs font-semibold text-slate-400">Realiza tu primer examen para ver tu evolución.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {history.slice(0, 5).map((run) => {
                  const runAcc = Math.round((run.correct / run.total) * 100);
                  return (
                    <div key={run.id} className="flex items-center justify-between gap-3 border-b border-slate-50 pb-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-xs font-bold text-slate-800">{run.title}</h4>
                        <span className="text-[10px] text-slate-400">{new Date(run.date).toLocaleDateString("es-ES")}</span>
                      </div>
                      <span className={[
                        "text-xs font-black px-2.5 py-1 rounded-lg",
                        runAcc >= 75 ? "bg-emerald-50 text-emerald-600" : runAcc >= 60 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                      ].join(" ")}>{runAcc}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Preguntas por especialidad */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">🧠 Preguntas por especialidad</h3>
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {Object.entries(categoryStats).map(([category, stat]) => {
                const widthPercent = stat.total === 0 ? 0 : (stat.total / maxCategoryTotal) * 100;
                const accuracy = stat.total === 0 ? 0 : Math.round((stat.correct / stat.total) * 100);
                const color = accuracy >= 75 ? "bg-emerald-500" : accuracy >= 50 ? "bg-amber-500" : "bg-rose-500";
                
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700">{category}</span>
                      <span className="text-slate-500 font-bold">{stat.correct}/{stat.total} aciertos</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${color}`}
                        style={{ width: `${stat.total === 0 ? 0 : Math.max(8, widthPercent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Historial de exámenes */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">📋 Historial de exámenes</h3>
          {history.length === 0 ? (
            <div className="py-10 text-center">
              <span className="text-3xl mb-2 block">📝</span>
              <p className="text-xs font-semibold text-slate-400">Todavía no has realizado exámenes. ¡Empieza ahora!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-2">Examen</th>
                    <th className="pb-2">Fecha</th>
                    <th className="pb-2 text-center">Nota MIR</th>
                    <th className="pb-2 text-center">Correctas</th>
                    <th className="pb-2 text-center">Incorrectas</th>
                    <th className="pb-2 text-center">Blanco</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
                  {history.map((run) => (
                    <tr key={run.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 font-bold text-slate-800">{run.title}</td>
                      <td className="py-2.5 text-slate-500">{new Date(run.date).toLocaleDateString("es-ES")}</td>
                      <td className="py-2.5 text-center text-indigo-600 font-black">{run.score.toFixed(2)}</td>
                      <td className="py-2.5 text-center text-emerald-600">{run.correct}</td>
                      <td className="py-2.5 text-center text-rose-500">{run.wrong}</td>
                      <td className="py-2.5 text-center text-slate-400">{run.blank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtitle,
  highlight = false,
}: {
  label: string;
  value: string | number;
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <div className={[
      "rounded-2xl border bg-white p-4.5 text-center shadow-sm flex flex-col justify-between",
      highlight ? "border-indigo-100 ring-2 ring-indigo-50/40" : "border-slate-200/80"
    ].join(" ")}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-tight">{label}</div>
      <div className={[
        "mt-2 text-xl font-black leading-none",
        highlight ? "text-indigo-600 text-2xl" : "text-slate-800"
      ].join(" ")}>{value}</div>
      <div className="mt-2 text-[10px] font-semibold text-slate-500 leading-none">{subtitle}</div>
    </div>
  );
}

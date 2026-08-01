"use client";

import { useMemo, useState } from "react";
import { EXAM_CATEGORIES, examQuestions } from "@/lib/exams-data";

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function GeneratorView() {
  const [count, setCount] = useState(25);
  const [category, setCategory] = useState("Todas");
  const [seed, setSeed] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const pool = useMemo(() => {
    return category === "Todas"
      ? examQuestions
      : examQuestions.filter((q) => q.category === category);
  }, [category]);

  const generated = useMemo(() => {
    return shuffle(pool).slice(0, Math.min(count, pool.length));
  }, [pool, count, seed]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl p-5 sm:p-8">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 p-6 text-white shadow-lg sm:p-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧪</span>
            <div>
              <h1 className="text-2xl font-bold">Generador de exámenes</h1>
              <p className="mt-1 text-sm text-cyan-50">
                Crea simulacros personalizados por especialidad y número de preguntas.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">N.º preguntas</span>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-slate-700">Especialidad</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            >
              <option>Todas</option>
              {EXAM_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Generar
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setShowAnswers((v) => !v)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            {showAnswers ? "Ocultar respuestas" : "Mostrar respuestas"}
          </button>
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Imprimir / Guardar PDF
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {generated.map((q, i) => (
            <article key={`${q.id}-${i}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-md bg-slate-900 px-2 py-1 text-xs font-bold text-white">{i + 1}</span>
                <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[11px] font-semibold text-cyan-700">{q.category}</span>
              </div>
              <p className="text-sm text-slate-800">{q.stem}</p>
              <ol className="mt-3 list-[upper-alpha] space-y-1 pl-5 text-sm text-slate-700">
                {q.options.map((opt, idx) => (
                  <li key={idx}>{opt}</li>
                ))}
              </ol>
              {showAnswers && (
                <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900 ring-1 ring-emerald-100">
                  <strong>Respuesta:</strong> {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                  <div className="mt-1 text-emerald-800">{q.explanation}</div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

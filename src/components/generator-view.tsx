"use client";

import { useMemo, useState, useEffect } from "react";
import { EXAM_CATEGORIES, allDatabaseQuestions } from "@/lib/exams-data";
import { Markdown } from "@/components/markdown";

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function GeneratorView() {
  const [count, setCount] = useState(25);
  const [category, setCategory] = useState("Todas");
  const [seed, setSeed] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const pool = useMemo(() => {
    return category === "Todas"
      ? allDatabaseQuestions
      : allDatabaseQuestions.filter((q) => q.category.toLowerCase().includes(category.toLowerCase()) || category.toLowerCase().includes(q.category.toLowerCase()));
  }, [category]);

  const generated = useMemo(() => {
    return shuffle(pool).slice(0, Math.min(count, pool.length));
  }, [pool, count, seed]);

  // Resetear respuestas al generar un nuevo examen
  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [generated]);

  // Calcular resultados cuando se corrige
  const results = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let blank = 0;
    for (const q of generated) {
      const a = answers[q.id];
      if (a === undefined) blank++;
      else if (a === q.correctIndex) correct++;
      else wrong++;
    }
    return { correct, wrong, blank, score: correct - wrong / 3 };
  }, [answers, generated]);

  // Guardar en el historial local al corregir
  useEffect(() => {
    if (submitted) {
      try {
        const history = JSON.parse(localStorage.getItem("mir_exam_history") || "[]");
        // Contar por categorías
        const catMap: Record<string, { total: number; correct: number }> = {};
        for (const q of generated) {
          const a = answers[q.id];
          if (!catMap[q.category]) {
            catMap[q.category] = { total: 0, correct: 0 };
          }
          catMap[q.category].total++;
          if (a === q.correctIndex) {
            catMap[q.category].correct++;
          }
        }

        const newRun = {
          id: Math.random().toString(36).substr(2, 9),
          title: `Generador (${category} - ${generated.length} q)`,
          date: new Date().toISOString(),
          correct: results.correct,
          wrong: results.wrong,
          blank: results.blank,
          score: results.score,
          total: generated.length,
          categories: catMap
        };

        history.unshift(newRun);
        localStorage.setItem("mir_exam_history", JSON.stringify(history));
      } catch (err) {
        console.error("Error saving generated exam run:", err);
      }
    }
  }, [submitted, generated, answers, results, category]);

  const handleGenerate = () => {
    setSeed((s) => s + 1);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/30">
      <div className="mx-auto max-w-5xl p-5 sm:p-8">
        {/* Encabezado */}
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

        {/* Panel de Configuración */}
        <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">N.º preguntas</span>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              disabled={submitted}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-cyan-500 transition"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>{n} preguntas</option>
              ))}
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-slate-700">Especialidad</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={submitted}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-cyan-500 transition"
            >
              <option>Todas</option>
              {EXAM_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button
              onClick={handleGenerate}
              className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition active:scale-95"
            >
              Generar examen
            </button>
          </div>
        </div>

        {/* Botones de Control de Examen */}
        <div className="mt-4 flex flex-wrap gap-2">
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              className="rounded-lg bg-cyan-600 px-4.5 py-2 text-sm font-bold text-white hover:bg-cyan-700 shadow-md shadow-cyan-600/10 transition active:scale-95"
            >
              ✓ Corregir examen
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="rounded-lg border border-slate-200 bg-white px-4.5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition active:scale-95"
            >
              ↻ Reiniciar
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95"
          >
            Imprimir / Guardar PDF
          </button>
        </div>

        {/* Marcador de Resultados al Corregir */}
        {submitted && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Resultados del simulacro personalizado</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ResultStat label="Aciertos" value={results.correct} tone="emerald" />
              <ResultStat label="Fallos" value={results.wrong} tone="rose" />
              <ResultStat label="En blanco" value={results.blank} tone="slate" />
              <ResultStat label="Nota neta" value={results.score.toFixed(2)} tone="cyan" />
            </div>
          </div>
        )}

        {/* Lista de preguntas del examen */}
        <div className="mt-6 space-y-4">
          {generated.map((q, i) => (
            <article key={`${q.id}-${i}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
                <span className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">{i + 1}</span>
                <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-700">{q.category}</span>
                {q.image && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">🖼️ imagen</span>}
              </div>
              <div className="px-5 py-4.5">
                <p className="text-sm leading-relaxed text-slate-800 font-medium">{q.stem}</p>
                
                <div className="mt-3.5 space-y-2">
                  {q.options.map((opt, idx) => {
                    const selected = answers[q.id] === idx;
                    const right = idx === q.correctIndex;
                    const state = submitted 
                      ? (right ? "right" : selected ? "wrong" : "muted") 
                      : selected ? "selected" : "idle";
                    
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={submitted}
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition duration-150",
                          state === "idle" && "border-slate-200 bg-white hover:border-cyan-400 hover:bg-cyan-50/30",
                          state === "selected" && "border-cyan-500 bg-cyan-50",
                          state === "right" && "border-emerald-400 bg-emerald-50",
                          state === "wrong" && "border-rose-400 bg-rose-50",
                          state === "muted" && "border-slate-100 bg-slate-50 opacity-60"
                        )}
                      >
                        <span className={cn(
                          "flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition",
                          state === "idle" && "bg-slate-100 text-slate-600",
                          state === "selected" && "bg-cyan-500 text-white",
                          state === "right" && "bg-emerald-500 text-white",
                          state === "wrong" && "bg-rose-500 text-white",
                          state === "muted" && "bg-slate-200 text-slate-400"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 text-slate-700 leading-normal">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100 text-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Justificación del Test</span>
                    <div className="text-slate-700 leading-relaxed"><Markdown content={q.explanation} /></div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultStat({ label, value, tone }: { label: string; value: number | string; tone: "emerald" | "rose" | "slate" | "cyan" }) {
  const tones: Record<string, string> = { 
    emerald: "text-emerald-600", 
    rose: "text-rose-600", 
    slate: "text-slate-700", 
    cyan: "text-cyan-600" 
  };
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center">
      <div className={cn("text-2xl font-black", tones[tone])}>{value}</div>
      <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}

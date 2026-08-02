"use client";

import { useState, useEffect } from "react";

interface StudyBlock {
  id: string;
  weeks: string;
  title: string;
  description: string;
}

const STUDY_BLOCKS: StudyBlock[] = [
  { id: "block-1", weeks: "Semanas 1-2", title: "Cardiología y ECG", description: "50 preguntas · repasar isquemia y arritmias" },
  { id: "block-2", weeks: "Semanas 3-4", title: "Neumología y urgencias", description: "50 preguntas · EPOC, asma y TEP" },
  { id: "block-3", weeks: "Semanas 5-6", title: "Endocrinología", description: "50 preguntas · diabetes y tiroides" },
  { id: "block-4", weeks: "Semanas 7-8", title: "Digestivo", description: "50 preguntas · hígado y páncreas" },
  { id: "block-5", weeks: "Semanas 9-10", title: "Neurología", description: "50 preguntas · ictus y demencias" },
  { id: "block-6", weeks: "Semanas 11-12", title: "Infecciosas", description: "50 preguntas · VIH y tuberculosis" },
  { id: "block-7", weeks: "Semanas 13-14", title: "Pediatría y ginecología", description: "50 preguntas · vacunas y embarazo" },
];

export function PlanView() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mir_study_plan_completed");
      if (saved) {
        setCompleted(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const toggleBlock = (id: string) => {
    const updated = { ...completed, [id]: !completed[id] };
    setCompleted(updated);
    try {
      localStorage.setItem("mir_study_plan_completed", JSON.stringify(updated));
    } catch {}
  };

  const completedCount = STUDY_BLOCKS.filter((b) => completed[b.id]).length;
  const progressPercent = Math.round((completedCount / STUDY_BLOCKS.length) * 100);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/30">
      <div className="mx-auto max-w-5xl p-5 sm:p-8">
        
        {/* Encabezado Principal */}
        <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 p-6 text-white shadow-lg sm:p-8">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📅</span>
            <div>
              <h1 className="text-2xl font-bold">Plan de estudio</h1>
              <p className="mt-1 text-sm text-teal-50">Distribución orientativa de 14 semanas para cubrir el temario MIR.</p>
            </div>
          </div>
        </div>

        {/* Barra de Progreso Interactiva */}
        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Progreso del plan de 14 semanas</h2>
              <p className="text-xs text-slate-500 mt-0.5">{completedCount} de {STUDY_BLOCKS.length} bloques completados</p>
            </div>
            <span className="text-2xl font-extrabold text-teal-600">{progressPercent}%</span>
          </div>
          <div className="mt-3.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Columna Izquierda: Bloques de Estudio */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cronograma de 14 Semanas</h3>
            
            {STUDY_BLOCKS.map((block, idx) => {
              const isDone = !!completed[block.id];
              return (
                <article
                  key={block.id}
                  onClick={() => toggleBlock(block.id)}
                  className={[
                    "group flex items-start gap-4 rounded-2xl border p-4.5 cursor-pointer transition-all duration-200 hover:border-teal-300 hover:shadow-sm",
                    isDone ? "border-teal-100 bg-teal-50/20" : "border-slate-200 bg-white",
                  ].join(" ")}
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white text-[10px] font-bold text-white transition-all duration-150 group-hover:border-teal-400 group-active:scale-90 checked-sibling:bg-teal-500 style-checkbox" style={{
                    backgroundColor: isDone ? "#0d9488" : "transparent",
                    borderColor: isDone ? "#0d9488" : undefined
                  }}>
                    {isDone && "✓"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={[
                        "text-[10px] font-bold uppercase tracking-widest",
                        isDone ? "text-teal-600" : "text-slate-400"
                      ].join(" ")}>{block.weeks}</span>
                    </div>
                    <h4 className={[
                      "text-sm font-bold text-slate-800 mt-0.5 transition-all duration-200",
                      isDone ? "line-through text-slate-400" : ""
                    ].join(" ")}>{block.title}</h4>
                    <p className={[
                      "text-xs text-slate-500 mt-0.5",
                      isDone ? "text-slate-400/80" : ""
                    ].join(" ")}>{block.description}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Columna Derecha: Consejos y Rutina */}
          <div className="space-y-6">
            
            {/* Consejos clave */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">🎯 Consejos clave</h3>
              <ul className="space-y-3 text-xs text-slate-600 font-medium">
                <li className="flex gap-2.5">
                  <span className="text-teal-500 font-bold shrink-0">•</span>
                  <span>Realiza al menos 30 preguntas diarias.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-teal-500 font-bold shrink-0">•</span>
                  <span>Repasa las explicaciones, no solo la respuesta.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-teal-500 font-bold shrink-0">•</span>
                  <span>Haz un simulacro completo cada 15 días.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-teal-500 font-bold shrink-0">•</span>
                  <span>Deja descansos para evitar el agotamiento.</span>
                </li>
              </ul>
            </div>

            {/* Rutina diaria sugerida */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">⏰ Rutina diaria sugerida</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-2xl shrink-0">🏥</span>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-800">Mañana</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Lectura de temas</p>
                  </div>
                </div>
                <div className="flex gap-3 border-t border-slate-100 pt-4">
                  <span className="text-2xl shrink-0">📝</span>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-800">Tarde</h4>
                    <p className="text-xs text-slate-500 mt-0.5">50 preguntas</p>
                  </div>
                </div>
                <div className="flex gap-3 border-t border-slate-100 pt-4">
                  <span className="text-2xl shrink-0">🔁</span>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-800">Noche</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Repaso de fallos</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

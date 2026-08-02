"use client";

import { hardTopics } from "@/lib/hard-data";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">{children}</span>;
}

export function HardView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl p-5 sm:p-8">
        <div className="rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 p-6 text-white shadow-lg sm:p-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <h1 className="text-2xl font-bold">Preguntas difíciles recurrentes</h1>
              <p className="mt-1 text-sm text-rose-50">Versión ampliada: cálculo, razonamiento clínico, imágenes, urgencias y preguntas que cambian por matices mínimos.</p>
            </div>
          </div>
        </div>
 
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Métodos de abordaje crítico (Busca datos críticos y elimina lo incompatible)</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-xs font-bold text-rose-600 ring-1 ring-rose-100">1</div>
              <h3 className="mt-3 text-xs font-extrabold text-slate-900 uppercase tracking-wide">Imágenes con clínica mínima</h3>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">Radiografías, dermatología, ECG o anatomía patológica donde el texto apenas orienta.</p>
              <ul className="mt-3 space-y-1 text-[11px] font-semibold text-slate-600">
                <li className="flex gap-1.5"><span className="text-rose-500 font-bold">›</span>Primero identifica patrón visual</li>
                <li className="flex gap-1.5"><span className="text-rose-500 font-bold">›</span>Cruza edad y síntoma guía</li>
                <li className="flex gap-1.5"><span className="text-rose-500 font-bold">›</span>Descarta opciones incompatibles</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-xs font-bold text-rose-600 ring-1 ring-rose-100">2</div>
              <h3 className="mt-3 text-xs font-extrabold text-slate-900 uppercase tracking-wide">Bioestadística y lectura crítica</h3>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">Riesgo relativo, NNT, sensibilidad, especificidad e intervalos de confianza bajo presión.</p>
              <ul className="mt-3 space-y-1 text-[11px] font-semibold text-slate-600">
                <li className="flex gap-1.5"><span className="text-rose-500 font-bold">›</span>Escribe la fórmula básica</li>
                <li className="flex gap-1.5"><span className="text-rose-500 font-bold">›</span>Comprueba unidades y evento medido</li>
                <li className="flex gap-1.5"><span className="text-rose-500 font-bold">›</span>No interpretes sin mirar IC y valor n</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-xs font-bold text-rose-600 ring-1 ring-rose-100">3</div>
              <h3 className="mt-3 text-xs font-extrabold text-slate-900 uppercase tracking-wide">Embarazo o pediátrico</h3>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">Cambian contraindicaciones, dosis, calendario y prioridades diagnósticas.</p>
              <ul className="mt-3 space-y-1 text-[11px] font-semibold text-slate-600">
                <li className="flex gap-1.5"><span className="text-rose-500 font-bold">›</span>Pregunta edad gestacional o pediátrica</li>
                <li className="flex gap-1.5"><span className="text-rose-500 font-bold">›</span>Identifica fármacos prohibidos</li>
                <li className="flex gap-1.5"><span className="text-rose-500 font-bold">›</span>Prioriza seguridad o signos de gravedad</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-xs font-bold text-rose-600 ring-1 ring-rose-100">4</div>
              <h3 className="mt-3 text-xs font-extrabold text-slate-900 uppercase tracking-wide">Comorbilidad en ancianos</h3>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">Varias enfermedades justifican varias opciones, pero solo una es la mejor conducta.</p>
              <ul className="mt-3 space-y-1 text-[11px] font-semibold text-slate-600">
                <li className="flex gap-1.5"><span className="text-rose-500 font-bold">›</span>Determina problema activo</li>
                <li className="flex gap-1.5"><span className="text-rose-500 font-bold">›</span>Busca inestabilidad o iatrogenia</li>
                <li className="flex gap-1.5"><span className="text-rose-500 font-bold">›</span>Evita cascadas si la conducta está clara</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from(new Set(hardTopics.map((t) => t.bucket))).map((bucket) => (
            <span key={bucket} className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-200">{bucket}</span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {hardTopics.map((topic) => (
            <article key={topic.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-xl ring-1 ring-rose-100">{topic.icon}</div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold leading-tight text-slate-900">{topic.title}</h2>
                  {topic.bucket && <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">{topic.bucket}</div>}
                </div>
              </div>
              <div className="flex-1 space-y-3 px-5 py-4 text-sm">
                <div>
                  <Label>Por qué cuesta</Label>
                  <p className="mt-0.5 text-slate-700">{topic.whyHard}</p>
                </div>
                <div className="rounded-xl bg-indigo-50 p-3 ring-1 ring-indigo-100">
                  <Label>Cómo abordarlo 🧭</Label>
                  <p className="mt-0.5 text-indigo-900">{topic.approach}</p>
                </div>
                <div>
                  <Label>Puntos clave</Label>
                  <ul className="mt-1 space-y-1">
                    {topic.keyPoints.map((kp, i) => (
                      <li key={i} className="flex gap-2 text-slate-700">
                        <span className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <Label>Ejemplo</Label>
                  <p className="mt-0.5 text-slate-700">{topic.example}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { trapPatterns } from "@/lib/traps-data";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">{children}</span>;
}

export function TrapsView() {
  const basic = trapPatterns.filter((t) => t.level === "básica");
  const medium = trapPatterns.filter((t) => t.level === "media");
  const high = trapPatterns.filter((t) => t.level === "alta");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl p-5 sm:p-8">
        <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-lg sm:p-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h1 className="text-2xl font-bold">Preguntas trampa recurrentes</h1>
              <p className="mt-1 text-sm text-amber-50">Versión ampliada: patrones de redacción, errores estratégicos y trampas de razonamiento que aparecen de forma repetida en el MIR.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <Summary title="Básicas" count={basic.length} tone="bg-emerald-50 text-emerald-800 ring-emerald-100" />
          <Summary title="Intermedias" count={medium.length} tone="bg-amber-50 text-amber-800 ring-amber-100" />
          <Summary title="Avanzadas" count={high.length} tone="bg-rose-50 text-rose-800 ring-rose-100" />
        </div>

        <div className="mt-6 space-y-4">
          {trapPatterns.map((trap, idx) => (
            <article key={trap.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-start gap-3 border-b border-slate-100 bg-amber-50/60 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm ring-1 ring-amber-200">{trap.icon}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-600">Patrón {String(idx + 1).padStart(2, "0")}</div>
                    {trap.level && <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-slate-500 ring-1 ring-slate-200">Nivel {trap.level}</span>}
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{trap.title}</h2>
                </div>
              </div>
              <div className="grid gap-3 px-5 py-4 text-sm md:grid-cols-2">
                <div>
                  <Label>El patrón</Label>
                  <p className="mt-0.5 text-slate-700">{trap.pattern}</p>
                </div>
                <div>
                  <Label>Por qué engaña</Label>
                  <p className="mt-0.5 text-slate-700">{trap.trap}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-100 md:col-span-2">
                  <Label>Cómo evitarla ✅</Label>
                  <p className="mt-0.5 text-emerald-900">{trap.howToAvoid}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 md:col-span-2">
                  <Label>Ejemplo</Label>
                  <p className="mt-0.5 text-slate-700">{trap.example}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function Summary({ title, count, tone }: { title: string; count: number; tone: string }) {
  return <div className={`rounded-2xl p-4 ring-1 ${tone}`}><div className="text-sm font-semibold">{title}</div><div className="mt-1 text-3xl font-extrabold">{count}</div></div>;
}

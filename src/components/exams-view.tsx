"use client";

<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
=======
import { useMemo, useState } from "react";
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
import {
  EXAM_CATEGORIES,
  EXAM_FORMAT,
  EXAM_SOURCE,
  buildLocalExam,
  examList,
  examQuestions,
  type ExamQuestion,
  type LocalExamQuestion,
} from "@/lib/exams-data";
import { useUi } from "@/lib/ui-context";

function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

type Screen = "home" | "simulacro" | "repaso" | "full";

export function ExamsView() {
  const { printPage } = useUi();
  const [screen, setScreen] = useState<Screen>("home");
  const [filterYear, setFilterYear] = useState<string>("Todos");
  const [filterCat, setFilterCat] = useState<string>("Todas");
  const [selectedYear, setSelectedYear] = useState<string>("2025");

  const filtered = useMemo(() => {
    let list = examQuestions;
    if (filterYear !== "Todos") list = list.filter((q) => q.refYear === filterYear);
    if (filterCat !== "Todas") list = list.filter((q) => q.category === filterCat);
    return list;
  }, [filterYear, filterCat]);

  const fullExam = useMemo(() => buildLocalExam(selectedYear), [selectedYear]);

  return (
    <div className="flex-1 overflow-y-auto">
<<<<<<< HEAD
      <div className="mx-auto max-w-5xl p-5 sm:p-8 animate-fade-in">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-6 text-white shadow-xl sm:p-8 print:shadow-none border border-white/5">
          <div className="flex items-center gap-4">
            <span className="text-4xl bg-white/10 p-3 rounded-2xl">📝</span>
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Exámenes MIR de años anteriores</h1>
              <p className="mt-1 text-sm text-teal-200/80 font-medium">
                {EXAM_FORMAT.totalQuestions} preguntas · 4 opciones · penalización de fallo −0.33 · {EXAM_FORMAT.hours} horas de duración.
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
=======
      <div className="mx-auto max-w-5xl p-5 sm:p-8">
        <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 p-6 text-white shadow-lg sm:p-8 print:shadow-none">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📝</span>
            <div>
              <h1 className="text-2xl font-bold">Exámenes MIR de años anteriores</h1>
              <p className="mt-1 text-sm text-teal-50">
                {EXAM_FORMAT.totalQuestions} preguntas · 4 opciones · penalización de fallo −0,33 · {EXAM_FORMAT.hours} horas.
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
            <Stat label="Preguntas" value={`${EXAM_FORMAT.evaluable}+${EXAM_FORMAT.reserva}`} />
            <Stat label="Opciones" value={`${EXAM_FORMAT.options}`} />
            <Stat label="Con imagen" value={`~${EXAM_FORMAT.imageQuestions}`} />
            <Stat label="Duración" value={`${EXAM_FORMAT.hours} h`} />
          </div>
        </div>

<<<<<<< HEAD
        <div className="mt-5 flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-xs sm:text-sm shadow-sm backdrop-blur-md print:hidden">
          <span className="text-2xl bg-slate-50 p-2 rounded-xl">🏛️</span>
          <div>
            <p className="font-bold text-slate-800">Fuente Oficial: {EXAM_SOURCE.label}</p>
            <p className="mt-1 text-slate-500 leading-relaxed">
              La plataforma carga las preguntas estructuradas y las imágenes oficiales del examen directamente desde la base de datos local para fines de estudio formativo.
=======
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm print:hidden">
          <span className="text-xl">🏛️</span>
          <div>
            <p className="font-semibold text-slate-800">Fuente: {EXAM_SOURCE.label}</p>
            <p className="mt-0.5 text-slate-600">
              La web incluye las preguntas, respuestas e imágenes en local para los últimos años como material de estudio.
              El enlace oficial se mantiene solo como referencia institucional de las convocatorias FSE.
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
            </p>
            <a
              href={EXAM_SOURCE.url}
              target="_blank"
              rel="noopener noreferrer"
<<<<<<< HEAD
              className="mt-2 inline-flex items-center gap-1 font-bold text-teal-600 hover:text-teal-700 transition"
            >
              Ministerio de Sanidad — Acceso Convocatorias FSE ↗
=======
              className="mt-1 inline-block font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800"
            >
              Ministerio de Sanidad — Convocatorias FSE ↗
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
            </a>
          </div>
        </div>

        {screen === "home" && (
          <>
<<<<<<< HEAD
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 print:hidden">
              <button onClick={() => setScreen("simulacro")} className="premium-card rounded-2xl border border-teal-100 bg-white p-5 text-left shadow-sm">
                <div className="text-3xl bg-teal-50 p-2.5 rounded-xl inline-block">⏱️</div>
                <div className="mt-3 font-bold text-slate-800 text-base">Modo Simulacro</div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">Temporizador de 5 horas y corrección instantánea con penalización MIR real.</div>
              </button>
              <button onClick={() => setScreen("repaso")} className="premium-card rounded-2xl border border-indigo-100 bg-white p-5 text-left shadow-sm">
                <div className="text-3xl bg-indigo-50 p-2.5 rounded-xl inline-block">📖</div>
                <div className="mt-3 font-bold text-slate-800 text-base">Modo Repaso</div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">Banco de preguntas filtrable por especialidades con explicaciones inmediatas.</div>
              </button>
              <button onClick={() => setScreen("full")} className="premium-card rounded-2xl border border-purple-100 bg-white p-5 text-left shadow-sm">
                <div className="text-3xl bg-purple-50 p-2.5 rounded-xl inline-block">📚</div>
                <div className="mt-3 font-bold text-slate-800 text-base">Convocatoria Completa</div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">Acceso completo a la plantilla de 210 preguntas oficiales del año elegido.</div>
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm print:hidden">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Banco de Exámenes</span>
                  <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-teal-400 transition">
                    <option value="Todos">Todos los años</option>
                    {examList.map((e) => <option key={e.year} value={e.year}>MIR {e.year}</option>)}
                  </select>
                  <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-teal-400 transition">
                    <option value="Todas">Todas las especialidades</option>
                    {EXAM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">{filtered.length} preguntas de estudio</span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {examList.map((e) => (
                  <div key={e.year} className="premium-card rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-black text-white shadow-md shadow-slate-900/10">{e.year}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-slate-800">{e.date}</div>
                        <div className="text-xs text-slate-400 font-semibold mt-0.5">{e.plazas} plazas ofertadas</div>
=======
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 print:hidden">
              <button onClick={() => setScreen("simulacro")} className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-left transition hover:border-teal-400 hover:shadow-md">
                <div className="text-2xl">⏱️</div>
                <div className="mt-1 font-bold text-teal-900">Simulacro</div>
                <div className="text-sm text-teal-700">Corrige con penalización MIR.</div>
              </button>
              <button onClick={() => setScreen("repaso")} className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-400 hover:shadow-md">
                <div className="text-2xl">📖</div>
                <div className="mt-1 font-bold text-slate-900">Modo repaso</div>
                <div className="text-sm text-slate-600">Banco filtrable de preguntas con explicación.</div>
              </button>
              <button onClick={() => setScreen("full")} className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-left transition hover:border-indigo-400 hover:shadow-md">
                <div className="text-2xl">📚</div>
                <div className="mt-1 font-bold text-indigo-900">Convocatoria completa</div>
                <div className="text-sm text-indigo-700">Carga en la web el examen completo del año elegido.</div>
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filtrar banco</span>
                <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700">
                  <option value="Todos">Todos los años</option>
                  {examList.map((e) => <option key={e.year} value={e.year}>MIR {e.year}</option>)}
                </select>
                <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700">
                  <option value="Todas">Todas las especialidades</option>
                  {EXAM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="ml-auto text-xs text-slate-500">{filtered.length} preguntas base</span>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {examList.map((e) => (
                  <div key={e.year} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">{e.year}</div>
                      <div className="min-w-0 flex-1 text-sm">
                        <div className="font-semibold text-slate-800">{e.date} · {e.plazas} plazas</div>
                        <div className="text-slate-500">{e.note}</div>
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
                      </div>
                      <button
                        onClick={() => {
                          setSelectedYear(e.year);
                          setScreen("full");
                        }}
<<<<<<< HEAD
                        className="rounded-xl border border-teal-200 bg-teal-50/50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 hover:bg-teal-500 hover:text-white transition active:scale-95"
                      >
                        Cargar
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2.5 leading-relaxed italic">{e.note}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {e.topSpecialties.map((s) => (
                        <span key={s.name} className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-100">{s.name} {s.pct}</span>
=======
                        className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100"
                      >
                        Abrir completo
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {e.topSpecialties.map((s) => (
                        <span key={s.name} className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">{s.name} {s.pct}</span>
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {screen === "simulacro" && <ExamRunner title="Simulacro" questions={filtered} reviewMode={false} onExit={() => setScreen("home")} />}
        {screen === "repaso" && <ExamRunner title="Modo repaso" questions={filtered} reviewMode={true} onExit={() => setScreen("home")} />}
        {screen === "full" && (
          <div className="mt-4">
            <div className="mb-4 flex flex-wrap items-center gap-2 print:hidden">
              <button onClick={() => setScreen("home")} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">← Volver</button>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm">
                {examList.map((e) => <option key={e.year} value={e.year}>MIR {e.year}</option>)}
              </select>
              <button onClick={printPage} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">Imprimir / Guardar PDF</button>
              <span className="ml-auto text-sm text-slate-500">Convocatoria completa local · {fullExam.length} preguntas</span>
            </div>
            <ExamRunner title={`MIR ${selectedYear} · Convocatoria completa`} questions={fullExam} reviewMode={true} onExit={() => setScreen("home")} fullMode />
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur"><div className="text-lg font-bold leading-none">{value}</div><div className="mt-1 text-[11px] uppercase tracking-wide text-teal-100">{label}</div></div>;
}

function ExamRunner({ title, questions, reviewMode, onExit, fullMode = false }: { title: string; questions: (ExamQuestion | LocalExamQuestion)[]; reviewMode: boolean; onExit: () => void; fullMode?: boolean }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(reviewMode);

  const results = useMemo(() => {
    let correct = 0; let wrong = 0; let blank = 0;
    for (const q of questions) {
      const a = answers[q.id];
      if (a === undefined) blank++;
      else if (a === q.correctIndex) correct++;
      else wrong++;
    }
    return { correct, wrong, blank, score: correct - wrong / 3 };
  }, [answers, questions]);

  if (questions.length === 0) {
    return <div className="mt-6"><button onClick={onExit} className="mb-4 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">← Volver</button><div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No hay preguntas disponibles para estos filtros.</div></div>;
  }

  return (
    <div className="mt-4">
      <div className="mb-4 flex flex-wrap items-center gap-2 print:hidden">
        {!fullMode && <button onClick={onExit} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">← Volver</button>}
        <div className="text-sm font-semibold text-slate-700">{title} · {questions.length} preguntas</div>
        {!reviewMode && !submitted && <button onClick={() => setSubmitted(true)} className="ml-auto rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-700">Corregir</button>}
        {!reviewMode && submitted && <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="ml-auto rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">↻ Reiniciar</button>}
      </div>

      {submitted && (
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ResultStat label="Aciertos" value={results.correct} tone="emerald" />
            <ResultStat label="Fallos" value={results.wrong} tone="rose" />
            <ResultStat label="En blanco" value={results.blank} tone="slate" />
            <ResultStat label="Nota MIR" value={results.score.toFixed(2)} tone="teal" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, i) => (
          <article key={q.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white">{"localNumber" in q ? q.localNumber : i + 1}</div>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700">{q.category}</span>
              {q.refYear && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">MIR {q.refYear}</span>}
              {q.image && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">🖼️ imagen</span>}
            </div>
            <div className="px-4 py-4">
<<<<<<< HEAD
              {q.image && <ExamImage key={q.image.url} src={q.image.url} alt={q.image.alt} caption={q.image.caption} />}
=======
              {q.image && <figure className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"><img src={q.image.url} alt={q.image.alt} className="max-h-72 w-full object-contain bg-slate-100" /><figcaption className="border-t border-slate-100 px-3 py-1.5 text-[11px] text-slate-500">{q.image.caption}</figcaption></figure>}
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
              <p className="text-sm leading-relaxed text-slate-800">{q.stem}</p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, idx) => {
                  const selected = answers[q.id] === idx;
                  const right = idx === q.correctIndex;
                  const state = submitted ? (right ? "right" : selected ? "wrong" : "muted") : selected ? "selected" : "idle";
                  return (
                    <button key={idx} type="button" disabled={submitted} onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))} className={cn("flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition", state === "idle" && "border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50", state === "selected" && "border-teal-500 bg-teal-50", state === "right" && "border-emerald-400 bg-emerald-50", state === "wrong" && "border-rose-400 bg-rose-50", state === "muted" && "border-slate-200 bg-slate-50 opacity-70")}>
                      <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold", state === "idle" && "bg-slate-100 text-slate-600", state === "selected" && "bg-teal-500 text-white", state === "right" && "bg-emerald-500 text-white", state === "wrong" && "bg-rose-500 text-white", state === "muted" && "bg-slate-200 text-slate-500")}>{String.fromCharCode(65 + idx)}</span>
                      <span className="flex-1 text-slate-700">{opt}</span>
                    </button>
                  );
                })}
              </div>
              {submitted && <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm"><span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Justificación</span><p className="mt-0.5 text-slate-700">{q.explanation}</p></div>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ResultStat({ label, value, tone }: { label: string; value: number | string; tone: "emerald" | "rose" | "slate" | "teal" }) {
  const tones: Record<string, string> = { emerald: "text-emerald-600", rose: "text-rose-600", slate: "text-slate-700", teal: "text-teal-600" };
  return <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 text-center"><div className={cn("text-2xl font-extrabold", tones[tone])}>{value}</div><div className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-500">{label}</div></div>;
}
<<<<<<< HEAD

function ExamImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const [error, setError] = useState(false);
  
  useEffect(() => {
    setError(false);
  }, [src]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 mb-3 border border-dashed border-amber-200 bg-amber-50/50 rounded-xl text-center">
        <span className="text-2xl mb-1.5">🖼️</span>
        <span className="text-xs font-bold text-amber-800">Imagen oficial de la convocatoria</span>
        <span className="text-[10px] text-amber-600 mt-1 max-w-sm leading-normal">
          Para ver esta imagen oficial, ejecuta el script extractor local en tu terminal para recortarla y guardarla en:
          <code className="block bg-white/80 mt-1 px-1.5 py-0.5 rounded border border-amber-200 text-[9px] select-all font-mono">{src}</code>
        </span>
      </div>
    );
  }

  return (
    <figure className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className="max-h-72 w-full object-contain bg-slate-100"
      />
      <figcaption className="border-t border-slate-100 px-3 py-1.5 text-[11px] text-slate-500">
        {caption}
      </figcaption>
    </figure>
  );
}
=======
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8

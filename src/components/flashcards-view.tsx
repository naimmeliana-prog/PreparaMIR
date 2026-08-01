"use client";

import { useEffect, useMemo, useState } from "react";
import { flashcards, flashcardDecks, type Flashcard } from "@/lib/flashcards-data";

function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const STORAGE_KEY = "mir-flashcards-known";

export function FlashcardsView() {
  const [deck, setDeck] = useState<string>("Todos");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());

  // load persisted progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setKnown(new Set(JSON.parse(raw)));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: Set<string>) => {
    setKnown(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  };

  const list = useMemo<Flashcard[]>(
    () => (deck === "Todos" ? flashcards : flashcards.filter((c) => c.deck === deck)),
    [deck]
  );

  const safeIndex = Math.min(index, Math.max(0, list.length - 1));
  const card = list[safeIndex];
  const deckMeta = flashcardDecks.find((d) => d.name === card?.deck);

  const go = (dir: number) => {
    setFlipped(false);
    setIndex((prev) => {
      const n = (prev + dir + list.length) % list.length;
      return n;
    });
  };

  const chooseDeck = (d: string) => {
    setDeck(d);
    setIndex(0);
    setFlipped(false);
  };

  const toggleKnown = (val: boolean) => {
    if (!card) return;
    const next = new Set(known);
    if (val) next.add(card.id);
    else next.delete(card.id);
    persist(next);
  };

  const resetProgress = () => persist(new Set());

  const knownInDeck = useMemo(
    () => list.filter((c) => known.has(c.id)).length,
    [list, known]
  );

  const allDecks = [{ name: "Todos", icon: "🗂️", color: "from-slate-600 to-slate-800" }, ...flashcardDecks];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl p-5 sm:p-8">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-lg sm:p-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎴</span>
            <div>
              <h1 className="text-2xl font-bold">Flashcards</h1>
              <p className="mt-1 text-sm text-indigo-50">
                Repaso activo de alta rentabilidad. Toca la carta para girarla.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-indigo-100">
              <span>Progreso global</span>
              <span>
                {knownInDeck}/{list.length} dominadas
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${list.length ? (knownInDeck / list.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* deck selector */}
        <div className="mt-4 flex flex-wrap gap-2">
          {allDecks.map((d) => (
            <button
              key={d.name}
              onClick={() => chooseDeck(d.name)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                deck === d.name
                  ? "border-transparent bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              <span>{d.icon}</span>
              {d.name}
            </button>
          ))}
        </div>

        {/* card */}
        {card && deckMeta ? (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-600">
                {deckMeta.icon} {card.deck}
              </span>
              <span>
                {safeIndex + 1} / {list.length}
              </span>
            </div>

            <div
              className="flip-card h-80 w-full cursor-pointer select-none"
              onClick={() => setFlipped((f) => !f)}
            >
              <div className={cn("flip-inner", flipped && "is-flipped")}>
                {/* FRONT */}
                <div
                  className={cn(
                    "flip-face flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br p-8 text-center shadow-xl",
                    deckMeta.color
                  )}
                >
                  <div className="absolute left-4 top-4 text-4xl opacity-20">
                    {deckMeta.icon}
                  </div>
                  {known.has(card.id) && (
                    <div className="absolute right-4 top-4 rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-semibold text-white">
                      ✓ dominada
                    </div>
                  )}
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                    Pregunta
                  </span>
                  <p className="mt-3 text-xl font-bold leading-snug text-white">
                    {card.front}
                  </p>
                  <span className="mt-5 text-[11px] text-white/60">
                    Toca para ver la respuesta ↻
                  </span>
                </div>
                {/* BACK */}
                <div className="flip-face flip-back flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-500">
                    Respuesta
                  </span>
                  <p className="mt-3 text-lg font-semibold leading-snug text-slate-800">
                    {card.back}
                  </p>
                  <span className="mt-5 text-[11px] text-slate-400">
                    Toca para volver ↻
                  </span>
                </div>
              </div>
            </div>

            {/* controls */}
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                onClick={() => go(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                aria-label="Anterior"
              >
                ←
              </button>
              <div className="flex flex-1 gap-2">
                <button
                  onClick={() => toggleKnown(false)}
                  className="flex-1 rounded-xl border border-rose-200 bg-rose-50 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                >
                  Repasar
                </button>
                <button
                  onClick={() => toggleKnown(true)}
                  className="flex-1 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  La sé ✓
                </button>
              </div>
              <button
                onClick={() => go(1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                aria-label="Siguiente"
              >
                →
              </button>
            </div>

            {knownInDeck > 0 && (
              <button
                onClick={resetProgress}
                className="mx-auto mt-4 block text-xs text-slate-400 underline underline-offset-2 hover:text-slate-600"
              >
                Reiniciar progreso de flashcards
              </button>
            )}
          </div>
        ) : (
          <div className="mt-10 text-center text-sm text-slate-400">
            No hay cartas en este mazo.
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import type { MessageMetadata } from "@/lib/tutor";

interface QuizCardProps {
  metadata: MessageMetadata;
  onAnswer: (selectedIndex: number) => void;
  disabled?: boolean;
}

const LETTERS = ["A", "B", "C", "D", "E"];

export function QuizCard({ metadata, onAnswer, disabled }: QuizCardProps) {
  const options = metadata.options ?? [];
  const correctIndex = metadata.correctIndex ?? -1;
  const answered = metadata.answered ?? null;
  const revealed = answered !== null;
  const isCorrect = revealed && answered === correctIndex;

  return (
    <div className="mt-3 space-y-2">
      {options.map((opt, idx) => {
        const letter = LETTERS[idx];
        const isCorrectOption = idx === correctIndex;
        const isChosen = idx === answered;

        let state: "idle" | "correct" | "wrong" | "muted" = "idle";
        if (revealed) {
          if (isCorrectOption) state = "correct";
          else if (isChosen) state = "wrong";
          else state = "muted";
        }

        return (
          <button
            key={idx}
            type="button"
            disabled={revealed || disabled}
            onClick={() => onAnswer(idx)}
            className={[
              "group flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all",
              state === "idle"
                ? "border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50 cursor-pointer"
                : "cursor-default",
              state === "correct" &&
                "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-200",
              state === "wrong" &&
                "border-rose-400 bg-rose-50 ring-1 ring-rose-200",
              state === "muted" && "border-slate-200 bg-slate-50 opacity-70",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span
              className={[
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                state === "idle"
                  ? "bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-700"
                  : "",
                state === "correct" && "bg-emerald-500 text-white",
                state === "wrong" && "bg-rose-500 text-white",
                state === "muted" && "bg-slate-200 text-slate-500",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {letter}
            </span>
            <span
              className={[
                "flex-1",
                state === "correct"
                  ? "font-medium text-emerald-900"
                  : state === "wrong"
                    ? "font-medium text-rose-900"
                    : "text-slate-700",
              ].join(" ")}
            >
              {opt}
            </span>
            {state === "correct" && <span className="text-emerald-600">✓</span>}
            {state === "wrong" && <span className="text-rose-500">✕</span>}
          </button>
        );
      })}
      {revealed && (
        <div
          className={[
            "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold",
            isCorrect
              ? "bg-emerald-100 text-emerald-800"
              : "bg-rose-100 text-rose-800",
          ].join(" ")}
        >
          {isCorrect ? "✅ ¡Respuesta correcta!" : "❌ Respuesta incorrecta"}
          <span className="font-normal text-slate-500">
            — consulta la explicación detallada debajo.
          </span>
        </div>
      )}
    </div>
  );
}

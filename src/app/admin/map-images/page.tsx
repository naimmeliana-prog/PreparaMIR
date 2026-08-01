"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function MapImagesInner() {
  const searchParams = useSearchParams();
  const year = searchParams.get("year") ?? "2024";

  const [files, setFiles] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [num, setNum] = useState("");
  const [used, setUsed] = useState<number[]>([]);
  const [msg, setMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const needed = Array.from({ length: 25 }, (_, i) => i + 1).filter(
    (n) => !used.includes(n)
  );

  useEffect(() => {
    fetch(`/api/map-image?year=${year}`)
      .then((r) => r.json())
      .then((d) => setFiles(d.files));
  }, [year]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [idx]);

  const current = files[idx];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = parseInt(num);
    if (!num || isNaN(n)) return;

    if (used.includes(n)) {
      if (!confirm(`¡El número ${n} ya fue mapeado! ¿Sobreescribir?`)) return;
    }

    const res = await fetch("/api/map-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: current, to: n, year }),
    });
    const data = await res.json();
    if (data.ok) {
      setUsed((u) => [...u, n]);
      setMsg(`✅ ${current} → pregunta_${n}.png`);
      setNum("");
      setIdx((i) => i + 1);
    } else {
      setMsg(`❌ Error: ${data.error}`);
    }
  }

  function skip() {
    setMsg(`⏭️ Saltada: ${current}`);
    setNum("");
    setIdx((i) => i + 1);
  }

  if (!files.length)
    return (
      <div className="p-8 text-lg text-white">
        Cargando imágenes MIR {year}...
        <br />
        <span className="text-sm text-gray-400">
          (Ejecuta primero:{" "}
          <code>python scripts/extract_mir_temp_year.py {year}</code>)
        </span>
      </div>
    );

  if (idx >= files.length)
    return (
      <div className="p-8 text-2xl font-bold text-green-400">
        ✅ ¡Todas las imágenes MIR {year} mapeadas!
        <p className="text-base font-normal mt-2 text-gray-300">
          Números sin mapear: {needed.join(", ") || "ninguno — ¡perfecto!"}
        </p>
        <div className="mt-6 flex gap-4">
          {["2025", "2024", "2023", "2022", "2021"]
            .filter((y) => y !== year)
            .map((y) => (
              <a
                key={y}
                href={`/admin/map-images?year=${y}`}
                className="px-4 py-2 bg-blue-600 rounded text-white text-base font-semibold hover:bg-blue-500"
              >
                Ir a {y}
              </a>
            ))}
        </div>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0f172a",
      }}
    >
      {/* Barra fija superior */}
      <div
        style={{
          background: "#1e293b",
          color: "white",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexShrink: 0,
          flexWrap: "wrap",
          borderBottom: "2px solid #334155",
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 700, color: "#38bdf8" }}>
          MIR {year} — Imagen {idx + 1} / {files.length}
        </span>

        <form
          onSubmit={submit}
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <input
            ref={inputRef}
            type="number"
            min={1}
            max={25}
            value={num}
            onChange={(e) => setNum(e.target.value)}
            placeholder="Nº"
            style={{
              width: 80,
              fontSize: 28,
              textAlign: "center",
              border: "3px solid #38bdf8",
              borderRadius: 8,
              padding: "4px 8px",
              background: "#0f172a",
              color: "white",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#38bdf8",
              color: "#0f172a",
              fontWeight: 700,
              fontSize: 16,
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              cursor: "pointer",
            }}
          >
            Enter ↵
          </button>
          <button
            type="button"
            onClick={skip}
            style={{
              background: "#475569",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            Skip
          </button>
        </form>

        <div style={{ fontSize: 12, color: "#94a3b8", maxWidth: 500 }}>
          <strong style={{ color: "#fbbf24" }}>Faltan:</strong>{" "}
          {needed.slice(0, 25).join(", ") || "✅ ¡Todos!"}
        </div>

        {msg && (
          <span style={{ color: "#4ade80", fontSize: 12 }}>{msg}</span>
        )}
      </div>

      {/* Imagen a pantalla completa */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: 8,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current}
          src={`/images/exams/${year}/${current}?t=${Date.now()}`}
          alt={current}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
}

export default function MapImagesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Cargando...</div>}>
      <MapImagesInner />
    </Suspense>
  );
}

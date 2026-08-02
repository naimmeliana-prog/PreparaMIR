import type { Metadata } from "next";
import type { ReactNode } from "react";
import { UiProvider } from "@/lib/ui-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIR Tutor · Preparación inteligente del examen MIR",
  description:
    "Preparación completa del examen MIR: tutor IA con temas de alta rentabilidad, exámenes oficiales de años anteriores (Ministerio de Sanidad), preguntas tipo test, trampas recurrentes, preguntas difíciles y flashcards.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-100 text-slate-900 antialiased">
        <UiProvider>{children}</UiProvider>
      </body>
    </html>
  );
}

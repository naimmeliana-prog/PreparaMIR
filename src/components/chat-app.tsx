"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/markdown";
import { QuizCard } from "@/components/quiz-card";
import { StatsView } from "@/components/stats-view";
import { ExamsView } from "@/components/exams-view";
import { TrapsView } from "@/components/traps-view";
import { HardView } from "@/components/hard-view";
import { FlashcardsView } from "@/components/flashcards-view";
import { GeneratorView } from "@/components/generator-view";
import { PlanView } from "@/components/plan-view";
import { suggestedPrompts } from "@/lib/knowledge-base";
import { useUi } from "@/lib/ui-context";
import type { ChatMessage, ConversationSummary } from "@/lib/types";
import type { MessageMetadata } from "@/lib/tutor";
import { AuthScreen } from "@/components/auth-screen";

type Section = "exams" | "generator" | "traps" | "hard" | "flashcards" | "plan" | "stats";

const NAV: { id: Section; label: string; icon: string }[] = [
  { id: "exams", label: "Exámenes", icon: "📝" },
  { id: "generator", label: "Generador", icon: "🧪" },
  { id: "traps", label: "Preguntas trampa", icon: "⚠️" },
  { id: "hard", label: "Preguntas difíciles", icon: "🔥" },
  { id: "flashcards", label: "Flashcards", icon: "🎴" },
  { id: "plan", label: "Plan de estudio", icon: "📅" },
  { id: "stats", label: "Mi progreso", icon: "📊" },
];

const SECTION_TITLE: Record<Section, string> = {
  exams: "Exámenes MIR",
  generator: "Generador de exámenes",
  traps: "Preguntas trampa",
  hard: "Preguntas difíciles",
  flashcards: "Flashcards",
  plan: "Plan de estudio",
  stats: "Mi progreso",
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days} d`;
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export function ChatApp() {
  const { increaseText, decreaseText, resetText, printPage } = useUi();
  const [section, setSection] = useState<Section>("exams");
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const refreshConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations", { cache: "no-store" });
      if (res.ok) setConversations((await res.json()).conversations);
    } catch {}
  }, []);

  const checkUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.loggedIn) {
          setUser(data.username);
        }
      }
    } catch {}
    setLoadingUser(false);
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  useEffect(() => {
    if (user) {
      refreshConversations().finally(() => setLoadingConvs(false));
    }
  }, [user, refreshConversations]);

  // Synchronize active section with URL hash and localStorage so refreshing F5 maintains the view
  useEffect(() => {
    const getInitialSection = (): Section => {
      if (typeof window !== "undefined") {
        const hash = window.location.hash.replace("#", "") as Section;
        if (["exams", "generator", "traps", "hard", "flashcards", "plan", "stats"].includes(hash)) {
          return hash;
        }
        const stored = localStorage.getItem("mir_active_section") as Section;
        if (stored && ["exams", "generator", "traps", "hard", "flashcards", "plan", "stats"].includes(stored)) {
          return stored;
        }
      }
      return "exams";
    };

    const init = getInitialSection();
    setSection(init);

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as Section;
      if (["exams", "generator", "traps", "hard", "flashcards", "plan", "stats"].includes(hash)) {
        setSection(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const changeSection = useCallback((newSection: Section) => {
    setSection(newSection);
    if (typeof window !== "undefined") {
      window.location.hash = newSection;
      try {
        localStorage.setItem("mir_active_section", newSection);
      } catch {}
    }
  }, []);

  const loadMessages = useCallback(async (id: string) => {
    setLoadingMsgs(true);
    try {
      const res = await fetch(`/api/conversations/${id}`, { cache: "no-store" });
      if (res.ok) setMessages((await res.json()).messages);
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending, section]);

  const newChat = () => {
    setActiveId(null); setMessages([]); setInput(""); setError(null); setSection("chat"); setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setInput(""); setError(null); setSending(true);
    const optimistic: ChatMessage = { id: `pending-${Date.now()}`, conversationId: activeId ?? "pending", role: "user", content: trimmed, metadata: null, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, optimistic]);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId: activeId ?? undefined, content: trimmed }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al enviar");
      if (!activeId) setActiveId(data.conversationId);
      setMessages((prev) => [...prev.filter((m) => m.id !== optimistic.id), data.userMessage, ...(data.assistantMessages ?? [])]);
      refreshConversations();
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const answerQuiz = async (messageId: string, selectedIndex: number) => {
    if (sending) return;
    setSending(true);
    setMessages((prev) => prev.map((m) => m.id === messageId && m.metadata ? { ...m, metadata: { ...m.metadata, answered: selectedIndex } } : m));
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answer: { messageId, selectedIndex } }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al responder");
      setMessages((prev) => [...prev.map((m) => m.id === messageId && m.metadata ? { ...m, metadata: { ...m.metadata, answered: data.answeredIndex } } : m), data.userMessage, data.assistantMessage]);
      refreshConversations();
    } catch {
      setMessages((prev) => prev.map((m) => m.id === messageId && m.metadata ? { ...m, metadata: { ...m.metadata, answered: null } } : m));
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        setActiveId(null);
        setMessages([]);
      }
    } catch {}
  };

  const showWelcome = section === "chat" && !activeId && messages.length === 0;

  if (loadingUser) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-slate-950 text-white font-semibold">
        Cargando portal MIR...
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLoginSuccess={(username) => setUser(username)} />;
  }

  return (
    <div className="app-scale flex h-dvh w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
      <aside className={["fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800/40 bg-slate-900 text-slate-200 transition-transform duration-300 lg:static lg:translate-x-0", sidebarOpen ? "translate-x-0" : "-translate-x-full"].join(" ")}>
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-800/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-400 to-cyan-500 text-xl shadow-lg shadow-teal-500/20">🩺</div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-white tracking-wide">MIR Tutor IA</div>
            <div className="text-[11px] text-slate-400 font-medium">Preparación de Élite</div>
          </div>
        </div>
 
        <nav className="space-y-1 px-3 py-4">
          {NAV.map((item) => (
            <button key={item.id} onClick={() => { changeSection(item.id); setSidebarOpen(false); }} className={["flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200", section === item.id ? "bg-teal-500/10 text-teal-300 border border-teal-500/30 shadow-inner" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"].join(" ")}>
              <span className="text-base">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="flex-1" />

        {/* Sección de perfil de usuario en el menú lateral */}
        <div className="flex items-center justify-between border-t border-slate-800/60 bg-slate-950/20 px-4.5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">🧑‍⚕️</span>
            <div className="text-xs font-bold text-slate-200 truncate max-w-[120px]" title={user || ""}>{user}</div>
          </div>
          <button onClick={handleLogout} className="rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-[10px] font-bold px-2 py-1 text-slate-400 hover:text-rose-400 transition">
            Cerrar sesión
          </button>
        </div>

        <div className="border-t border-slate-800/60 px-4 py-4 text-[10px] font-medium leading-relaxed text-slate-500 bg-slate-950/40">
          Material educativo de repaso. Exámenes y convocatorias oficiales: Ministerio de Sanidad de España.
        </div>
      </aside>
 
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}
 
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200/80 bg-white/80 px-5 py-3.5 backdrop-blur-md print:hidden">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Menú">☰</button>
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="text-xl">{NAV.find((n) => n.id === section)?.icon}</span>
            <div className="truncate text-base font-bold text-slate-800 tracking-tight">
              {SECTION_TITLE[section]}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={decreaseText} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95">A−</button>
            <button onClick={resetText} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95">A</button>
            <button onClick={increaseText} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95">A+</button>
            <button onClick={printPage} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition active:scale-95 ml-1">Imprimir / PDF</button>
          </div>
        </header>

        {section === "exams" && <ExamsView />}
        {section === "generator" && <GeneratorView />}
        {section === "traps" && <TrapsView />}
        {section === "hard" && <HardView />}
        {section === "flashcards" && <FlashcardsView />}
        {section === "plan" && <PlanView />}
        {section === "stats" && <StatsView />}
      </div>
    </div>
  );
}

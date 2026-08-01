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
import { suggestedPrompts } from "@/lib/knowledge-base";
import { useUi } from "@/lib/ui-context";
import type { ChatMessage, ConversationSummary } from "@/lib/types";
import type { MessageMetadata } from "@/lib/tutor";
<<<<<<< HEAD
import { AuthScreen } from "@/components/auth-screen";

type Section = "exams" | "generator" | "traps" | "hard" | "flashcards" | "stats" | "chat";

const NAV: { id: Section; label: string; icon: string }[] = [
=======

type Section = "chat" | "exams" | "generator" | "traps" | "hard" | "flashcards" | "stats";

const NAV: { id: Section; label: string; icon: string }[] = [
  { id: "chat", label: "Tutor IA", icon: "💬" },
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
  { id: "exams", label: "Exámenes", icon: "📝" },
  { id: "generator", label: "Generador", icon: "🧪" },
  { id: "traps", label: "Preguntas trampa", icon: "⚠️" },
  { id: "hard", label: "Preguntas difíciles", icon: "🔥" },
  { id: "flashcards", label: "Flashcards", icon: "🎴" },
  { id: "stats", label: "Mi progreso", icon: "📊" },
<<<<<<< HEAD
  { id: "chat", label: "Tutor IA", icon: "💬" },
];

const SECTION_TITLE: Record<Section, string> = {
=======
];

const SECTION_TITLE: Record<Section, string> = {
  chat: "Tutor",
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
  exams: "Exámenes MIR",
  generator: "Generador de exámenes",
  traps: "Preguntas trampa",
  hard: "Preguntas difíciles",
  flashcards: "Flashcards",
  stats: "Mi progreso",
<<<<<<< HEAD
  chat: "Tutor IA",
=======
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
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
<<<<<<< HEAD
  const [section, setSection] = useState<Section>("exams");
=======
  const [section, setSection] = useState<Section>("chat");
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD
  const [user, setUser] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
=======
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const refreshConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations", { cache: "no-store" });
      if (res.ok) setConversations((await res.json()).conversations);
    } catch {}
  }, []);

<<<<<<< HEAD
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
        if (["exams", "generator", "traps", "hard", "flashcards", "stats", "chat"].includes(hash)) {
          return hash;
        }
        const stored = localStorage.getItem("mir_active_section") as Section;
        if (stored && ["exams", "generator", "traps", "hard", "flashcards", "stats", "chat"].includes(stored)) {
          return stored;
        }
      }
      return "exams";
    };

    const init = getInitialSection();
    setSection(init);

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as Section;
      if (["exams", "generator", "traps", "hard", "flashcards", "stats", "chat"].includes(hash)) {
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

=======
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
  useEffect(() => {
    refreshConversations().finally(() => setLoadingConvs(false));
  }, [refreshConversations]);

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
<<<<<<< HEAD
=======
      if (!res.ok) throw new Error(data?.error || "Error al responder");
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
      setMessages((prev) => [...prev.map((m) => m.id === messageId && m.metadata ? { ...m, metadata: { ...m.metadata, answered: data.answeredIndex } } : m), data.userMessage, data.assistantMessage]);
      refreshConversations();
    } catch {
      setMessages((prev) => prev.map((m) => m.id === messageId && m.metadata ? { ...m, metadata: { ...m.metadata, answered: null } } : m));
    } finally {
      setSending(false);
    }
  };

<<<<<<< HEAD
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
=======
  const showWelcome = section === "chat" && !activeId && messages.length === 0;

  return (
    <div className="app-scale flex h-dvh w-full overflow-hidden bg-slate-100 text-slate-900">
      <aside className={["fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800/60 bg-gradient-to-b from-slate-900 to-slate-950 transition-transform duration-300 lg:static lg:translate-x-0", sidebarOpen ? "translate-x-0" : "-translate-x-full"].join(" ")}>
        <div className="flex items-center gap-2.5 px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-lg shadow-lg shadow-teal-500/20">🩺</div>
          <div className="leading-tight"><div className="text-sm font-bold text-white">MIR Tutor</div><div className="text-[11px] text-slate-400">Preparación inteligente</div></div>
        </div>

        <nav className="space-y-1 px-3 py-2">
          {NAV.map((item) => (
            <button key={item.id} onClick={() => { setSection(item.id); setSidebarOpen(false); }} className={["flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition", section === item.id ? "bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/30" : "text-slate-300 hover:bg-slate-800/60"].join(" ")}>
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
              <span className="text-base">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
<<<<<<< HEAD
 
        {section === "chat" && (
          <>
            <div className="px-3 pt-2"><button onClick={newChat} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-teal-500/20 transition-all duration-200 hover:shadow-teal-400/30 hover:scale-[1.02] active:scale-95">＋ Nuevo chat</button></div>
            <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-2 pb-4 border-b border-slate-800/40">
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Historial de Tutorías</div>
              {loadingConvs ? <div className="px-3 py-6 text-center text-xs text-slate-500">Cargando chats…</div> : conversations.length === 0 ? <div className="px-3 py-6 text-center text-xs text-slate-500">No hay tutorías activas.</div> : conversations.map((c) => (
                <button key={c.id} onClick={() => { setActiveId(c.id); changeSection("chat"); setSidebarOpen(false); loadMessages(c.id); }} className={["group flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all duration-200", activeId === c.id ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:bg-slate-800/40 hover:text-white"].join(" ")}>
                  <span className="mt-0.5 shrink-0 text-slate-500 group-hover:text-teal-400">💬</span>
                  <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">{c.title}</div><div className="truncate text-[10px] text-slate-500 mt-0.5">{c.preview || relativeTime(c.updatedAt)}</div></div>
=======

        {section === "chat" && (
          <>
            <div className="px-3 pt-3"><button onClick={newChat} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:from-teal-400 hover:to-cyan-400">＋ Nuevo chat</button></div>
            <nav className="mt-3 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
              <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Conversaciones</div>
              {loadingConvs ? <div className="px-2 py-6 text-center text-xs text-slate-500">Cargando…</div> : conversations.length === 0 ? <div className="px-2 py-6 text-center text-xs text-slate-500">Aún no hay chats. ¡Empieza uno!</div> : conversations.map((c) => (
                <button key={c.id} onClick={() => { setActiveId(c.id); setSection("chat"); setSidebarOpen(false); loadMessages(c.id); }} className={["group flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition", activeId === c.id ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/60"].join(" ")}>
                  <span className="mt-0.5 shrink-0 text-slate-400">💬</span>
                  <div className="min-w-0 flex-1"><div className="truncate text-[13px] font-medium">{c.title}</div><div className="truncate text-[11px] text-slate-500">{c.preview || relativeTime(c.updatedAt)}</div></div>
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
                </button>
              ))}
            </nav>
          </>
        )}
        {section !== "chat" && <div className="flex-1" />}
<<<<<<< HEAD

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

        <div className="border-t border-slate-800/60 px-4 py-4 text-[10px] font-medium leading-relaxed text-slate-500 bg-slate-950/40">Material educativo de repaso. Exámenes y convocatorias oficiales: Ministerio de Sanidad de España.</div>
      </aside>
 
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}
 
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200/80 bg-white/80 px-5 py-3.5 backdrop-blur-md print:hidden">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Menú">☰</button>
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="text-xl">{NAV.find((n) => n.id === section)?.icon}</span>
            <div className="truncate text-base font-bold text-slate-800 tracking-tight">
              {section === "chat" && activeId ? (conversations.find(c => c.id === activeId)?.title || "Nuevo Chat") : SECTION_TITLE[section]}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={decreaseText} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95">A−</button>
            <button onClick={resetText} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95">A</button>
            <button onClick={increaseText} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95">A+</button>
            <button onClick={printPage} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition active:scale-95 ml-1">Imprimir / PDF</button>
            {section === "chat" && <button onClick={newChat} className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 hover:scale-105 transition active:scale-95 ml-1 shadow-sm">Nuevo</button>}
          </div>
        </header>
 
        {section === "chat" && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto bg-slate-50/50">
              {showWelcome ? <WelcomeScreen onPick={sendMessage} /> : <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 animate-fade-in">{loadingMsgs ? <div className="py-24 text-center text-sm font-semibold text-slate-400">Cargando conversación…</div> : messages.map((m) => <MessageBubble key={m.id} message={m} onAnswer={(idx) => answerQuiz(m.id, idx)} disabled={sending} />)}{error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-medium text-rose-700 shadow-sm">⚠️ {error}</div>}</div>}
            </div>
            <div className="border-t border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur-md print:hidden shadow-lg shadow-slate-100">
              <div className="mx-auto max-w-3xl">
                <div className="flex items-end gap-2.5 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-100/50 transition duration-200">
                  <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }} rows={1} placeholder="Pregúntame dudas o pide un test de repaso..." className="max-h-40 flex-1 resize-none bg-transparent px-2.5 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 leading-relaxed" />
                  <button onClick={() => sendMessage(input)} disabled={!input.trim() || sending} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/10 transition-all duration-200 hover:from-teal-400 hover:to-cyan-400 active:scale-95 disabled:opacity-40 disabled:pointer-events-none">➤</button>
=======
        <div className="border-t border-slate-800/60 px-4 py-3 text-[10px] leading-relaxed text-slate-500">Material educativo de repaso. Exámenes y convocatorias: Ministerio de Sanidad.</div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur print:hidden">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Menú">☰</button>
          <div className="flex min-w-0 flex-1 items-center gap-2"><span className="text-lg">{NAV.find((n) => n.id === section)?.icon}</span><div className="truncate text-sm font-semibold text-slate-800">{section === "chat" && activeId ? conversations.find((c) => c.id === activeId)?.title || "Nuevo chat" : SECTION_TITLE[section]}</div></div>
          <div className="flex items-center gap-1">
            <button onClick={decreaseText} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">A−</button>
            <button onClick={resetText} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">A</button>
            <button onClick={increaseText} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">A+</button>
            <button onClick={printPage} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50">Imprimir / PDF</button>
            {section === "chat" && <button onClick={newChat} className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-slate-700">Nuevo</button>}
          </div>
        </header>

        {section === "chat" && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              {showWelcome ? <WelcomeScreen onPick={sendMessage} /> : <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">{loadingMsgs ? <div className="py-16 text-center text-sm text-slate-400">Cargando conversación…</div> : messages.map((m) => <MessageBubble key={m.id} message={m} onAnswer={(idx) => answerQuiz(m.id, idx)} disabled={sending} />)}{error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">⚠️ {error}</div>}</div>}
            </div>
            <div className="border-t border-slate-200 bg-white/80 px-4 py-3 backdrop-blur print:hidden">
              <div className="mx-auto max-w-3xl">
                <div className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100">
                  <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }} rows={1} placeholder="Escribe tu pregunta o pide un test…" className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-slate-800 outline-none placeholder:text-slate-400" />
                  <button onClick={() => sendMessage(input)} disabled={!input.trim() || sending} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow transition hover:from-teal-400 hover:to-cyan-400 disabled:opacity-40">➤</button>
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
                </div>
              </div>
            </div>
          </>
        )}
<<<<<<< HEAD
 
=======

>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
        {section === "exams" && <ExamsView />}
        {section === "generator" && <GeneratorView />}
        {section === "traps" && <TrapsView />}
        {section === "hard" && <HardView />}
        {section === "flashcards" && <FlashcardsView />}
        {section === "stats" && <StatsView />}
      </div>
    </div>
  );
}
<<<<<<< HEAD
 
=======

>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
function MessageBubble({ message, onAnswer, disabled }: { message: ChatMessage; onAnswer: (idx: number) => void; disabled: boolean }) {
  const isUser = message.role === "user";
  const meta = message.metadata as MessageMetadata | null;
  const isQuiz = meta?.type === "quiz";
<<<<<<< HEAD
  return (
    <div className={["flex gap-4", isUser ? "flex-row-reverse animate-fade-in" : "animate-fade-in"].join(" ")}>
      <div className={["flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base shadow-sm transition", isUser ? "bg-slate-700 text-white" : "bg-gradient-to-tr from-teal-500 to-cyan-500 text-white"].join(" ")}>
        {isUser ? "🧑" : "🩺"}
      </div>
      <div className={["min-w-0 max-w-[calc(100%-3.5rem)] rounded-2xl px-5 py-3.5 text-sm shadow-sm transition-all duration-200", isUser ? "rounded-tr-sm bg-slate-800 text-white" : "rounded-tl-sm border border-slate-200/80 bg-white text-slate-700"].join(" ")}>
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          <>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed"><Markdown content={message.content} /></div>
            {isQuiz && meta && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <QuizCard metadata={meta} onAnswer={onAnswer} disabled={disabled} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
 
function WelcomeScreen({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 py-12 text-center animate-fade-in">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 text-3xl shadow-xl shadow-teal-500/20 animate-pulse">🩺</div>
      <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight leading-none">
        Tutor Inteligente de Preparación del <span className="text-teal-600">MIR</span>
      </h1>
      <p className="mt-3 max-w-xl text-sm sm:text-base text-slate-500 leading-relaxed">
        Resuelve tus dudas del temario con inteligencia artificial, genera simulacros personalizados, haz repasos enfocados o pon a prueba tus conocimientos en simuladores oficiales del MIR.
      </p>
      <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestedPrompts.map((p) => (
          <button key={p} onClick={() => onPick(p)} className="premium-card rounded-xl border border-slate-200 bg-white px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 shadow-sm hover:border-teal-300 hover:bg-teal-50/20 hover:text-teal-800">
            <span className="mr-2 text-teal-500">›</span>{p}
          </button>
        ))}
      </div>
    </div>
  );
=======
  return <div className={["flex gap-3", isUser ? "flex-row-reverse" : ""].join(" ")}><div className={["flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm shadow-sm", isUser ? "bg-slate-700 text-white" : "bg-gradient-to-br from-teal-500 to-cyan-500 text-white"].join(" ")}>{isUser ? "🧑" : "🩺"}</div><div className={["min-w-0 max-w-[calc(100%-3rem)] rounded-2xl px-4 py-3 text-sm shadow-sm", isUser ? "rounded-tr-sm bg-slate-800 text-white" : "rounded-tl-sm border border-slate-200 bg-white text-slate-700"].join(" ")}>{isUser ? <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p> : <><Markdown content={message.content} />{isQuiz && meta && <QuizCard metadata={meta} onAnswer={onAnswer} disabled={disabled} />}</>}</div></div>;
}

function WelcomeScreen({ onPick }: { onPick: (text: string) => void }) {
  return <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 py-10 text-center"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-3xl shadow-xl shadow-teal-500/30">🩺</div><h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Tu tutor de preparación del <span className="text-teal-600">MIR</span></h1><p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">Repasa temas, practica con test, abre convocatorias completas, genera simulacros e imprime o guarda en PDF.</p><div className="mt-6 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">{suggestedPrompts.map((p) => <button key={p} onClick={() => onPick(p)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50/50 hover:shadow-md"><span className="mr-1.5 text-teal-500">›</span>{p}</button>)}</div></div>;
>>>>>>> 1256ef975a9f2d43e80bb7b5543bd3902a7f17c8
}

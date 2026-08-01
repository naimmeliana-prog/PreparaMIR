"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type UiContextValue = {
  textScale: number;
  increaseText: () => void;
  decreaseText: () => void;
  resetText: () => void;
  printPage: () => void;
};

const STORAGE_KEY = "mir-ui-text-scale";
const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [textScale, setTextScale] = useState(1);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTextScale(Math.min(1.35, Math.max(0.9, Number(raw))));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--app-text-scale", String(textScale));
    try {
      localStorage.setItem(STORAGE_KEY, String(textScale));
    } catch {
      /* ignore */
    }
  }, [textScale]);

  const increaseText = useCallback(() => {
    setTextScale((v) => Math.min(1.35, Number((v + 0.05).toFixed(2))));
  }, []);

  const decreaseText = useCallback(() => {
    setTextScale((v) => Math.max(0.9, Number((v - 0.05).toFixed(2))));
  }, []);

  const resetText = useCallback(() => setTextScale(1), []);
  const printPage = useCallback(() => window.print(), []);

  const value = useMemo(
    () => ({ textScale, increaseText, decreaseText, resetText, printPage }),
    [textScale, increaseText, decreaseText, resetText, printPage]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
}

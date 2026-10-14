"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { LANGS, isRtl, langByCode } from "@/lib/langs";
import { UI_STRINGS } from "@/lib/ui-strings";
import { collectContentStrings } from "@/lib/content";

// ------------------------------------------------------------------ THEME
type Theme = "light" | "dark";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});
export const useTheme = () => useContext(ThemeCtx);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("ma-theme");
    const initial: Theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem("ma-theme", theme);
    } catch {}
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

// ------------------------------------------------------------------- I18N
type I18nStatus = "idle" | "loading" | "done" | "error";
interface I18nValue {
  locale: string;
  setLocale: (code: string) => void;
  tr: (s: string) => string;
  trf: (s: string, vars: Record<string, string | number>) => string;
  status: I18nStatus;
  rtl: boolean;
}

const I18nCtx = createContext<I18nValue>({
  locale: "en",
  setLocale: () => {},
  tr: (s) => s,
  trf: (s) => s,
  status: "idle",
  rtl: false,
});
export const useI18n = () => useContext(I18nCtx);

const CACHE_PREFIX = "ma-i18n-v1:";

function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState("en");
  const [map, setMap] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<I18nStatus>("idle");
  const requestId = useRef(0);

  // Full deduplicated corpus: every UI string + every content string.
  const corpus = useMemo(
    () => Array.from(new Set([...UI_STRINGS, ...collectContentStrings()])),
    [],
  );

  // Restore saved locale on mount.
  useEffect(() => {
    const saved = window.localStorage.getItem("ma-locale");
    if (saved && LANGS.some((l) => l.code === saved) && saved !== "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((code: string) => {
    setLocaleState(code);
    try {
      window.localStorage.setItem("ma-locale", code);
    } catch {}
  }, []);

  // Apply <html lang> + direction (full RTL support).
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = isRtl(locale) ? "rtl" : "ltr";
  }, [locale]);

  // Fetch translations whenever locale changes.
  useEffect(() => {
    if (locale === "en") {
      setMap({});
      setStatus("idle");
      return;
    }
    const id = ++requestId.current;

    // 1) Try the localStorage cache for instant switching.
    const cacheKey = CACHE_PREFIX + locale;
    try {
      const cached = window.localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as Record<string, string>;
        const coverage = corpus.filter((s) => parsed[s]).length;
        if (coverage >= corpus.length) {
          setMap(parsed);
          setStatus("done");
          return;
        }
        if (coverage > 0) setMap(parsed); // partial preview while fetching
      }
    } catch {}

    setStatus("loading");

    // Split the corpus into URL/timeout-friendly chunks (~120 strings each,
    // balanced by total character length) and translate progressively.
    const chunks: string[][] = [];
    let cur: string[] = [];
    let size = 0;
    for (const s of corpus) {
      if (cur.length >= 120 || size + s.length > 9000) {
        chunks.push(cur);
        cur = [];
        size = 0;
      }
      cur.push(s);
      size += s.length;
    }
    if (cur.length) chunks.push(cur);

    (async () => {
      for (const chunk of chunks) {
        if (requestId.current !== id) return;
        try {
          const r = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locale, strings: chunk }),
          });
          if (!r.ok) throw new Error(String(r.status));
          const data = (await r.json()) as {
            translations: Record<string, string>;
          };
          if (requestId.current !== id) return;
          setMap((prev) => ({ ...prev, ...data.translations }));
        } catch {
          /* individual chunk failed — keep English for these, continue */
        }
      }
      if (requestId.current !== id) return;
      setMap((prev) => {
        try {
          window.localStorage.setItem(cacheKey, JSON.stringify(prev));
        } catch {}
        return prev;
      });
      setStatus("done");
    })().catch(() => {
      if (requestId.current !== id) return;
      setStatus("error");
    });
  }, [locale, corpus]);

  const tr = useCallback((s: string) => map[s] ?? s, [map]);
  const trf = useCallback(
    (s: string, vars: Record<string, string | number>) => {
      let out = map[s] ?? s;
      for (const [k, v] of Object.entries(vars)) {
        out = out.split(`{${k}}`).join(String(v));
      }
      return out;
    },
    [map],
  );

  const value = useMemo<I18nValue>(
    () => ({ locale, setLocale, tr, trf, status, rtl: isRtl(locale) }),
    [locale, setLocale, tr, trf, status],
  );
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>{children}</I18nProvider>
    </ThemeProvider>
  );
}

export { langByCode };

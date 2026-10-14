"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  CloudOff,
  Globe,
  Languages,
  Loader2,
  Lock,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { LANGS, langByCode } from "@/lib/langs";
import { UI } from "@/lib/ui-strings";
import { useI18n, useTheme } from "@/lib/providers";

export type TabId = "natural" | "creative" | "brushes";

function LanguageMenu() {
  const { locale, setLocale, tr } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const current = langByCode(locale);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? LANGS.filter(
        (l) =>
          l.native.toLowerCase().includes(q) ||
          l.english.toLowerCase().includes(q) ||
          l.code.toLowerCase().includes(q),
      )
    : LANGS;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={tr(UI.language_label)}
        className="flex h-9 items-center gap-2 border border-line bg-panel px-3 text-[13px] font-medium text-ink transition-colors hover:border-faint"
      >
        <Globe className="h-4 w-4 text-bronze-deep dark:text-sand" strokeWidth={1.5} />
        <span className="max-w-28 truncate">{current.native}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 w-80 border border-line bg-panel shadow-[8px_8px_0_0_var(--line)]">
          <div className="flex items-center gap-2 border-b border-line px-3">
            <Search className="h-4 w-4 text-muted" strokeWidth={1.5} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr(UI.search_languages)}
              className="h-10 w-full bg-panel text-[13px] text-ink placeholder:text-faint focus:outline-none"
            />
          </div>
          <div role="listbox" className="max-h-80 overflow-y-auto">
            {filtered.map((l) => {
              const active = l.code === locale;
              return (
                <button
                  key={l.code}
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLocale(l.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-start text-[13px] transition-colors ${
                    active
                      ? "bg-tint-sage font-semibold text-ink"
                      : "text-muted hover:bg-panel2 hover:text-ink"
                  }`}
                >
                  <span className="truncate">{l.native}</span>
                  <span className="flex shrink-0 items-center gap-2 text-[11px] uppercase tracking-wider text-faint">
                    {l.english}
                    {active && (
                      <Check className="h-3.5 w-3.5 text-sage-deep dark:text-sage" strokeWidth={2} />
                    )}
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="px-3 py-6 text-center text-[13px] text-faint">—</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TranslateStatus() {
  const { status, locale, tr, trf } = useI18n();
  if (locale === "en") return null;
  if (status === "loading")
    return (
      <span className="hidden items-center gap-2 border border-line bg-tint-bronze px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-bronze-deep dark:text-sand md:flex">
        <Loader2 className="h-3.5 w-3.5 spin" strokeWidth={2} />
        {tr(UI.translating)}
      </span>
    );
  if (status === "error")
    return (
      <span className="hidden items-center gap-2 border border-line bg-panel px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted md:flex">
        <CloudOff className="h-3.5 w-3.5" strokeWidth={1.5} />
        {tr(UI.translation_failed)}
      </span>
    );
  if (status === "done")
    return (
      <span className="hidden items-center gap-2 border border-line bg-tint-sage px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-sage-deep dark:text-sage md:flex">
        <Languages className="h-3.5 w-3.5" strokeWidth={1.5} />
        {trf(UI.translated_to, { name: langByCode(locale).native })}
      </span>
    );
  return null;
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { tr } = useI18n();
  return (
    <div
      role="group"
      aria-label={tr(UI.theme_label)}
      className="flex h-9 items-stretch border border-line bg-panel"
    >
      <button
        type="button"
        onClick={() => theme !== "light" && toggle()}
        aria-label={tr(UI.theme_light)}
        aria-pressed={theme === "light"}
        className={`flex w-9 items-center justify-center transition-colors ${
          theme === "light" ? "bg-ink text-bg" : "text-muted hover:text-ink"
        }`}
      >
        <Sun className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={() => theme !== "dark" && toggle()}
        aria-label={tr(UI.theme_dark)}
        aria-pressed={theme === "dark"}
        className={`flex w-9 items-center justify-center border-s border-line transition-colors ${
          theme === "dark" ? "bg-sand text-[#181615]" : "text-muted hover:text-ink"
        }`}
      >
        <Moon className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}

export function Header({
  tab,
  onTab,
}: {
  tab: TabId;
  onTab: (t: TabId) => void;
}) {
  const { tr } = useI18n();

  const tabs: { id: TabId; label: string; isolated?: boolean }[] = [
    { id: "natural", label: tr(UI.nav_natural) },
    { id: "creative", label: tr(UI.nav_creative), isolated: true },
    { id: "brushes", label: tr(UI.nav_brushes) },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      {/* Row 1 — brand + controls */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => onTab("natural")}
          className="group flex items-center gap-3 text-start"
        >
          <span className="flex h-10 w-10 items-center justify-center border border-ink bg-ink font-display text-lg italic text-bg transition-colors group-hover:bg-bronze-deep group-hover:border-bronze-deep dark:border-sand dark:bg-sand dark:text-[#181615] dark:group-hover:bg-bronze dark:group-hover:border-bronze">
            M
          </span>
          <span>
            <span className="block font-display text-xl leading-none tracking-tight">
              {tr(UI.brand_name)}
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-faint">
              {tr(UI.brand_kicker)}
            </span>
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <TranslateStatus />
          <LanguageMenu />
          <ThemeToggle />
        </div>
      </div>

      {/* Row 2 — navigation tabs */}
      <nav
        aria-label="Streams"
        className="border-t border-line bg-bg"
      >
        <div className="mx-auto flex max-w-7xl items-stretch px-4 sm:px-6">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTab(t.id)}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-2 px-4 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors sm:px-6 ${
                  active ? "text-ink" : "text-faint hover:text-ink"
                }`}
              >
                {t.isolated && (
                  <Lock
                    className={`h-3.5 w-3.5 ${active ? "text-bronze-deep dark:text-sand" : "text-faint"}`}
                    strokeWidth={1.5}
                  />
                )}
                {t.label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-[2px] transition-colors ${
                    active
                      ? t.id === "creative"
                        ? "bg-bronze-deep dark:bg-sand"
                        : "bg-sage-deep dark:bg-sage"
                      : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

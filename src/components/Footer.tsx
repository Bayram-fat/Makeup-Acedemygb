"use client";

import { ArrowUpRight, Palette } from "lucide-react";
import { UI } from "@/lib/ui-strings";
import { useI18n } from "@/lib/providers";
import type { TabId } from "@/components/Header";

export function Footer({ onTab }: { onTab: (t: TabId) => void }) {
  const { tr } = useI18n();
  const year = new Date().getFullYear();

  const links: { id: TabId; label: string }[] = [
    { id: "natural", label: tr(UI.nav_natural) },
    { id: "creative", label: tr(UI.nav_creative) },
    { id: "brushes", label: tr(UI.nav_brushes) },
  ];

  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-ink bg-ink font-display italic text-bg dark:border-sand dark:bg-sand dark:text-[#181615]">
              M
            </span>
            <span className="font-display text-2xl tracking-tight">{tr(UI.brand_name)}</span>
          </p>
          <p className="mt-4 max-w-sm text-[13.5px] leading-6 text-muted">
            {tr(UI.footer_line)}
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-faint">
            {tr(UI.footer_streams)}
          </p>
          <ul className="mt-4 space-y-2.5">
            {links.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => {
                    onTab(l.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group flex items-center gap-2 text-[13px] font-medium text-muted transition-colors hover:text-ink"
                >
                  {l.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 rtl:-scale-x-100" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-faint">
            {tr(UI.footer_school)}
          </p>
          <p className="mt-4 flex items-start gap-2 text-[13px] leading-6 text-muted">
            <Palette className="mt-1 h-3.5 w-3.5 shrink-0 text-bronze-deep dark:text-sand" strokeWidth={1.5} />
            {tr(UI.footer_ethos)}
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-[11px] uppercase tracking-[0.16em] text-faint sm:px-6">
          <span>© {year} {tr(UI.brand_name)}</span>
          <span>{tr(UI.hero_kicker)}</span>
        </div>
      </div>
    </footer>
  );
}

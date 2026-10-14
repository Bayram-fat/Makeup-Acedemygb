"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  Layers,
  TrendingUp,
} from "lucide-react";
import { IMG, TUTORIALS, BRUSHES, type Tutorial } from "@/lib/content";
import { UI } from "@/lib/ui-strings";
import { useI18n } from "@/lib/providers";
import { LANGS } from "@/lib/langs";

const LEVEL_UI: Record<Tutorial["level"], string> = {
  beginner: UI.level_beginner,
  intermediate: UI.level_intermediate,
  advanced: UI.level_advanced,
};

export function Hero({
  onExploreNatural,
  onExploreCreative,
  onOpen,
}: {
  onExploreNatural: () => void;
  onExploreCreative: () => void;
  onOpen: (t: Tutorial) => void;
}) {
  const { tr, trf } = useI18n();
  const stepCount = TUTORIALS.reduce((n, t) => n + t.steps.length, 0);
  const trending = TUTORIALS.filter((t) => t.stream === "natural").slice(1, 4);

  const stats = [
    { n: String(TUTORIALS.length).padStart(2, "0"), label: tr(UI.stat_masterclasses) },
    { n: String(stepCount).padStart(2, "0"), label: tr(UI.stat_steps) },
    { n: String(BRUSHES.length).padStart(2, "0"), label: tr(UI.stat_brushes) },
    { n: String(LANGS.length), label: tr(UI.stat_languages) },
  ];

  const marquee = [
    ...TUTORIALS.map((t) => tr(t.title)),
    ...BRUSHES.slice(0, 4).map((b) => tr(b.name)),
  ];

  return (
    <section className="border-b border-line bg-bg">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:py-20">
        {/* Copy column */}
        <div className="flex flex-col justify-center lg:col-span-7">
          <p className="fade-up flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-sage-deep dark:text-sage">
            <span className="inline-block h-2 w-2 bg-sage-deep dark:bg-sage" />
            {tr(UI.hero_kicker)}
          </p>

          <h1 className="fade-up mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {tr(UI.hero_title_a)}{" "}
            <em className="italic text-bronze-deep dark:text-sand">
              {tr(UI.hero_title_b)}
            </em>
          </h1>

          <p className="fade-up mt-7 max-w-xl text-[15px] leading-7 text-muted">
            {tr(UI.hero_sub)}
          </p>

          <div className="fade-up mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExploreNatural}
              className="group flex h-12 items-center gap-3 border border-ink bg-ink px-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-bg transition-colors hover:bg-bronze-deep hover:border-bronze-deep dark:border-sand dark:bg-sand dark:text-[#181615] dark:hover:bg-bronze dark:hover:border-bronze"
            >
              {tr(UI.hero_cta_primary)}
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={onExploreCreative}
              className="group flex h-12 items-center gap-3 border border-line bg-panel px-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:border-faint"
            >
              {tr(UI.hero_cta_secondary)}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" strokeWidth={1.5} />
            </button>
          </div>

          {/* Trending lessons — minimalist highlight grid */}
          <div className="fade-up mt-10 border border-line">
            <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-bronze-deep dark:text-sand">
                <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.5} />
                {tr(UI.trending_kicker)}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">
                {tr(UI.trending_title)}
              </p>
            </div>
            <div className="grid sm:grid-cols-3">
              {trending.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onOpen(t)}
                  className={`group flex items-stretch gap-3 bg-bg p-3 text-start transition-colors hover:bg-panel ${
                    i > 0 ? "sm:border-s sm:border-line max-sm:border-t max-sm:border-line" : ""
                  }`}
                >
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden border border-line">
                    <Image
                      src={t.cover}
                      alt={tr(t.title)}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-faint">
                      N° {t.num} · {tr(LEVEL_UI[t.level])}
                    </span>
                    <span className="mt-1 block truncate font-display text-[15px] leading-snug tracking-tight group-hover:text-bronze-deep dark:group-hover:text-sand">
                      {tr(t.title)}
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
                      <Clock3 className="h-3 w-3" strokeWidth={1.5} />
                      {trf(UI.fmt_minutes, { n: t.minutes })}
                      <Layers className="h-3 w-3" strokeWidth={1.5} />
                      {trf(UI.fmt_steps, { n: t.steps.length })}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <dl className="fade-up mt-12 grid grid-cols-2 border border-line sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-5 py-4 ${i > 0 ? "border-s border-line" : ""} ${i > 1 ? "max-sm:border-t max-sm:border-line" : ""} ${i === 2 ? "max-sm:border-s-0" : ""}`}
              >
                <dt className="order-2 mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
                  {s.label}
                </dt>
                <dd className="font-display text-3xl tracking-tight">{s.n}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Image column */}
        <div className="relative lg:col-span-5">
          <div className="absolute -end-3 -top-3 hidden h-full w-full border border-line lg:block" aria-hidden />
          <figure className="relative border border-line bg-panel">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={IMG.hero}
                alt={tr(UI.brand_name)}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <figcaption className="flex items-center justify-between gap-3 border-t border-line bg-panel px-4 py-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                {tr(UI.hero_card_caption)}
              </span>
              <span className="flex shrink-0 items-center gap-1.5 border border-line bg-tint-sage px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sage-deep dark:text-sage">
                <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
                {tr(UI.hero_single_model)}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Technique marquee */}
      <div className="overflow-hidden border-t border-line bg-panel py-3" aria-hidden>
        <div className="marquee flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8">
              {marquee.map((m, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-faint"
                >
                  {m}
                  <span className="inline-block h-1.5 w-1.5 rotate-45 bg-bronze dark:bg-sand" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

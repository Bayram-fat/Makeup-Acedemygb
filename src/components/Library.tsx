"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  BookOpenText,
  Clock3,
  Layers,
  Lock,
  ShieldCheck,
  Video,
} from "lucide-react";
import { TUTORIALS, type Stream, type Tutorial } from "@/lib/content";
import { UI } from "@/lib/ui-strings";
import { useI18n } from "@/lib/providers";

const LEVEL_UI: Record<Tutorial["level"], string> = {
  beginner: UI.level_beginner,
  intermediate: UI.level_intermediate,
  advanced: UI.level_advanced,
};

const LEVEL_CLS: Record<Tutorial["level"], string> = {
  beginner: "bg-tint-sage text-sage-deep dark:text-sage",
  intermediate: "bg-tint-bronze text-bronze-deep dark:text-sand",
  advanced: "bg-panel2 text-ink",
};

function Card({
  tutorial,
  onOpen,
}: {
  tutorial: Tutorial;
  onOpen: (t: Tutorial) => void;
}) {
  const { tr, trf } = useI18n();
  return (
    <article className="group flex flex-col border border-line bg-panel transition-colors hover:border-faint">
      <button
        type="button"
        onClick={() => onOpen(tutorial)}
        className="relative block aspect-[4/5] w-full overflow-hidden border-b border-line"
        aria-label={tr(tutorial.title)}
      >
        <Image
          src={tutorial.cover}
          alt={tr(tutorial.title)}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
        />
        <span className="absolute start-3 top-3 border border-line bg-bg px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
          N° {tutorial.num}
        </span>
        <span className="absolute bottom-3 end-3 flex h-10 w-10 items-center justify-center border border-line bg-bg text-ink opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" strokeWidth={1.5} />
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">
          <span className={`px-2 py-1 ${LEVEL_CLS[tutorial.level]}`}>
            {tr(LEVEL_UI[tutorial.level])}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" strokeWidth={1.5} />
            {trf(UI.fmt_minutes, { n: tutorial.minutes })}
          </span>
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />
            {trf(UI.fmt_steps, { n: tutorial.steps.length })}
          </span>
        </div>

        <h3 className="mt-3 font-display text-2xl leading-tight tracking-tight">
          {tr(tutorial.title)}
        </h3>
        <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-muted">
          {tr(tutorial.tagline)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 border border-line px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            <Video className="h-3 w-3" strokeWidth={1.5} />
            {tr(UI.step_by_step_video)}
          </span>
          <span className="flex items-center gap-1.5 border border-line px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            <BookOpenText className="h-3 w-3" strokeWidth={1.5} />
            {tr(UI.written_guide_included)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpen(tutorial)}
          className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-colors group-hover:text-bronze-deep dark:group-hover:text-sand"
        >
          {tr(UI.open_masterclass)}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={1.5} />
        </button>
      </div>
    </article>
  );
}

export function StreamSection({
  stream,
  onOpen,
}: {
  stream: Stream;
  onOpen: (t: Tutorial) => void;
}) {
  const { tr } = useI18n();
  const list = TUTORIALS.filter((t) => t.stream === stream);
  const isCreative = stream === "creative";

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Stream banner */}
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p
              className={`inline-flex items-center gap-2 border border-line px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] ${
                isCreative
                  ? "bg-tint-bronze text-bronze-deep dark:text-sand"
                  : "bg-tint-sage text-sage-deep dark:text-sage"
              }`}
            >
              {isCreative ? (
                <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
              )}
              {isCreative ? tr(UI.creative_badge) : tr(UI.natural_badge)}
            </p>
            <h2 className="mt-5 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              {isCreative ? tr(UI.creative_title) : tr(UI.natural_title)}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted">
              {isCreative ? tr(UI.creative_desc) : tr(UI.natural_desc)}
            </p>
          </div>

          <div className="flex items-end lg:col-span-4">
            <div
              className={`w-full border p-5 ${
                isCreative
                  ? "border-bronze bg-tint-bronze dark:border-sand"
                  : "border-sage bg-tint-sage dark:border-sage"
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-faint">
                {isCreative ? tr(UI.nav_creative) : tr(UI.nav_natural)} ·{" "}
                {String(list.length).padStart(2, "0")}
              </p>
              <p className="mt-2 text-[13.5px] font-medium leading-6 text-ink">
                {tr(UI.isolation_note)}
              </p>
              <p className="mt-3 border-t border-line pt-3 text-[12.5px] leading-6 text-muted">
                {tr(UI.self_app_note)}
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div
          className={`mt-12 grid gap-6 sm:grid-cols-2 ${
            isCreative ? "lg:grid-cols-3" : "lg:grid-cols-2"
          }`}
        >
          {list.map((t, i) => (
            <div key={t.id} className="fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <Card tutorial={t} onOpen={onOpen} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

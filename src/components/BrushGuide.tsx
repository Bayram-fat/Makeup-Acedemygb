"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Brush as BrushIconLucide,
  Dna,
  Layers3,
  Move3d,
  Package,
  Pause,
  Play,
  Shapes,
  Target,
  X,
} from "lucide-react";
import { BRUSHES, type Brush, type BrushShape } from "@/lib/content";
import { UI } from "@/lib/ui-strings";
import { useI18n } from "@/lib/providers";

/* ------------------------------------------------------------------ */
/*  Sharp SVG silhouettes — one per head shape, monochrome editorial.  */
/*  No arrows, no dotted overlays, no diagrams on the model.           */
/* ------------------------------------------------------------------ */
function BrushGlyph({ shape, className }: { shape: BrushShape; className?: string }) {
  const head = (() => {
    switch (shape) {
      case "flat-shader":
        return <rect x={14} y={7} width={20} height={17} fill="currentColor" />;
      case "tapered-blending":
        return (
          <path
            d="M24 3.5 C30.5 8 32.5 14.5 32.5 19 C32.5 23.5 28.5 25.5 24 25.5 C19.5 25.5 15.5 23.5 15.5 19 C15.5 14.5 17.5 8 24 3.5 Z"
            fill="currentColor"
          />
        );
      case "angled-detail":
        return <path d="M13 25.5 L29 5 L36 10 L20 25.5 Z" fill="currentColor" />;
      case "pencil":
        return (
          <path
            d="M24 5 Q31 11 30.5 20.5 L17.5 20.5 Q17 11 24 5 Z"
            fill="currentColor"
          />
        );
      case "fluffy-powder":
        return <ellipse cx={24} cy={14} rx={14} ry={11} fill="currentColor" />;
      case "stippling":
        return (
          <>
            <ellipse cx={24} cy={13.5} rx={13.5} ry={10} fill="currentColor" />
            <ellipse
              cx={24}
              cy={13.5}
              rx={7}
              ry={4.5}
              fill="none"
              stroke="var(--panel)"
              strokeWidth={1.5}
            />
          </>
        );
      case "angled-contour":
        return <path d="M11 26 L31 3 L41 9.5 L21 27.5 Z" fill="currentColor" />;
      case "fan":
        return <path d="M24 26 L5.5 10.5 Q24 1.5 42.5 10.5 Z" fill="currentColor" />;
    }
  })();

  return (
    <svg viewBox="0 0 48 76" className={className} aria-hidden>
      {head}
      {/* ferrule */}
      <rect
        x={18.5}
        y={27}
        width={11}
        height={9}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      {/* handle */}
      <rect x={21.75} y={36} width={4.5} height={37} fill="currentColor" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo clip: real looping HTML5 video of the model using the brush.  */
/* ------------------------------------------------------------------ */
function DemoClip({ brush }: { brush: Brush }) {
  const { tr } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden border border-line bg-panel">
        <video
          ref={videoRef}
          src={brush.demoVideo}
          poster={brush.demoImg}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            if (v.paused) v.play().catch(() => {});
            else v.pause();
          }}
          className="absolute inset-0 h-full w-full cursor-pointer object-cover [object-position:50%_18%]"
        />
        <span className="absolute start-3 top-3 border border-line bg-bg px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
          {tr(UI.brush_demo)}
        </span>
        <button
          type="button"
          aria-label={playing ? tr(UI.pause) : tr(UI.play)}
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            if (v.paused) v.play().catch(() => {});
            else v.pause();
          }}
          className="absolute bottom-3 end-3 flex h-10 w-10 items-center justify-center border border-ink bg-ink text-bg transition-colors hover:bg-bronze-deep dark:border-sand dark:bg-sand dark:text-[#181615]"
        >
          {playing ? (
            <Pause className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Play className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
      </div>
      <div className="border border-t-0 border-line bg-panel p-5">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze-deep dark:text-sand">
          <Move3d className="h-3.5 w-3.5" strokeWidth={1.5} />
          {tr(UI.spec_movement)}
        </p>
        <p className="mt-2 text-[13.5px] leading-6 text-ink">{tr(brush.movement)}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Brush detail overlay — opaque, editorial two-column spec sheet.    */
/* ------------------------------------------------------------------ */
function BrushOverlay({ brush, onClose }: { brush: Brush; onClose: () => void }) {
  const { tr } = useI18n();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const specs = [
    { icon: <Dna className="h-3.5 w-3.5" strokeWidth={1.5} />, label: tr(UI.spec_bristle), value: tr(brush.bristle) },
    { icon: <Shapes className="h-3.5 w-3.5" strokeWidth={1.5} />, label: tr(UI.spec_density), value: tr(brush.density) },
  ];

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-bg" role="dialog" aria-modal="true">
      <div className="sticky top-0 z-10 border-b border-line bg-bg">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-muted">
            <span className="border border-line bg-panel px-2 py-1 text-ink">{brush.num}</span>
            {tr(brush.name)}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={tr(UI.close)}
            className="flex items-center gap-2 border border-line px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:border-faint hover:text-ink"
          >
            {tr(UI.close)}
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Demo column */}
          <div className="fade-up">
            <DemoClip brush={brush} />
          </div>

          {/* Specs column */}
          <div className="fade-up">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.26em] text-sage-deep dark:text-sage">
              <Package className="h-4 w-4" strokeWidth={1.5} />
              {tr(UI.brush_specs)}
            </p>
            <h3 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              {tr(brush.name)}
            </h3>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              {tr(brush.kind === "eye" ? UI.kind_eye : UI.kind_face)}
            </p>

            <div className="mt-8 space-y-px border border-line bg-line">
              {specs.map((s) => (
                <div key={s.label} className="bg-panel p-5">
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze-deep dark:text-sand">
                    {s.icon}
                    {s.label}
                  </p>
                  <p className="mt-2 text-[13.5px] leading-6 text-ink">{s.value}</p>
                </div>
              ))}

              <div className="bg-panel p-5">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze-deep dark:text-sand">
                  <Layers3 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {tr(UI.spec_formulas)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {brush.formulas.map((f) => (
                    <span
                      key={f}
                      className="border border-line bg-tint-sage px-2.5 py-1 text-[11px] font-semibold text-ink"
                    >
                      {tr(f)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-tint-bronze p-5">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze-deep dark:text-sand">
                  <Target className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {tr(UI.spec_best)}
                </p>
                <p className="mt-2 text-[13.5px] font-medium leading-6 text-ink">
                  {tr(brush.bestFor)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Guide index — grid of the eight professional brushes.              */
/* ------------------------------------------------------------------ */
export function BrushGuide() {
  const { tr } = useI18n();
  const [open, setOpen] = useState<Brush | null>(null);

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="inline-flex items-center gap-2 border border-line bg-tint-sage px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-sage-deep dark:text-sage">
              <BrushIconLucide className="h-3.5 w-3.5" strokeWidth={1.5} />
              {tr(UI.brushes_badge)}
            </p>
            <h2 className="mt-5 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              {tr(UI.brushes_title)}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted">
              {tr(UI.brushes_desc)}
            </p>
          </div>
          <div className="flex items-end lg:col-span-4">
            <div className="w-full border border-sage bg-tint-sage p-5 dark:border-sage">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-faint">
                {tr(UI.nav_brushes)}
              </p>
              <p className="mt-2 text-[13.5px] font-medium leading-6 text-ink">
                {tr(UI.studio_note)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {BRUSHES.map((b, i) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setOpen(b)}
              className="fade-up group flex flex-col items-start bg-panel p-6 text-start transition-colors hover:bg-panel2"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex w-full items-start justify-between">
                <BrushGlyph
                  shape={b.shape}
                  className="h-20 w-auto text-ink transition-colors group-hover:text-bronze-deep dark:text-sand dark:group-hover:text-sand"
                />
                <span className="border border-line px-2 py-1 text-[10px] font-bold tracking-[0.18em] text-faint">
                  {b.num}
                </span>
              </div>
              <p className="mt-5 font-display text-xl leading-tight tracking-tight">
                {tr(b.name)}
              </p>
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">
                {tr(b.kind === "eye" ? UI.kind_eye : UI.kind_face)}
              </p>
              <p className="mt-4 flex w-full items-center justify-between border-t border-line pt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-ink">
                {tr(UI.brush_cta)}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" strokeWidth={1.5} />
              </p>
            </button>
          ))}
        </div>
      </div>

      {open && <BrushOverlay brush={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

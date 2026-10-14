"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpenText,
  Clock3,
  Crosshair,
  Droplet,
  FlaskConical,
  Frame,
  Gauge,
  Hand,
  Layers,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  ScanFace,
  SkipBack,
  SkipForward,
  Video,
  X,
} from "lucide-react";
import type { Tutorial, TutorialStep } from "@/lib/content";
import { UI } from "@/lib/ui-strings";
import { useI18n } from "@/lib/providers";

const fmtTime = (s: number) => {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
};

const LEVEL_UI: Record<Tutorial["level"], string> = {
  beginner: UI.level_beginner,
  intermediate: UI.level_intermediate,
  advanced: UI.level_advanced,
};

const SPEEDS = [0.5, 1, 1.5, 2] as const;

/* ------------------------------------------------------------------ *
 *  DRAGGABLE SEEK SCRUBBER — bound directly to video.currentTime      *
 * ------------------------------------------------------------------ */
function Scrubber({
  progress,
  onSeek,
  ariaLabel,
}: {
  progress: number;
  onSeek: (ratio: number) => void;
  ariaLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const ratioFromEvent = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };

  return (
    <div
      ref={trackRef}
      dir="ltr"
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onSeek(Math.min(1, progress + 0.05));
        if (e.key === "ArrowLeft") onSeek(Math.max(0, progress - 0.05));
      }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        onSeek(ratioFromEvent(e.clientX));
      }}
      onPointerMove={(e) => {
        if (dragging.current) onSeek(ratioFromEvent(e.clientX));
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      className="group relative flex h-7 w-full cursor-pointer touch-none items-center"
    >
      <span className="relative block h-1.5 w-full bg-panel2 transition-colors group-hover:bg-line">
        {/* Stage boundary ticks at 25% and 50% of the clip timeline */}
        {[25, 50].map((cut) => (
          <span
            key={cut}
            className="absolute inset-y-[-3px] w-px bg-faint"
            style={{ left: `${cut}%` }}
          />
        ))}
        <span
          className="absolute inset-y-0 left-0 bg-bronze-deep dark:bg-sand"
          style={{ width: `${progress * 100}%` }}
        />
      </span>
      <span
        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 border border-bg bg-ink transition-transform group-hover:scale-125 dark:border-[#181615] dark:bg-sand"
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  TRUE HTML5 VIDEO ENGINE                                             *
 *  Real <video> streams of the brunette model self-applying every      *
 *  layer in continuous physical motion. No slideshows, no fake frames. *
 * ------------------------------------------------------------------ */
function Player({
  tutorial,
  idx,
  setIdx,
}: {
  tutorial: Tutorial;
  idx: number;
  setIdx: (i: number) => void;
}) {
  const { tr, trf } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [curTime, setCurTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const steps = tutorial.steps;
  const step: TutorialStep = steps[idx];
  const total = duration || step.dur;
  const progress = total > 0 ? Math.min(1, curTime / total) : 0;

  // Three-stage chronological routine: extraction → tool loading → application.
  const stageIdx = progress < 0.25 ? 0 : progress < 0.5 ? 1 : 2;
  const stageStarts = [0, 0.25, 0.5];
  const stageLabels = [
    tr(UI.stage_product),
    tr(UI.stage_tool),
    tr(UI.stage_apply),
  ];

  // Autoplay hand-off between steps (gesture chain already established).
  useEffect(() => {
    const v = videoRef.current;
    setCurTime(0);
    setEnded(false);
    if (playing && v) {
      v.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, step.video]);

  // Playback speed.
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
  });

  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (ended) {
      v.currentTime = 0;
      setEnded(false);
      setPlaying(true);
      v.play().catch(() => setPlaying(false));
      return;
    }
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  const seek = (ratio: number) => {
    const v = videoRef.current;
    if (!v || total <= 0) return;
    v.currentTime = Math.min(0.999, Math.max(0, ratio)) * total;
    setCurTime(v.currentTime);
    if (ended && ratio < 1) setEnded(false);
  };

  const handleEnded = () => {
    if (idx < steps.length - 1) {
      setIdx(idx + 1); // autoplay hand-off continues in the idx effect
    } else {
      setPlaying(false);
      setEnded(true);
    }
  };

  return (
    <div>
      {/* Studio frame */}
      <div className="relative aspect-video overflow-hidden border border-line bg-panel">
        <video
          key={step.video}
          ref={videoRef}
          src={step.video}
          poster={step.poster}
          playsInline
          preload="metadata"
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            setDuration(Number.isFinite(v.duration) ? v.duration : step.dur);
            v.playbackRate = speed;
          }}
          onTimeUpdate={(e) => setCurTime(e.currentTarget.currentTime)}
          onEnded={handleEnded}
          onClick={toggle}
          className="absolute inset-0 h-full w-full cursor-pointer object-cover [object-position:50%_18%]"
        />

        {/* Frame chrome — top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 sm:p-4">
          <span className="flex items-center gap-2 border border-line bg-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
            <span
              className={`inline-block h-1.5 w-1.5 ${playing ? "bg-bronze-deep dark:bg-sand" : "bg-faint"}`}
            />
            {trf(UI.fmt_step_of, { n: idx + 1, m: steps.length })}
          </span>
          <span className="flex flex-wrap items-center justify-end gap-2">
            <span className="flex items-center gap-2 border border-line bg-tint-sage px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sage-deep dark:text-sage">
              <ScanFace className="h-3 w-3" strokeWidth={1.5} />
              {tr(UI.self_app)}
            </span>
            <span className="hidden items-center gap-2 border border-line bg-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink md:flex">
              <Frame className="h-3 w-3" strokeWidth={1.5} />
              {tr(UI.full_face)}
            </span>
            <span className="flex items-center gap-2 border border-line bg-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
              <Layers className="h-3 w-3" strokeWidth={1.5} />
              {tr(UI.layer_label)} · {tr(step.focus)}
            </span>
          </span>
        </div>

        {/* Live stage indicator + dosage text overlay (Stage 1 window) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-14 flex flex-col items-center gap-1.5 px-6 sm:bottom-16">
          <span className="flex items-center gap-2 border border-line bg-tint-bronze px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-bronze-deep dark:text-sand">
            {stageLabels[stageIdx]}
          </span>
          {stageIdx === 0 && !ended && (
            <span className="flex max-w-full items-center gap-2 border border-line bg-bg px-3 py-1.5 text-center text-[11px] font-semibold leading-snug tracking-wide text-ink">
              <Droplet className="h-3.5 w-3.5 shrink-0 text-bronze-deep dark:text-sand" strokeWidth={1.5} />
              {tr(step.dosage)}
            </span>
          )}
        </div>

        {/* Frame chrome — bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-4">
          <span className="border border-line bg-bg px-2.5 py-1 font-display text-sm italic text-ink">
            {tr(step.title)}
          </span>
          {ended && (
            <span className="border border-line bg-tint-sage px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sage-deep dark:text-sage">
              {tr(UI.final_look)}
            </span>
          )}
        </div>
      </div>

      {/* Interactive controls */}
      <div className="border border-t-0 border-line bg-panel px-3 py-3 sm:px-4" dir="ltr">
        {/* Scrubber + live time counter */}
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <Scrubber progress={progress} onSeek={seek} ariaLabel={tr(UI.seek_label)} />
          </div>
          <span className="shrink-0 text-[12px] font-semibold tabular-nums tracking-wider text-ink">
            {fmtTime(curTime)} <span className="text-faint">/ {fmtTime(total)}</span>
          </span>
        </div>

        {/* Stage markers — click to jump to 0% / 25% / 50% of the clip */}
        <div className="flex w-full border-t border-line">
          {stageLabels.map((label, i) => {
            const active = stageIdx === i;
            return (
              <button
                key={label}
                type="button"
                onClick={() => seek(stageStarts[i])}
                aria-current={active}
                className={`px-2 py-2 text-start text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
                  i === 0 ? "basis-1/4" : i === 1 ? "basis-1/4 border-s border-line" : "basis-1/2 border-s border-line"
                } ${active ? "text-ink" : "text-faint hover:text-muted"}`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-3">
          {/* Transport */}
          <div className="flex items-center">
            <button
              type="button"
              aria-label={tr(UI.prev_step)}
              disabled={idx === 0}
              onClick={() => setIdx(Math.max(0, idx - 1))}
              className="flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors hover:bg-panel2 disabled:opacity-30"
            >
              <SkipBack className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label={ended ? tr(UI.replay) : playing ? tr(UI.pause) : tr(UI.play)}
              onClick={toggle}
              className="mx-1.5 flex h-9 w-12 items-center justify-center border border-ink bg-ink text-bg transition-colors hover:bg-bronze-deep hover:border-bronze-deep dark:border-sand dark:bg-sand dark:text-[#181615] dark:hover:bg-bronze"
            >
              {ended ? (
                <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
              ) : playing ? (
                <Pause className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Play className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
            <button
              type="button"
              aria-label={tr(UI.next_step)}
              disabled={idx === steps.length - 1}
              onClick={() => setIdx(Math.min(steps.length - 1, idx + 1))}
              className="flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors hover:bg-panel2 disabled:opacity-30"
            >
              <SkipForward className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Layer segments */}
          <div className="flex min-w-32 flex-1 items-center gap-1" dir="ltr">
            {steps.map((s, i) => {
              const fill = i < idx ? 1 : i === idx ? progress : 0;
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={trf(UI.fmt_step_of, { n: i + 1, m: steps.length })}
                  onClick={() => setIdx(i)}
                  className="group h-5 flex-1"
                  style={{ minWidth: 18 }}
                >
                  <span className="relative block h-1 w-full bg-panel2 group-hover:bg-line">
                    <span
                      className="absolute inset-y-0 left-0 bg-sage-deep dark:bg-sage"
                      style={{ width: `${fill * 100}%` }}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Speed control — video.playbackRate */}
          <div
            className="flex items-stretch border border-line"
            role="group"
            aria-label={tr(UI.speed_label)}
          >
            <span className="flex items-center border-e border-line bg-panel2 px-2.5 text-faint">
              <Gauge className="h-4 w-4" strokeWidth={1.5} />
            </span>
            {SPEEDS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSpeed(v)}
                aria-pressed={speed === v}
                className={`px-2.5 py-1.5 text-[11px] font-bold tabular-nums tracking-wider transition-colors ${
                  speed === v
                    ? "bg-ink text-bg dark:bg-sand dark:text-[#181615]"
                    : "text-muted hover:bg-panel2 hover:text-ink"
                }`}
              >
                {v}×
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Now playing strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border border-t-0 border-line bg-bg px-3 py-2.5 sm:px-4">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          <Video className="h-3.5 w-3.5 text-bronze-deep dark:text-sand" strokeWidth={1.5} />
          {playing ? tr(UI.now_playing) : tr(UI.watch_note)}
        </p>
        <p className="text-[10px] uppercase tracking-[0.18em] text-faint">
          {tr(UI.studio_note)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Deep written expert guide — dosage, anatomy, tools, chemistry, fix */
/* ------------------------------------------------------------------ */
function GuideField({
  icon,
  label,
  body,
  wide,
  tip,
}: {
  icon: React.ReactNode;
  label: string;
  body: string;
  wide?: boolean;
  tip?: boolean;
}) {
  return (
    <div
      className={`border border-line p-5 ${wide ? "md:col-span-2" : ""} ${
        tip ? "border-s-2 border-s-sage-deep bg-tint-sage dark:border-s-sage" : "bg-panel"
      }`}
    >
      <p
        className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] ${
          tip ? "text-sage-deep dark:text-sage" : "text-bronze-deep dark:text-sand"
        }`}
      >
        {icon}
        {label}
      </p>
      <p className="mt-2.5 text-[13.5px] leading-6 text-ink">{body}</p>
    </div>
  );
}

export function TutorialOverlay({
  tutorial,
  onClose,
}: {
  tutorial: Tutorial;
  onClose: () => void;
}) {
  const { tr, trf } = useI18n();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const isCreative = tutorial.stream === "creative";

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-bg" role="dialog" aria-modal="true">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-line bg-bg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="group flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:-scale-x-100 rtl:group-hover:translate-x-1" strokeWidth={1.5} />
            {tr(UI.back_to_library)}
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`hidden border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] sm:block ${
                isCreative
                  ? "border-line bg-tint-bronze text-bronze-deep dark:text-sand"
                  : "border-line bg-tint-sage text-sage-deep dark:text-sage"
              }`}
            >
              N° {tutorial.num}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label={tr(UI.close)}
              className="flex h-9 w-9 items-center justify-center border border-line text-muted transition-colors hover:border-faint hover:text-ink"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        {/* Heading */}
        <div className="fade-up">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-faint">
            <span className={isCreative ? "text-bronze-deep dark:text-sand" : "text-sage-deep dark:text-sage"}>
              {isCreative ? tr(UI.creative_badge) : tr(UI.natural_badge)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" strokeWidth={1.5} />
              {trf(UI.fmt_minutes, { n: tutorial.minutes })}
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />
              {trf(UI.fmt_steps, { n: tutorial.steps.length })}
            </span>
            <span>{tr(LEVEL_UI[tutorial.level])}</span>
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            {tr(tutorial.title)}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted">
            {tr(tutorial.tagline)}
          </p>
        </div>

        {/* Video engine */}
        <div className="fade-up mt-8">
          <Player tutorial={tutorial} idx={idx} setIdx={setIdx} />
        </div>

        {/* Written expert guide */}
        <section className="fade-up mt-14">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.26em] text-sage-deep dark:text-sage">
            <BookOpenText className="h-4 w-4" strokeWidth={1.5} />
            {tr(UI.guide_kicker)}
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
              {tr(UI.guide_title)}
            </h2>
            <p className="max-w-md text-[13px] leading-6 text-muted">{tr(UI.guide_sub)}</p>
          </div>

          <div className="mt-10 space-y-10">
            {tutorial.steps.map((s, i) => (
              <article
                key={i}
                onMouseEnter={() => setIdx(i)}
                className="grid gap-5 md:grid-cols-[92px_1fr]"
              >
                {/* Step numeral */}
                <div className="flex md:flex-col md:items-start">
                  <span className="border-t-2 border-ink pt-2 font-display text-5xl font-light tracking-tight dark:border-sand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 hidden text-[10px] font-bold uppercase tracking-[0.2em] text-faint md:block">
                    {tr(s.focus)}
                  </span>
                </div>

                {/* Body */}
                <div>
                  <h3 className="font-display text-2xl tracking-tight">
                    {tr(s.title)}
                    <span className="ms-3 align-middle font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-faint">
                      {fmtTime(s.dur)}
                    </span>
                  </h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <GuideField
                      icon={<Droplet className="h-3.5 w-3.5" strokeWidth={1.5} />}
                      label={tr(UI.f_dosage)}
                      body={tr(s.dosage)}
                    />
                    <GuideField
                      icon={<Crosshair className="h-3.5 w-3.5" strokeWidth={1.5} />}
                      label={tr(UI.f_anatomy)}
                      body={tr(s.anatomy)}
                    />
                    <GuideField
                      icon={<Hand className="h-3.5 w-3.5" strokeWidth={1.5} />}
                      label={tr(UI.f_tool)}
                      body={tr(s.tool)}
                    />
                    <GuideField
                      icon={<FlaskConical className="h-3.5 w-3.5" strokeWidth={1.5} />}
                      label={tr(UI.f_formula)}
                      body={tr(s.formula)}
                    />
                    <GuideField
                      icon={<Lightbulb className="h-3.5 w-3.5" strokeWidth={1.5} />}
                      label={tr(UI.f_tip)}
                      body={tr(s.tip)}
                      tip
                      wide
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Outcome */}
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border border-line bg-tint-bronze p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-bronze-deep dark:text-sand">
                {tr(UI.final_look)}
              </p>
              <p className="mt-2 font-display text-2xl tracking-tight">{tr(tutorial.outcome)}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="group flex h-11 items-center gap-2 border border-ink bg-ink px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-bg transition-colors hover:bg-bronze-deep hover:border-bronze-deep dark:border-sand dark:bg-sand dark:text-[#181615] dark:hover:bg-bronze"
            >
              {tr(UI.back_to_library)}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" strokeWidth={1.5} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

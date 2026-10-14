"use client";

import { useState } from "react";
import { Header, type TabId } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StreamSection } from "@/components/Library";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import { BrushGuide } from "@/components/BrushGuide";
import { Footer } from "@/components/Footer";
import type { Tutorial } from "@/lib/content";
import { UI } from "@/lib/ui-strings";
import { useI18n } from "@/lib/providers";

export default function Page() {
  const { tr } = useI18n();
  const [tab, setTab] = useState<TabId>("natural");
  const [open, setOpen] = useState<Tutorial | null>(null);

  const scrollToNaturalFeed = () => {
    document
      .getElementById("natural-feed")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const goCreative = () => {
    setTab("creative");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-bg text-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[80] focus:border focus:border-ink focus:bg-bg focus:px-4 focus:py-2 focus:text-[12px] focus:font-semibold focus:uppercase focus:tracking-widest"
      >
        {tr(UI.skip_to_content)}
      </a>

      <Header tab={tab} onTab={setTab} />

      <main id="content">
        {tab === "natural" && (
          <>
            <Hero
              onExploreNatural={scrollToNaturalFeed}
              onExploreCreative={goCreative}
              onOpen={setOpen}
            />
            <div id="natural-feed" className="scroll-mt-28">
              <StreamSection stream="natural" onOpen={setOpen} />
            </div>
          </>
        )}

        {tab === "creative" && (
          <StreamSection stream="creative" onOpen={setOpen} />
        )}

        {tab === "brushes" && <BrushGuide />}
      </main>

      <Footer onTab={setTab} />

      {open && <TutorialOverlay tutorial={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

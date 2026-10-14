// Every single UI text node in the app is declared here once (English source).
// The i18n engine translates these values dynamically at runtime.
export const UI = {
  brand_name: "Makeup Academy",
  brand_kicker: "Professional Artistry School",
  skip_to_content: "Skip to content",

  // Navigation tabs
  nav_natural: "Natural & Everyday",
  nav_creative: "Creative & Stage",
  nav_brushes: "Interactive Brush Guide",

  // Hero
  hero_kicker: "Welcome to Makeup Academy",
  hero_title_a: "Master professional techniques",
  hero_title_b: "from scratch.",
  hero_sub:
    "A senior-artist-led curriculum covering skin prep, sculpting, eyes and lips — plus a fully isolated stage & SFX atelier. Every lesson pairs step-by-step video with a deep written expert guide.",
  hero_cta_primary: "Explore natural tutorials",
  hero_cta_secondary: "Browse creative masterclasses",
  hero_single_model: "Single-model curriculum",
  stat_masterclasses: "Masterclasses",
  stat_steps: "Guided steps",
  stat_brushes: "Pro brushes",
  stat_languages: "Languages",
  hero_card_caption: "Editorial finish — Natural & Everyday stream",
  trending_kicker: "Right now in the atelier",
  trending_title: "Trending lessons",
  self_app: "Self-application",

  // Stream banners
  natural_badge: "Default stream",
  natural_title: "Natural & Everyday Atelier",
  natural_desc:
    "Clean, wearable, everyday technique only. Skin prep, soft contour, nude lips and everyday eyeliner — the professional fundamentals, taught layer by layer on one consistent model.",
  creative_badge: "Strictly isolated stream",
  creative_title: "Creative & Stage Atelier",
  creative_desc:
    "Extreme artistry lives here and only here: 3D structural graphic liner, stage-proof glam and editorial SFX. Nothing from this stream ever appears in the everyday feed.",
  isolation_note: "Contained by design — zero bleed into Natural & Everyday.",
  self_app_note:
    "Self-application only: one model applies every layer on her own face, on camera — bare to finished look.",
  brushes_badge: "Tool encyclopedia",
  brushes_title: "The Interactive Brush Guide",
  brushes_desc:
    "Select any brush to watch our single model use it on her own face and study its exact specifications — bristle type, density and head shape, compatible formulations and professional movement.",

  // Tutorial cards
  level_beginner: "Beginner",
  level_intermediate: "Intermediate",
  level_advanced: "Advanced",
  fmt_minutes: "{n} min",
  fmt_steps: "{n} steps",
  open_masterclass: "Open masterclass",
  step_by_step_video: "Self-application video included",
  written_guide_included: "Written expert guide included",

  // Tutorial overlay / video engine
  back_to_library: "Back to library",
  now_playing: "Now playing",
  play: "Play",
  pause: "Pause",
  replay: "Replay",
  prev_step: "Previous step",
  next_step: "Next step",
  fmt_step_of: "Step {n} of {m}",
  studio_note: "Self-application studio · single model · warm neutral set · accumulating layers",
  layer_label: "Layer",
  watch_note: "Start from the bare canvas — each layer builds on the last until the final look.",

  // Written expert guide
  guide_kicker: "Senior artist commentary",
  guide_title: "Written Expert Guide",
  guide_sub:
    "Read the technique like a working professional: exact anatomy, tool angle and pressure, formulation chemistry and a field-tested pro fix for every step.",
  f_anatomy: "Anatomical Placement",
  f_dosage: "Product Dosage",
  f_tool: "Tool Angle & Pressure",
  f_formula: "Formulation & Layering",
  f_tip: "Pro Tip",
  final_look: "The finished look",
  speed_label: "Playback speed",
  seek_label: "Seek within this step",
  stage_product: "1. Product",
  stage_tool: "2. Tool Loading",
  stage_apply: "3. Face Application",
  full_face: "Full-face mirror frame",

  // Brush guide
  brush_demo: "Technique demo",
  brush_specs: "Brush specifications",
  spec_bristle: "Bristle type",
  spec_density: "Density & head shape",
  spec_formulas: "Recommended formulations",
  spec_movement: "Application movement",
  spec_best: "Best used for",
  kind_eye: "Eye brush",
  kind_face: "Face brush",
  close: "Close",
  brush_cta: "Study this brush",

  // Header controls
  language_label: "Language",
  search_languages: "Search languages…",
  theme_label: "Theme",
  theme_light: "Light",
  theme_dark: "Dark",
  translating: "Translating interface…",
  translated_to: "Displayed in {name}",
  translation_failed: "Offline — showing English",

  // Footer
  footer_line: "A professional makeup education platform. Technique first, trends second.",
  footer_streams: "Streams",
  footer_school: "School",
  footer_curriculum: "Curriculum",
  footer_ethos: "One model. Warm neutral studio. Zero guesswork.",
} as const;

export type UiKey = keyof typeof UI;
export const UI_STRINGS: string[] = Object.values(UI);

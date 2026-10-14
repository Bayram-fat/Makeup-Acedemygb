import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Server-side persistent cache for translated strings — one row per
// (locale, source) pair so repeated language switches are instant and
// external translation calls are minimised.
export const translationCache = pgTable(
  "translation_cache",
  {
    id: serial("id").primaryKey(),
    locale: text("locale").notNull(),
    sourceHash: text("source_hash").notNull(),
    source: text("source").notNull(),
    translated: text("translated").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("translation_cache_locale_hash_idx").on(t.locale, t.sourceHash)],
);

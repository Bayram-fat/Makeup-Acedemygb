import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { translationCache } from "@/db/schema";
import { googleCode } from "@/lib/langs";

export const runtime = "nodejs";
export const maxDuration = 60;

const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/**
 * Parse the gtx `single` endpoint into one slot per input string.
 * `null` marks a string that still needs an individual retry.
 */
function parseGtx(data: unknown, count: number): (string | null)[] {
  const out: (string | null)[] = new Array<string | null>(count).fill(null);
  if (!Array.isArray(data)) return out;
  const joinSegs = (entry: unknown): string => {
    if (!Array.isArray(entry) || !Array.isArray(entry[0])) return "";
    return (entry[0] as unknown[])
      .map((seg) => (Array.isArray(seg) ? String(seg[0] ?? "") : ""))
      .join("");
  };
  // Multi-q: one entry per q param.
  if (
    count > 1 &&
    data.length === count &&
    data.every((d) => Array.isArray(d) && Array.isArray((d as unknown[])[0]))
  ) {
    for (let i = 0; i < count; i++) {
      const t = joinSegs(data[i]).trim();
      out[i] = t || null;
    }
    return out;
  }
  // Single-q shape (or only the first query honoured): first entry only.
  if (Array.isArray(data[0])) {
    const t = joinSegs(data).trim();
    if (t) out[0] = t;
  }
  return out;
}

async function gtx(tl: string, batch: string[]): Promise<(string | null)[]> {
  const params = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl,
    dt: "t",
  });
  const qs =
    params.toString() +
    "&" +
    batch.map((s) => "q=" + encodeURIComponent(s)).join("&");
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 7000);
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?${qs}`,
      { signal: ac.signal, headers: { "User-Agent": UA } },
    );
    if (!res.ok) return batch.map(() => null);
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("json")) return batch.map(() => null);
    return parseGtx(await res.json(), batch.length);
  } catch {
    return batch.map(() => null);
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  let body: { locale?: string; strings?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const locale = String(body.locale ?? "");
  const raw = Array.isArray(body.strings) ? body.strings : [];
  const strings = Array.from(
    new Set(
      raw.filter((s): s is string => typeof s === "string" && s.length > 0),
    ),
  ).slice(0, 400);

  if (!locale || locale === "en" || strings.length === 0) {
    return NextResponse.json({ translations: {} });
  }

  const hash = (s: string) => sha(`${locale}${s}`);
  const translations: Record<string, string> = {};
  const pending = new Set<string>(strings);

  // 1) Persistent locale-scoped cache (best effort).
  try {
    const rows = await db
      .select({
        sourceHash: translationCache.sourceHash,
        translated: translationCache.translated,
      })
      .from(translationCache)
      .where(eq(translationCache.locale, locale))
      .limit(2000);
    const byHash = new Map(rows.map((r) => [r.sourceHash, r.translated]));
    for (const s of strings) {
      const hit = byHash.get(hash(s));
      if (hit) {
        translations[s] = hit;
        pending.delete(s);
      }
    }
  } catch {
    /* cache unavailable */
  }

  // 2) Batch fetch first (fast path), then per-string retries on misses.
  const deadline = Date.now() + 48000;
  const tl = googleCode(locale);
  const remain = Array.from(pending);
  const inserts: {
    locale: string;
    sourceHash: string;
    source: string;
    translated: string;
  }[] = [];

  // Fast path: small batches.
  for (let i = 0; i < remain.length && Date.now() < deadline; i += 8) {
    const batch = remain.slice(i, i + 8);
    const results = await gtx(tl, batch);
    batch.forEach((s, j) => {
      const t = results[j];
      if (t) {
        translations[s] = t;
        pending.delete(s);
        if (t !== s) {
          inserts.push({
            locale,
            sourceHash: hash(s),
            source: s.slice(0, 4000),
            translated: t.slice(0, 4000),
          });
        }
      }
    });
    if (i + 8 < remain.length) await sleep(100);
  }

  // Slow path: individual retries with gentle pacing.
  for (const s of Array.from(pending)) {
    if (Date.now() > deadline) break;
    const [t] = await gtx(tl, [s]);
    await sleep(160);
    if (t) {
      translations[s] = t;
      pending.delete(s);
      if (t !== s) {
        inserts.push({
          locale,
          sourceHash: hash(s),
          source: s.slice(0, 4000),
          translated: t.slice(0, 4000),
        });
      }
    }
  }

  // Whatever could not be fetched now falls back to English gracefully —
  // the next request completes it from cache + retries.
  for (const s of pending) translations[s] = s;

  // 3) Persist successes (best effort).
  if (inserts.length) {
    try {
      await db
        .insert(translationCache)
        .values(inserts)
        .onConflictDoNothing({
          target: [translationCache.locale, translationCache.sourceHash],
        });
    } catch {
      /* cache write failed */
    }
  }

  return NextResponse.json(
    { translations },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}

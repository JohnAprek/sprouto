# Sprouto — Product Requirements Document (v2, reconciled)

> **Why v2 exists.** The original PRD (`Sprouto_PRD_Based_on_Tanamanku_Check`) was authored
> *blind*: every section that hits the live product is gated on *"URL returned 404 Not Found."*
> The author never saw the app, so ~40% of what it lists as "to-build" already ships. This v2
> re-bases the document on the **actual, live product** and folds in engineering reality.

| Field | Value |
|---|---|
| Product | **Sprouto** — Plant Care Guide & Encyclopedia |
| Live URL | https://johnaprek.github.io/sprouto/ (English-first, Indonesian toggle) |
| Repo | github.com/JohnAprek/sprouto |
| Tagline | Grow, Care & Manage Your Plants |
| Version / Date | v2.0 · 2026-06-15 |

---

## 0. Reality check (answers the original PRD's 16 open questions)

| Topic | Status |
|---|---|
| Tech stack | React 18 + Vite + react-router-dom, PWA (vite-plugin-pwa) |
| Plant data | JSON — `plants.json` (ID) + `plants.en.json` (EN), **70 plants**, master data only |
| Branding | Fully renamed to Sprouto; **Indonesian kept as a language toggle** (EN default) |
| Platform | PWA live; TWA → Play Store path scaffolded (`ANDROID.md`, `android/twa-manifest.json`) |
| Accounts | **localStorage only**, no login (correct for now) |
| Monetization | none yet |
| 404 / deployment | **resolved** — SPA routing + `404.html` fallback work; old `/tanamanku/` URL redirects |

---

## 1. What already ships (do not rebuild)

- **Encyclopedia**: search (name + scientific), filters (category, difficulty, sort, hydroponic), 70 plants.
- **Plant detail**: structured care cards (water/light/difficulty/fertilizer), care tips, **"Grow From Scratch" 6-phase checklist with progress %** (a unique hook the original PRD never noticed), related plants, share.
- **My Garden ("Kebunku")**: add plant with start date → **7-day care calendar** computing watering/fertilizing/pruning tasks.
- **Favorites** (wishlist via heart) — *separate* from My Garden.
- **Home dashboard**: greeting, stats (favorites / garden / catalog / streak), popular plants, daily tip.
- **Tools/Guides**: hydroponic nutrient calculator (AB-mix/EC/pH), 8-topic gardening guide (soil, media, pH, fertilizer, drainage, problems, hydroponics, greenhouse + cost).
- **Platform**: dark mode, i18n EN/ID toggle, streak, PWA installable, browser notifications, full icon set.

---

## 2. Vision & positioning

Sprouto turns plant *information* into a **habit-forming plant care companion**: users add the plants
they own, get reminded to care for them, track growth, and learn with step-by-step guides — with an
AI care assistant later. Beginner → intermediate owners, global, English-first.

**Moat vs Planta / Greg / PlantIn (all tracker + photo-ID):** Sprouto's *guidance depth* — the
grow-from-scratch coaching, soil/nutrient/greenhouse tools, and a grounded (not generic) AI assistant.

---

## 3. Key product decisions (where v2 diverges from the original PRD)

1. **Do NOT gate the free tier at 3 plants.** A hard low cap punishes your most-engaged users (the
   4th-plant adder is your best retention signal) and kills activation. **Keep core care free and
   generous.** Monetize *advanced value*, not plant count. → see §6.
2. **Keep the differentiators.** De-emphasize hydroponics in *positioning* (agree) but **keep the
   tools/guides** — they are the moat. Promote "Grow From Scratch" to a first-class feature.
3. **Keep Indonesian.** It is built, and Indonesia is a huge plant market. EN-first **+** ID = two
   markets for free. Do not discard.
4. **AI = grounded care assistant, not another plant-ID app.** Photo-ID is expensive and commoditized.
   Differentiate with **RAG over `plants.json` + guides** (cheap, accurate, on-brand). Photo-ID is
   optional/last. → see §7.
5. **Reminders are the make-or-break technical decision.** → see §5. Treat it as architecture, not "later."
6. **Add toxicity / pet-safety data.** Cheap, high-trust, and a real differentiator. → see §4, §8 backlog.
7. **Clarify the two "save" concepts.** Favorites = wishlist; My Garden = plants you own & track.
   Make the distinction explicit in UI copy (or merge).

---

## 4. Plant data schema (current + additions)

Already present: `id, name, scientificName, category, difficulty, schedules{watering,fertilizer,pruning,repotting}, careDetails{watering,sunlight,fertilizer,pruning,commonProblems,soil?,temperature?,humidity?}, hidroponik{...}, imageUrl`.

**Add:**
| Field | Type | Why |
|---|---|---|
| `toxicity` | `{ pets: 'toxic'\|'non-toxic'\|'caution', note: string }` | Trust + safety differentiator |
| `affiliateProducts` | `array` (later) | First low-friction revenue (pots/soil/fertilizer) |
| `tags` | `array` (indoor/outdoor/edible/flowering/low-light) | Powers better filters than category alone |

---

## 5. 🔴 Reminder architecture (the retention engine — decide now)

**Problem.** A "habit app's" core loop is reminders, but today reminders use `new Notification()`
checked **only when the app is opened** — a circular loop (you're reminded only if you already opened
it). Web/PWA push is unreliable on iOS and limited on Android without a backend.

**Options.**
| Approach | Reliability | Cost | Verdict |
|---|---|---|---|
| Check-on-open (current) | ✗ circular | free | placeholder only |
| Service worker + Periodic Background Sync / Notification Triggers | partial, browser-gated | free | weak, experimental |
| **TWA + Android local notifications** | ✅ strong on Android | low | **recommended for Play Store launch** |
| FCM push backend + service worker | ✅ strong, cross-platform | needs backend | later, when scaling |

**Decision:** since launch target is **Play Store (TWA)**, implement **local scheduled
notifications on the Android side** so reminders fire without opening the app. Keep the web build's
notifications as best-effort. Revisit FCM only when a backend exists.

---

## 6. Monetization (revised)

Sequence by friction, lowest first:

1. **Affiliate first** (M3) — pots, soil, fertilizer, moss poles on plant detail / shopping list.
   Frictionless, no paywall, works from day one.
2. **Sprouto Plus** (M3–M4) — *advanced value*, NOT plant count: smart/seasonal scheduling, unlimited
   journal photos, multi-device sync, advanced calendar, no ads. ~$2.99/mo or $19.99/yr.
3. **AI Pro / credits** (M4+) — grounded AI assistant + (later) photo checks, with quotas.
4. Optional launch lifetime deal once there's real usage.

> Reasoning: a brand-new, unknown app must **build the habit + base first**. Capping core care at
> 3 plants trades long-term retention for negligible early revenue. Gate *power features*, not *care*.

---

## 7. AI roadmap (cost-controlled, grounded)

| Phase | Feature | Control |
|---|---|---|
| 1 | Care Q&A grounded in `plants.json` + guides (RAG) | Answer only from app content; cite the plant profile |
| 2 | Personalized schedule (type, indoor/outdoor, season, history) | Deterministic core + LLM phrasing |
| 3 | Possible-problem triage from symptoms (text first) | "possible issue, not a diagnosis" disclaimer |
| 4 | Photo ID / photo problem check (optional) | Confidence + alternatives; quota/credits; only if demand proven |

Use the latest Claude models; cache; cap with credits.

---

## 8. Re-based roadmap & backlog

- ~~M0 Fix 404~~ ✅ done · ~~M1 Encyclopedia~~ ✅ done (polish only)
- **M2 — Retention (now):**
  - `TOX-001` Add `toxicity` to all 70 plants (sourced) + **pet-safety card** in detail. *(highest ROI quick-win)*
  - `JRNL-001` **Plant Journal**: notes + photos + timeline per owned plant. *(the only big P1 not built)*
  - `UX-001` Clarify Favorites vs My Garden copy.
  - `NOTIF-001` TWA local scheduled notifications (per §5).
- **M3 — Light monetization:** `AFF-001` affiliate links on detail; `MON-001` Plus paywall on *advanced* features.
- **M4 — AI assistant (RAG):** `AI-001` grounded care Q&A + quota.
- **M5 — Photo features (optional):** only if AI Q&A proves demand.

---

## 9. Success metrics (MVP targets)

| Metric | Target |
|---|---|
| Activation (added ≥1 plant) | 40% |
| D1 / D7 retention | 25% / 10–15% |
| Reminder completion | 30%+ of delivered |
| Detail → save | 10%+ |
| Free → paid | 1–3% (later, after base built) |
| Crash-free sessions | 99%+ |

---

## 10. Technical notes

- Keep **plant master data vs user data** separate (already true: JSON master + localStorage user state).
- Optional cloud sync via **Supabase** only when users ask for multi-device — not at MVP.
- Bundle currently ships both EN+ID datasets + both guides; consider **lazy-loading per language** if size grows.
- Store user photos separately from public plant images; provide delete-account/data flow before accounts ship.

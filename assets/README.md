# AppHatchery Discovery — Asset Slot System

Every artifact in [`shared/content.js`](../shared/content.js) carries an `asset` object with three
slots that point into this folder:

```js
asset: { sticker: "assets/stickers/<file>.svg", mascot: "assets/mascots/<id>.png", screen: "assets/screens/<id>.png" }
```

These are **slots, not final art**. The V2 canvas (and every other version) renders whatever is at
those paths. Drop a higher-fidelity file in at the same path and it hot-swaps with zero code changes.

This pass seeded the slots: **real store app icons** where they exist, and **on-brand placeholder
stickers + decorative doodles** for the whole board. Mascots and product screenshots are intentionally
left empty for the user to provide.

> **Hi-fi upgrade pass (2026-06-17, 2nd).** The V2-canvas stickers were upgraded with REAL imagery
> wherever it could be confidently mapped:
> - **`ready-tonsillectomy`** now renders its **real Play-Store app icon** (`asset.sticker` →
>   `app-icons/ready-tonsillectomy.png`) instead of the generic placeholder.
> - **`eyra`** and **`sensory-sims`** (previously weak STUB placeholders) now render **real product
>   imagery pulled from `apphatchery.org/work`** (saved to `screens/`, used as the sticker).
> - The **6 publications** previously shared one identical generic `pub.svg` ("Research paper"). Each
>   now points at its **own distinct sticker** (`pub-<id>.svg`) showing **venue · year** as the hero
>   (e.g. "BMC Medicine · 2023", "PLOS ONE · 2024") + a one-line topic subtitle.
> - The **6 service** stickers were refined: the **`[0X]` index** is now the hero top-left label, with
>   a small mono `SERVICE` tag bottom-left and the numbered node-ring glyph retained.
> - Images that could **not** be confidently mapped were left on placeholders (no mis-assignment):
>   **`hometown`, `herheart`, `mama-love`, `in-the-know`** are not featured on the current
>   apphatchery.org/work gallery, so no real product image exists to pull. (`vocalis-care`, `typeu`,
>   `ga-tb-guide`, `cchd-pulseox`, `fabla` already had real logo PNGs and kept them.)

---

## Folder layout & naming conventions

| Folder | Slot | Naming | What lives here |
|---|---|---|---|
| `app-icons/` | (icon) | `app-icons/<id>.png` | Real, downloaded store/site app icons. `<id>` = the artifact `id` in content.js. |
| `stickers/` | `sticker` | `stickers/<file>.svg` | Die-cut "board sticker" for each artifact. **Filename = the exact value in `asset.sticker`** (see mapping note below). Plus `deco-*.svg` flavor doodles. |
| `mascots/` | `mascot` | `mascots/<id>.png` | Optional character/mascot art (e.g. Fabla's blue blob). **Empty — awaiting user.** |
| `screens/` | `screen` | `screens/<id>.png` | App/product screenshots or hero shots. **Empty — awaiting user.** |

> **Sticker filename ≠ id (by design).** `content.js` points several artifacts at shorter or
> shared sticker filenames. The seeded stickers are written at the **exact path content.js expects**,
> so they resolve today. Key remaps: `vocalis-care`→`vocalis.png`, `ga-tb-guide`→`tbguide.png`,
> `cchd-pulseox`→`pulseox.png`, `fabla`→`fabla.png` (real logos), `in-the-know`→`intheknow.svg`,
> `mama-love`→`mamalove.svg`, all services→`svc-*.svg`. **`ready-tonsillectomy` now points at its
> real store icon** (`app-icons/ready-tonsillectomy.png`); **`eyra`/`sensory-sims` point at real
> website screenshots** (`screens/eyra.png`, `screens/sensory-sims.png`). **Each publication now
> uses its own distinct `pub-<id>.svg`** (venue · year). All 3 news items still share `news.svg`
> (per-item `news-*.svg` are provided as opt-in extras — repoint `asset.sticker` to use one).

### Recommended formats & sizes

| Slot | Format | Size | Notes |
|---|---|---|---|
| App icon | **PNG** | 512–1024 px square | Square, no rounding needed (the UI rounds corners). Store icons are pre-rendered. |
| Sticker | **SVG** | ~220×220 viewBox | Vector, transparent bg, includes its own white die-cut border + soft drop shadow. Scales freely. |
| Mascot | **PNG** (transparent) or SVG | ~480–800 px, transparent bg | Character art. Loose framing so it can overhang a card edge. |
| Screen | **PNG** | ≥1242 px wide (phone) | App screenshot or product hero. Keep aspect ratio; the canvas crops as needed. |

---

## Sticker design language (so new ones match)

- **Shape:** rounded-rect, ~16 px inner radius (`circle` variant used for prototype `tool`s).
- **Die-cut border:** ~7 px solid white ring around the colored body.
- **Shadow:** soft drop shadow (`feDropShadow dy=5 blur=6`, deep-blue tint @ ~22%).
- **Type label:** uppercase `[TYPE]` in mono (`Geist Mono` → `ui-monospace`), top-left.
- **Title:** `Geist` (sans-serif fallback), bold, centered, tight letter-spacing.
- **Fill by type:**
  - `app` → brand blue `#105194`, cream text — app dot-grid motif
  - `tool` / prototype → `#19558F`, cream text — spark/asterisk motif
  - `publication` → cream `#F4F2EC`, blue text — paper-stack motif **+ small orange `PAPER` tag**;
    leads with **venue · year** (blue, in a year pill) + a one-line topic subtitle (ink) — one per paper
  - `service` → blue-tint `#C3D3DE`, ink text — numbered node-ring motif; **`[0X]` index** is the
    hero top-left mono label, service name centered, small mono `SERVICE` tag bottom-left
  - `news` → cream, ink text — broadcast-signal motif
  - `pipeline` → yolk orange `#F59A2C`, dark text — egg + upward hatch-arrow motif

### Decorative doodles (`stickers/deco-*.svg`)
Brand-color flavor marks to scatter on the board: `deco-egg` (hatching egg + yolk),
`deco-squiggle` (connector), `deco-triangle`, `deco-blob` (friendly mascot-family shape),
`deco-star` ("Aha!" sparkle), `deco-arrow` ("drag this way").

---

## CHECKLIST — what's filled vs. awaiting you

Legend: ✅ done · ⬜ awaiting user · — not applicable / not requested

| id | type | App icon (`app-icons/`) | Sticker (`stickers/`) | Mascot (`mascots/`) | Screen (`screens/`) |
|---|---|---|---|---|---|
| **fabla** | app | ✅ real (App Store, 1024px) | ✅ placeholder `fabla.svg` | ⬜ blue blob (noted in content.js) | ⬜ |
| **vocalis-care** | app | ✅ real (App Store, 1024px) | ✅ placeholder `vocalis.svg` | — | ⬜ |
| **typeu** | app | ✅ real (App Store, 1024px) | ✅ placeholder `typeu.svg` | — | ⬜ |
| **ga-tb-guide** | app | ✅ real (App Store, 1024px) | ✅ placeholder `tbguide.svg` | — | ⬜ |
| **cchd-pulseox** | app | ✅ real (App Store, 1024px) | ✅ placeholder `pulseox.svg` | — | ⬜ |
| **hometown** | app | ⚠️ **SKIPPED** — Play listing 404s now | ✅ placeholder `hometown.svg` | — | ⬜ |
| **ready-tonsillectomy** | app | ✅ real (Play Store, 512px) | ✅ **real store-icon** (sticker → `app-icons/ready-tonsillectomy.png`) | — | ⬜ |
| **siby** | tool | — (prototype, no store) | ✅ placeholder `siby.svg` (circle) | ⬜ | ⬜ |
| **herheart** | app | — (no live store listing) | ✅ placeholder `herheart.svg` | — | ⬜ |
| **mama-love** | tool | — (research, no store) | ✅ placeholder `mamalove.svg` (circle) | — | — |
| **in-the-know** | app | — (repo only, STUB) | ✅ placeholder `intheknow.svg` | — | — |
| **eyra** | app | — (STUB) | ✅ **website screenshot** (sticker → `screens/eyra.png`) | — | ✅ real (apphatchery.org/work) |
| **sensory-sims** | app | — (STUB) | ✅ **website screenshot** (sticker → `screens/sensory-sims.png`) | — | ✅ real (apphatchery.org/work) |
| **pub-app-dev-bmc** | publication | — | ✅ **distinct** `pub-app-dev-bmc.svg` (BMC Medicine · 2023) | — | — |
| **pub-tb-plos** | publication | — | ✅ **distinct** `pub-tb-plos.svg` (PLOS ONE · 2024) | — | — |
| **pub-hometown-pbc** | publication | — | ✅ **distinct** `pub-hometown-pbc.svg` (Pediatric Blood & Cancer · 2023) | — | — |
| **pub-fabla-brm** | publication | — | ✅ **distinct** `pub-fabla-brm.svg` (Behavior Research Methods · 2025) | — | — |
| **pub-herheart-jmir** | publication | — | ✅ **distinct** `pub-herheart-jmir.svg` (JMIR Formative Research · 2022) | — | — |
| **pub-chatgpt-bias-jmir** | publication | — | ✅ **distinct** `pub-chatgpt-bias-jmir.svg` (J Med Internet Research · 2024) | — | — |
| **svc-human-factors** | service | — | ✅ on-brand `svc-research.svg` `[01]` | — | — |
| **svc-ucd** | service | — | ✅ on-brand `svc-design.svg` `[02]` | — | — |
| **svc-mobile-dev** | service | — | ✅ on-brand `svc-mobile.svg` `[03]` | — | — |
| **svc-web-dev** | service | — | ✅ on-brand `svc-web.svg` `[04]` | — | — |
| **svc-xr** | service | — | ✅ on-brand `svc-xr.svg` `[05]` | — | — |
| **svc-consultation** | service | — | ✅ on-brand `svc-consult.svg` `[06]` | — | — |
| **news-r50** | news | — | ✅ shared `news.svg` (+ opt-in `news-r50.svg`) | — | — |
| **news-fabla-ncats** | news | — | ✅ shared `news.svg` (+ opt-in `news-fabla-ncats.svg`) | — | — |
| **news-office-hours** | news | — | ✅ shared `news.svg` (+ opt-in `news-office-hours.svg`) | — | — |
| **pipeline** | pipeline | — | ✅ placeholder `pipeline.svg` | ⬜ | — |

---

## What's still needed from you (the high-fidelity drop)

1. **Real imagery for 4 artifacts that have none** — these are **not featured on apphatchery.org/work**
   and have no live store listing, so no real product image could be pulled (left on tasteful
   placeholders, not mis-mapped):
   - **`hometown`** — Google Play listing (`org.apphatchery.hometown`) returns **404**; drop
     `app-icons/hometown.png` or a `screens/hometown.png` if you have one.
   - **`herheart`** — research/repo only, no live page; drop a `screens/herheart.png` if available.
   - **`mama-love`** — research output, no live page.
   - **`in-the-know`** — STUB, repo only; confirm scope before featuring.
2. **Mascots** (`mascots/<id>.png`, transparent) — none provided yet. Highest-value:
   - `mascots/fabla-blob.png` — the friendly blue blob (content.js notes it exists).
   - `mascots/siby.png` — Siby character.
   - `mascots/pipeline.png` — an egg/hatchling for the "Start a project" pipeline (optional).
3. **Screens** (`screens/<id>.png`) — `eyra.png` + `sensory-sims.png` are now filled from
   apphatchery.org/work. Still useful to add hi-res screenshots / hero shots for `fabla`, `vocalis`,
   `typeu`, `tbguide`, `pulseox`, `siby` (these currently render their logo as the V2 sticker).
4. **Hi-fi stickers** (optional) — the remaining SVGs are tasteful placeholders/on-brand cards. To
   replace any, overwrite the same `stickers/<file>.svg` path. News items still share `news.svg`
   (repoint `asset.sticker` to a `news-*.svg` to give one its own card).

> Real app icons fetched: **6 of 7** LIVE store-listed apps (fabla, vocalis-care, typeu, ga-tb-guide,
> cchd-pulseox at 1024px; ready-tonsillectomy at 512px — now used directly as that app's V2 sticker).
> **hometown skipped** (listing 404). Website product imagery pulled for **eyra** + **sensory-sims**
> from apphatchery.org/work. The remaining artifacts are prototypes, research outputs, STUBs,
> publications, services, or news — none have a confidently-mappable real image, so they use stickers.

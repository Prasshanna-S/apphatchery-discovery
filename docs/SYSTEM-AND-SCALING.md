# AppHatchery Discovery — System Intent & Scaling Brief

*A strategy document: what this system is, why it exists, how it works, and the vectors along which it can scale. Written to fuel a scaling brainstorm — read §7–§12 with a whiteboard open.*

---

## 1. Executive summary

The AppHatchery Discovery Experience is an **interactive matching layer** that sits in front of AppHatchery's portfolio of digital-health products, studies, and services. Instead of a static website that asks a visitor to already know what they want, it **guides or lets them explore** their way to the right thing — an existing app, a relevant publication, a service — and, when nothing fits, routes them straight to the team with their idea intact.

Built as **four interchangeable front-ends on one shared engine**:
- **V1 — Simple Accessible Guide** (planned): a 3–4 question wizard; the "works for everyone, everywhere" baseline.
- **V2 — 2D Scattered Canvas** (built): an infinite, draggable board of the real products; a guided console whose answers highlight relevant work; results as cards + a persistent contact path.
- **V3 — 3D / WebGL** (planned): an immersive, navigable space at showcase fidelity.
- **V4 — Intelligent Widget** (planned): a small embeddable assistant for every page of apphatchery.org, with an AI "describe it in your own words" mode.

All four read the **same source of truth** (`shared/content.js`) and the **same routing brain** (`shared/routing.js`). That architecture is the key to scaling: enrich the foundation once, and every front-end and channel improves at once.

**The deeper point:** the real asset is not the UI — it's the **flywheel**. Every interaction is a signal of *demand* (what people need, what's missing). Routed well, that signal simultaneously (a) connects people to existing work, (b) captures new project leads, and (c) tells AppHatchery what to build next. Scaling this system = scaling that flywheel.

---

## 2. The problem it solves

AppHatchery builds genuinely useful tools, but the people who'd benefit **don't find them** — and AppHatchery's growth depends on people arriving with ideas and problems. Three concrete frictions:

1. **Articulation gap.** Researchers/clinicians often can't name what they need ("I want… some kind of app… for my study?"). A static nav assumes they can. They can't, so they bounce.
2. **Discoverability gap.** Phase-0 audience research (Ithaka S+R US Faculty Survey 2021) found that for academics, **"limited awareness" is the top barrier** to adopting research tools — bigger than cost or capability. The work exists; the awareness doesn't.
3. **Lead gap.** AppHatchery's pipeline *is* people showing up with "I have an idea." Most discovery tools bury "contact us" as a sad-path. For an incubator, that path is the **primary** outcome, not the fallback.

Layered on top: the audience skews **30–60, not very tech-savvy, cautious, time-poor**, and **visual design is the single most-cited web-credibility cue** (Stanford Web Credibility Study — "design look" present in 46.1% of credibility judgments). So the experience must be *both* effortless and polished enough to earn trust.

> **One-sentence problem:** people who could benefit from AppHatchery can't self-match to it, and AppHatchery can't see the demand it's missing.

---

## 3. What the system is

A **discovery + routing layer** with three jobs, in priority order:

1. **Route to existing work** — surface the app / study / publication / service that fits.
2. **Always keep a live path to the team** — the "Start a project" pipeline is first-class and ever-present, because new ideas are the business.
3. **Sense demand** — capture what people are looking for (especially the *misses*) as a roadmap signal.

It expresses these through **three entry intents** every visitor self-selects into:
- *"I have an idea"* → likely something new → lead with the pipeline, show adjacent work as proof of capability.
- *"I have a problem"* → match to existing apps/publications + pipeline.
- *"I'm just exploring / I'm curious"* → roam the portfolio; pipeline always present.

And **four delivery modes** (the versions) so the same logic can meet people in the right context: an accessible standalone link, a tactile exploration, an immersive showcase, or a quiet always-there widget.

---

## 4. Who it's for

| Segment | What they arrive with | What they need |
|---|---|---|
| **Researcher / PI** | A study idea, a data-collection problem | A tool, a study platform, methods, or a build partner |
| **Clinician / Provider** | A bedside/communication/screening pain | A point-of-care tool or reference; workflow fit |
| **Patient / Caregiver** | A condition, a "how do I cope" need | Education, navigation, support |
| **Public health** | Population-level programs | Reference tools, dashboards, reach |
| **Has an idea (builder)** | Ambition, not yet a spec | Reassurance + a path to the team |
| **Just curious** | Nothing specific | A welcoming, low-pressure browse |

Design consequences (non-negotiable, evidence-backed): ≥18px body, AA contrast, large targets, plain language, no hover-only, motion-safe (35% of adults 40+ have vestibular dysfunction), and a warm tone that **never makes anyone feel shooed away**.

---

## 5. How it works (architecture)

```
                 shared/content.js     ← single source of truth
                 (verified inventory)     apps · tools · publications ·
                        │                  services · people · PIPELINE
                        ▼
                 shared/routing.js     ← the "brain"
                 (intent + audience +     QUESTIONS, scoring, rank(),
                  problem-area scoring)    partition() for live preview
                        │
        ┌───────────────┼───────────────┬───────────────┐
        ▼               ▼               ▼               ▼
      V1 Guide      V2 Canvas        V3 WebGL        V4 Widget     ← interchangeable
      (accessible)  (exploration)    (showcase)      (embed/AI)       front-ends
                        │
                        ▼
                 shared/tokens.css     ← one brand-aligned, accessible design system
```

- **`content.js`** — every routable artifact as a structured record: `id, type, title, tagline, description, url, secondaryUrls, audience[], problemAreas[], evidenceType, urlVerified, asset{}`. Honest verification flags built in. This is the spine; everything renders from it.
- **`routing.js`** — turns answers into a ranked match set **plus the pipeline, always**. Supports *partial* answers, so the board can react live as you hover an option (background highlights the projects that answer would surface).
- **The versions** are different *expressions* of the same engine — not separate apps. New front-end ≈ new view over the same data + brain.
- **The pipeline (`PIPELINE`)** is a first-class object, not a footer link — present in every state, hero on a no-match.

**Why this matters for scaling:** the cost of "more" is concentrated in the foundation. Add an artifact once → it appears, routes, and is searchable across all four versions and every channel.

---

## 6. Design principles (the bar to hold while scaling)

- **Minimal, light, coherent** — brand-aligned to apphatchery.org so it embeds natively; mechanics borrowed from best-in-class references, *colors and voice from the brand*.
- **Visual over textual** — real product logos and screenshots do the talking; the portfolio should *look* like a portfolio.
- **Guided OR exploratory** — never force one mode; the curious and the precise both have a path.
- **Warm, never a dead end** — "no match" = "that's a new idea — let's build it together."
- **Accessible by default** — the most-used version (V1) must work for everyone; the showy versions degrade gracefully.
- **Trust through polish** — for this audience, craft *is* the credibility strategy.

---

## 7. Why it's strategically valuable (the reframe)

Treat it as three businesses in one surface:

1. **A discovery engine** — fixes the awareness barrier; more of the right people reach the right work.
2. **A demand sensor** — every query, especially every *miss*, is a datapoint on unmet need. The aggregate is a **roadmap** AppHatchery can't get any other way.
3. **A lead funnel** — the always-on pipeline converts intent into structured conversations with the team.

The compounding loop:

```
   visitors ──▶ guided/exploratory matching ──▶ existing work found  ──▶ trust ↑
       ▲                     │                                           │
       │                     ▼                                           ▼
   roadmap ◀── demand signals (esp. "no match" queries) ◀── leads captured ──▶ new builds
```

**Scaling the system = scaling this loop**, not just adding pages. That's the lens for everything below.

---

## 8. Scaling vectors (brainstorm fuel)

### 8.1 Content scale — *make the inventory bigger and self-maintaining*
- Move `content.js` behind a lightweight **CMS / headless source** so non-engineers add artifacts.
- **Auto-ingestion** of the things that already have feeds: App Store / Play listings, PubMed/CrossRef (publications), the GitHub org, the Framer site. Phase 0 proved these are scrapeable + verifiable.
- **Freshness as a feature:** the `urlVerified` / `lastVerified` discipline becomes a scheduled job (the HomeTown listing 404 we caught is exactly the failure mode to automate against).
- Expand artifact *types*: datasets, protocols, templates, talks, office-hours slots, grants.

### 8.2 Intelligence scale — *from rules to understanding*
- Ship **V4's AI mode**: "describe what you're working on in your own words" → LLM interprets → matches against the inventory (RAG over `content.js` + publication abstracts) → recommends 1–2 things + a contact nudge. (Architecture already anticipates this.)
- **Semantic search** so the routing isn't limited to the fixed question tree.
- **Auto-drafted project brief**: the AI turns a free-text idea into a structured intake the team receives — shrinking "I have an idea" → "here's a scoped conversation."
- Use the LLM to **auto-tag** new artifacts (audience, problem areas) on ingestion — closes the loop with §8.1.

### 8.3 Channel / embedding scale — *be everywhere the audience already is*
- The **V4 widget** drops onto every page of apphatchery.org, Georgia CTSA, Emory SOM, partner sites — one `<script>` tag.
- **Conference / office-hours mode**: a QR that opens the experience; a kiosk build; "scan to find the right tool."
- Surface inside **email, Slack, the monthly Office Hours** funnel (which already exists and runs an app raffle).
- Each channel is the *same engine*, themed — not a rebuild.

### 8.4 Org / white-label scale — *the engine is generic*
This is fundamentally a **"portfolio discovery + lead-routing" engine**. Nothing about it is AppHatchery-specific except the data and tokens. The same system could serve:
- Other CTSA hubs / university tech-transfer offices.
- A research-software incubator, a design studio, a multi-lab institute.
- Any org with **a portfolio + a "talk to us" motive**.
Swap `content.js` + `tokens.css` → a new instance. This is the largest scaling surface and worth a serious look.

### 8.5 Pipeline / CRM scale — *turn the funnel into a system*
- Wire the contact pipeline to a real **intake → routing → booking** flow (route to Morgan / the right lead; book Office Hours; create a CRM record).
- **Returning-visitor memory**: remember what someone explored; resume; nudge.
- Treat captured ideas as a managed queue, not a mailto.

### 8.6 Measurement / feedback-loop scale — *the strategic payoff*
- Instrument intents, queries, matches, and conversions.
- **"No-match" analytics = product roadmap.** The questions people ask that the portfolio can't answer are the highest-signal input AppHatchery could have for what to build next. This is the flywheel's flywheel.
- Dashboards: top unmet needs by audience, conversion by channel, which artifacts get discovered vs ignored (under-marketed wins).

### 8.7 Experience-mode scale — *right fidelity for the moment*
- The 4 versions become a **menu**: accessible link for emails, widget for the site, canvas for exploration, WebGL for keynotes/showcases.
- Add modes as contexts demand (mobile-first, kiosk, presentation/"demo" mode).

### 8.8 Technical scale — *cheap to extend, fast to load*
- Migrate V2/V3 to a **Vite build** (CDN was for the draft); code-split the heavy 3D.
- Keep the **shared-foundation** discipline so a 5th front-end is a weekend, not a quarter.
- Performance + a11y budgets enforced in CI (the audience runs older machines/browsers).

---

## 9. Risks & constraints to weigh while scaling

- **Content freshness/accuracy** — a discovery engine that points to dead links destroys trust. Verification must scale with the inventory (automate it).
- **AI trust** — for clinicians/researchers, a wrong or unsourced recommendation is worse than none. Cite sources; constrain to the real inventory; fail to "talk to us," never to a hallucination.
- **Accessibility at scale** — easy to regress as features grow; budget + audit it.
- **Brand coherence** — more channels/contributors → drift risk; the shared `tokens.css` is the guardrail.
- **Privacy** — once you capture leads/ideas, you're holding people's data and unpublished research concepts. Handle accordingly (consent, storage, who-sees-it).
- **Maintenance ownership** — who owns the inventory + the pipeline after launch?

---

## 10. A phased scaling path (a starting straw-man, not a mandate)

- **Now → near term:** finish V1 (accessible baseline) + V4 widget (the two most-used in practice); ship onto apphatchery.org; basic analytics.
- **Mid term:** CMS-backed inventory + auto-ingestion + scheduled verification; V4 AI mode with cited matches + auto-drafted briefs; CRM/Office-Hours intake wiring; the "no-match → roadmap" dashboard.
- **Long term:** white-label/multi-tenant engine; semantic search; multi-channel (kiosk, conference, partner embeds); V3 WebGL showcase for flagship moments.

---

## 11. What it is *not* (to keep the brainstorm honest)

- Not a CMS or a replacement for apphatchery.org — it's a *layer* that embeds into it.
- Not a generic chatbot — it's grounded in a *verified, finite* portfolio.
- Not "done at four versions" — the versions are front-ends; the value is the foundation + the loop.

---

## 12. Open questions for the brainstorm

1. **Which outcome do we optimize first** — discovery (route to existing), capture (new leads), or sensing (roadmap signal)? They reinforce each other but imply different first features.
2. Is the bigger prize **depth for AppHatchery** or **breadth as a white-label engine** for other hubs?
3. What's the **canonical home** of the inventory once it's bigger than a JS file — and who maintains it?
4. How aggressive should the **AI matching** be vs. the deterministic question flow — and where does "talk to a human" always win?
5. What would we have to instrument **on day one** so that, a year in, the "no-match" log is a credible roadmap?
6. What's the **single metric** that tells us this is working? (Leads? Matches-found? Time-to-relevant? Reduction in "I didn't know you did that"?)

---

*System status: V2 (2D scattered canvas) built; shared foundation (content inventory, routing, tokens) in place; V1/V3/V4 designed and ready to build on the same engine. Repo: this directory. See `shared/content.js` for the live, verified portfolio inventory.*

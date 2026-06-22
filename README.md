# AppHatchery — Unified Discovery + Intake System (POC)

An interactive discovery experience that helps researchers and clinicians find the right
**AppHatchery** tool, study, or path to the team — and then routes them into a structured
intake that ends with an **AI-generated report emailed to the team**. Built to replace a
static site where ~64% of visitors bounce without reading anything.

> AppHatchery is the **Georgia CTSA / Emory University** digital-health incubator —
> "health-tech ideas, from first sketch to a launched, studied app."

**Live demo build:** `version-2-dock/` · **Safe checkpoints:** git tags `stable-v1`, `working-v2`

---

## TL;DR — what this does

```
Visitor lands → floating board of AppHatchery's real apps + a small intro card + a macOS-style dock
   │
   ├─ Explore   → roam the sticker board freely
   ├─ Guide     → 2 quick questions → matched apps light up
   ├─ Talk      → LIVE Tavus video agent (warm context, "available now")
   │                └─ on call end → transcript → GPT writes an intake report
   │                                  → saved locally + emailed to the team
   ├─ Contact   → quick chip intake form → structured record (saved/emailed)
   └─ Browse    → the full toolkit as a list
```

Two systems, one funnel: a **Discovery Engine** (route + build trust) and an **Intake Pipeline**
(Tavus conversation *or* chip form → structured record → AI report → email). Every query — and
especially every "no match" — is loggable demand signal.

---

## What's built (status)

| Piece | Status |
|---|---|
| **Shared foundation** (`shared/`) — verified content inventory, routing brain, intake contract, design tokens | ✅ built |
| **Discovery Engine** — guided 2-question flow → ranked matches; live option-hover highlighting of the board | ✅ built |
| **`version-2-dock/`** — the showcase build: top intro card, scattered floating board, **macOS dock** (fisheye magnify, real app-icons, "available now" presence) | ✅ built |
| **Tavus intake** — server creates a warm conversation (discovery context pre-loaded), `routing.js` exposed as a live tool, ends cleanly | ✅ built + verified live |
| **AI report pipeline** — call ends → fetch transcript → **GPT (gpt-4o-mini)** writes a structured intake report → saved to `server/data/` + shown on `/review.html` | ✅ built + verified |
| **Email delivery** — report emailed to `INTAKE_EMAIL_TO` via **Resend** | ✅ built + verified (real sends) |
| **Chip intake** — tappable form fallback → structured record (same contract) | ✅ built |
| `version-2-canvas/` — earlier variant (center mission card, no dock) | ✅ kept for reference |
| Production backend (Notion/Airtable), custom Tavus replica, domain-verified email | ⏳ next phase |

---

## Quick start

### Option A — static (discovery + chip intake, no keys)
ES-module imports need http (not `file://`):
```bash
python3 -m http.server 8000
# open http://localhost:8000/version-2-dock/
```
The "Talk" (video) path gracefully falls back to the chip form when no server/keys are present.

### Option B — full pipeline (Tavus + GPT report + email)
Zero-dependency Node server (Node 18+ for global `fetch`):
```bash
cp server/.env.example .env        # then fill in the keys below
npm run setup:persona              # one-time: creates the Tavus persona → prints TAVUS_PERSONA_ID
npm start                          # serves the app + the /api pipeline on :8000
# open http://localhost:8000/version-2-dock/
```

**Environment variables** (in a gitignored `.env` — never committed):

| Var | Purpose |
|---|---|
| `TAVUS_API_KEY` | Tavus CVI (live video agent) |
| `TAVUS_PERSONA_ID` | created by `npm run setup:persona` |
| `TAVUS_REPLICA_ID` | defaults to a stock replica (`r90bbd427f71`) — no recording needed |
| `OPENAI_API_KEY` | GPT intake-report synthesis (`OPENAI_MODEL` defaults to `gpt-4o-mini`) |
| `RESEND_API_KEY` | email delivery (free tier; sign up with the recipient address) |
| `INTAKE_EMAIL_TO` | report recipient (e.g. `fprassh@emory.edu`) |
| `PUBLIC_URL` | optional https tunnel for Tavus webhooks (transcript is also fetched on-demand, so optional locally) |

See `server/README.md` for the server details.

---

## The end-to-end pipeline

```
Discovery (version-2-dock) ──► POST /api/start-conversation
   discovery answers + matched artifact ids                 (server/tavus.js)
        └─► Tavus /v2/conversations  (conversational_context + custom_greeting)
              └─► returns conversation_url (Daily room) → embedded in branded chrome
                    └─► replica calls match_portfolio / capture_intake_record
                          → answered live by routing.js  (the engine, inside the call)

End call ──► POST /api/end-conversation  (server/index.js → finalizeIntake)
   1. endConversation()       → Tavus /v2/conversations/{id}/end   (clean close)
   2. fetchTranscript()       → Tavus GET ?verbose=true            (server/notes.js)
   3. synthesizeIntake()      → OpenAI gpt-4o-mini → markdown report
   4. saveDoc()               → server/data/intake-*.json          (the "document somewhere")
   5. sendIntakeEmail()       → Resend → INTAKE_EMAIL_TO
        └─► visible at /review.html (auto-refreshing)
```

Chip intake (`/api/lead`) produces the **same structured record** and is saved the same way.

---

## Repository structure

```
shared/                  Framework-agnostic foundation (used by every front-end)
  content.js             Verified inventory: apps, publications, services, people, the contact pipeline (with verification flags — no fabrication)
  routing.js             The matching brain: questions, getOptions, rank(), partition()
  intake.js              Lead-record builder + submit adapter + demand-signal log
  tokens.css             Design tokens (brand-aligned, accessibility-tuned)

version-2-dock/          ⭐ THE SHOWCASE BUILD
  index.html             Page shell (top intro card, dock, console, review hooks)
  canvas.js              Engine: infinite board, dock, discovery, intake, Tavus client (Daily SDK + tool-calls)
  styles.css             Base canvas styles
  intake.css             Handoff / chip survey / confirmation / Tavus modal
  dock.css               macOS dock, intro card, presence dot, branded Tavus chrome

version-2-canvas/        Earlier variant (center mission card, no dock) — reference

server/                  Zero-dependency Node server (Node 18+)
  index.js               Static serving + /api endpoints + finalizeIntake orchestration
  tavus.js               Create / end conversation; builds the warm context
  notes.js               Transcript fetch + GPT synthesis + Resend email
  setup-persona.js       One-time: create the Tavus persona (portfolio + tools)
  env.js                 Minimal .env loader (zero-dep)
  .env.example           Template for the keys above
  README.md              Server run + integration notes

review.html              Intake-review page (lists saved reports/records; auto-refreshes)
assets/                  App logos/stickers, screenshots, mascots, dock icons
docs/                    PRESENTATION.md, SYSTEM-AND-SCALING.md, HANDOFF.md
```

---

## Verified

- Discovery → matched apps; chip intake → confirmation → **record persisted server-side**.
- Tavus: live conversation **created** (real `conversation_url`), **ended** cleanly (200).
- GPT report **generated** from a transcript (accurate, structured) and **saved**.
- Email **delivered** via Resend (real message ids) to `fprassh@emory.edu`.
- Front-end flows driven + screenshotted; server backbone exercised via the `/api` routes.

## Safe points (git tags)
- **`stable-v1`** — first working POC (dock + live Tavus, before the AI/email pipeline).
- **`working-v2`** — full pipeline verified (Tavus → GPT report → email).
- `git checkout <tag>` to return to either.

## Docs
- **`docs/HANDOFF.md`** — deep context to resume this project (decisions, gotchas, what's pending, open decisions). **Start here if picking this back up.**
- **`docs/PRESENTATION.md`** — the pitch / talking points / live-demo script.
- **`docs/SYSTEM-AND-SCALING.md`** — the strategy + scaling brief.

---

Built with Claude Code. Secrets live only in a gitignored `.env`; supply your own keys for a fresh clone.

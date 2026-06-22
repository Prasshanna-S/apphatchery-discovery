# Handoff / Resume Context

Everything needed to pick this project back up. Read this first, then `README.md`.
(Secrets are **not** in the repo — they live in a gitignored `.env`; see "Secrets" below.)

---

## 1. What this is, in one paragraph

A POC for **AppHatchery** (Georgia CTSA / Emory digital-health incubator) that turns a
high-bounce static site into a **unified Discovery + Intake funnel**. The visitor explores a
draggable board of AppHatchery's real apps, can get **guided** to a match, or **talk to a live
Tavus video agent** (or a chip form). When a conversation ends, the transcript is sent to **GPT**,
which writes a structured **intake report** that is saved locally and **emailed to the team**.
Grounded in the master brief's data: ~64% bounce, ~190 real monthly visitors, /contact at 6.2%,
2 CTSA referrals/mo, goal **3× project onboarding**.

The canonical brief is `MASTER-BRIEF.md` (was in `~/Downloads/`, not committed — ask the user
for it / add it to `docs/` if resuming seriously). The pitch is `docs/PRESENTATION.md`; the
strategy is `docs/SYSTEM-AND-SCALING.md`.

## 2. The build that matters

**`version-2-dock/` is the showcase build.** `version-2-canvas/` is an earlier variant (center
mission card, no dock) kept for reference — when in doubt, work in `version-2-dock/`. The two
share `shared/` but each has its own `canvas.js` (the Tavus/intake logic is duplicated; if you
do major work, consider extracting a `shared/tavus-client.js` to de-duplicate).

Run: `npm start` (full pipeline, needs `.env`) or `python3 -m http.server 8000` (static, chip
fallback). Open `http://localhost:8000/version-2-dock/`. Review page: `/review.html`.

## 3. UI state model (version-2-dock/canvas.js)

The home screen = **small fixed intro card at the top** + **scattered floating board** + **macOS
dock**. The centre `#console` is the *mode surface* and is **hidden at home**, shown only in a mode.

- `body` has **no class** at home → CSS shows `.intro-banner`, hides `.console`.
- `showConsole()` adds `body.in-mode` → CSS shows `.console`, hides `.intro-banner`.
- `renderIntro()` = **go home** (removes `in-mode`, resets state; the intro is the static banner, not a console card).
- Dock items (`buildDock` / `DOCK_NAV`):
  - **Explore** (egg icon, id `about`) → `renderIntro()` (home)
  - **Guide** (compass) → `showConsole()` + `goToStep(0)` (2-question discovery → result)
  - **Talk** (person, green "available" dot) → `showConsole()` + `startTavus()` (live video)
  - **Contact** (envelope) → `openContact()` → `renderIntakeDetails()` (chip form — *not* the old 3-way handoff)
  - **Browse** (grid) → `toggleSimplified(true)` (full list overlay)
  - utilities: **Re-center**, **Reduce motion**
- A floating **↻ Reload** button (top-right) = `location.reload()` (added for clean demo restarts).
- **De-dupe rule:** Talk = video only; Contact = form only. The old `renderHandoff()` (3-way) is
  dead code now — `openContact` and the result CTA both go straight to the form.

## 4. Tavus + AI pipeline (the important wiring)

**Create (warm handoff):** `version-2-dock/canvas.js startTavus()` → `POST /api/start-conversation`
with `{ discovery, matchedArtifacts }` → `server/tavus.js createConversation()` injects them as
`conversational_context` + a `custom_greeting` → Tavus `/v2/conversations` → returns
`conversation_url` (a Daily room). The persona (`server/setup-persona.js`) carries the verified
portfolio in its system prompt + two tools: `match_portfolio`, `capture_intake_record`.

**In-call:** `openTavus()` joins the Daily room via the Daily SDK and `handleTavusMessage()`
answers the replica's tool calls with `routing.js` (the discovery engine *inside* the
conversation). Falls back to a plain iframe if the SDK fails, and to the chip form if no key.

**End → report → email:** closing the panel → `POST /api/end-conversation` →
`server/index.js finalizeIntake()`:
1. `endConversation()` → Tavus `/v2/conversations/{id}/end` (clean close)
2. `fetchTranscript()` → Tavus `GET ?verbose=true` (polled up to 5× / 2.5s — transcript lands a few seconds after the call ends)
3. `synthesizeIntake()` → OpenAI `gpt-4o-mini` → markdown report
4. `saveDoc()` → `server/data/intake-*.json`
5. `sendIntakeEmail()` → Resend → `INTAKE_EMAIL_TO`
Then the frontend shows the acknowledgment (`renderConfirmation`).

`/api/finalize` runs the same flow with a posted transcript (used to test without a live call).
`/api/docs` feeds `review.html`. Chip intake (`/api/lead`) saves the same structured record;
`intake.js submitLead()` posts to `window.AH_INTAKE_ENDPOINT` (`/api/lead`) when set, else
localStorage + a prefilled `mailto`.

## 5. Gotchas (things that bit us — don't relearn them)

- **No-cache is essential in dev.** The browser pins stale CSS hard. The Node server sends
  `Cache-Control: no-store`; if you serve another way, bust the cache or you'll chase ghosts.
- **NEVER GSAP-tween the `#console` transform/opacity.** It centres via CSS `translate(-50%,-50%)`;
  a GSAP transform breaks centring + leaves it translucent. `reveal()` only animates
  stickers/dock/topbar (+ banner opacity). The intro banner also centres via `translateX(-50%)` —
  its entrance animates **opacity only** for the same reason.
- **Resend free tier** only sends to the **account-owner email** without a verified domain.
  It works when the Resend account is created with the recipient address. To send elsewhere, verify a domain.
- **Tavus live avatar needs a real browser + camera/mic.** Playwright headless creates the
  conversation but won't render the avatar — verify the video by hand in Chrome.
- **Playwright `evaluate`-clicks race the load/reveal.** Guard on element existence, or take a
  screenshot first to let it settle, before driving the UI.
- **Free-tier Tavus minutes (~25).** Keep demo calls short; conversations also auto-time-out
  (`participant_absent_timeout`).
- This is **plain ES modules** (browser) + **zero-dep Node** (server). No build step, no bundler.

## 6. Verified vs. pending

**Verified:** discovery→match, chip intake→confirmation→server-persisted record, Tavus
create + clean end, GPT report generation, **real email delivery via Resend** (message ids
returned), the review page.

**Pending / next phase:**
- 3-card bottom-bar variant (user asked; deprioritized to ship the working pipeline).
- Production backend: **Notion or Airtable** instead of `server/data/` files.
- A **custom Tavus replica** (a real recorded team member) instead of the stock replica.
- **Domain-verified email** for clean inbox delivery (vs. `onboarding@resend.dev`).
- Decide the fate of `version-2-canvas/` (backport the dock/intro, or retire it).
- Optional: extract `shared/tavus-client.js` to de-duplicate the per-version canvas logic.

## 7. Open decisions (the team's, per brief §10)
Tavus twin identity · exact "good-fit" criteria · who owns the **no-match log** · Notion vs
Airtable · acknowledgment-email legal review · Emory comms sign-off.

## 8. Secrets
A gitignored `.env` (recreate from `server/.env.example`) holds:
`TAVUS_API_KEY`, `TAVUS_PERSONA_ID` (created via `npm run setup:persona`),
`TAVUS_REPLICA_ID` (stock `r90bbd427f71`), `OPENAI_API_KEY`, `OPENAI_MODEL` (`gpt-4o-mini`),
`RESEND_API_KEY`, `INTAKE_EMAIL_TO` (the report recipient). **No key values are committed.**
If keys were shared in chat during the build, rotate them as good practice.

## 9. How to extend (common tasks)
- **Swap a dock icon:** drop a PNG at `assets/dock/<id>.png` (`about` · `guide` · `talk` · `contact` · `browse`).
- **Add a dock tile:** add to `DOCK_NAV` in `version-2-dock/canvas.js` + a glyph in `GLYPH` + an icon PNG.
- **Change the tagline / intro:** edit the `.intro-banner` markup in `version-2-dock/index.html`.
- **Edit the portfolio:** `shared/content.js` (keep the verification flags honest — never fabricate a tool).
- **Tune the report:** the system prompt in `server/notes.js synthesizeIntake()`.
- **Real backend:** implement in `finalizeIntake()` / `/api/lead` (replace `saveDoc` with Notion/Airtable).

## 10. Resume prompt
> "Resume the AppHatchery Discovery + Intake POC. The showcase build is `version-2-dock/`; read
> `docs/HANDOFF.md`. Run with `npm start` (+ `.env`). Tags `stable-v1` / `working-v2` are safe points."

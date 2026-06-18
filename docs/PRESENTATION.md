# AppHatchery Unified Discovery + Intake — Presentation & Talking Points

*Everything you need to walk into the room and present this. Structure: **Problem → Proof → Combine → Scale → Ask.** It's built; this is how to talk about it.*

---

## 0. The one-liner (memorize this)

> "We turned AppHatchery's website — where 64% of people leave without reading anything — into a guided pipeline that helps a researcher find what we've built, *or* start a structured conversation with us. It's one funnel, it's running code, and the same engine could run for every CTSA hub in the country."

---

## 1. The 30-second hook (open with this)

> "63.8% of the people who visit AppHatchery's website leave without reading a single thing. The researchers who most need us — the ones with funded grants and clinical problems — can't tell from our homepage that we exist for them. And when they *do* reach out, their email lands in an inbox with no screening, no record, and no acknowledgment. We built one system that fixes the whole path. Let me show you."

Then go straight to the demo (§5). Show, then explain.

---

## 2. The problem — three failures (2 min, data on screen)

AppHatchery's stated goal is **3× annual project onboarding** (~7–8 today → ~21–24). Word of mouth can't close that. Three compounding failures:

| Failure | The evidence |
|---|---|
| **Discovery** | 63.8% bounce. Only **2 referrals/month** from cascade.emory.edu — our entire target audience is essentially absent. Funnel collapses 185 → 43 → 32 → **28** pageviews to /contact. |
| **Intake** | Qualified inquiries land in an inbox with personal projects and bad-fit asks. No screening, routing, records, or acknowledgment. **10 warm leads exist today with *zero* intake infrastructure** — people who pushed through the friction anyway. |
| **Articulation** | Researchers can't name what they need. *"I want… some kind of app… for my study?"* is the entry point, not a spec. The site has no way to handle that. |

> **The sentence to land:** "This isn't a copy problem. It's structural — there's no mechanism for a researcher to self-qualify, see proof, and start a conversation without one of us doing manual work."

---

## 3. The proof — this is built, not a mockup (3 min)

Two systems, now combined into **one pipeline** — and it runs:

1. **Discovery Engine** *(built, demoable live)* — a draggable board of AppHatchery's *real, verified* portfolio. The visitor picks an intent, answers a few tappable questions, and the board surfaces matched apps + research in real time. They see *"AppHatchery has built something like mine"* before we ask anything.
2. **Intake Pipeline** *(built — chip survey live; Tavus video wired, key-drop-in)* — replaces the dead inbox. Captures a **structured lead record**, shows an honest acknowledgment, logs a demand signal, and routes to the team. **No one is ever rejected.**

> **The sentence to land:** "The proof of concept is not a slide. It's running code. The routing brain works. The intake captures a real record. This is ready for integration, not a design exercise."

---

## 4. The combine — how the two become one funnel (2 min)

```
Researcher → DISCOVERY (route + match, build trust)
          → warm handoff (answers pre-loaded — we never re-ask)
          → INTAKE:  ① Talk to the team (Tavus video)   ② 3 quick questions (chip)   ③ email
          → structured record + instant acknowledgment + demand-signal log
          → AH team reviews and decides follow-up
```

The integration point is the **warm handoff**: the discovery answers (intent, audience, area) pre-populate the intake, so the conversation starts *with context*. In the Tavus path, our **routing brain runs as a tool *inside* the live conversation** — the avatar can say *"that sounds like what we built for PRISM — have you seen it?"* in real time, pulling only from the verified portfolio (it cannot invent a tool).

> **The sentence to land:** "These aren't two features side by side. Discovery builds trust and captures context; intake converts it into a record — without a human touching anything until the follow-up decision."

Underneath both, silently: **every query — especially every 'no match' — is logged.** That aggregate is the most honest product roadmap AppHatchery could have.

---

## 5. The live demo script (5 min — the centerpiece)

> Have the app open at `localhost:8000/version-2-canvas/`. The chip path is the **guaranteed-live** demo; show the Tavus video only if a key is loaded and you've tested it.

1. **Open it.** "Running in a browser — no install, no login. This is the first thing a researcher sees, before a nav click."
2. **Pick "I have an idea I want to build."** Answer the questions as a funded oncology PI. *Point out:* the background logos react as you hover each option — "the routing is working in real time, and it only ever shows real products."
3. **Land on the result.** Matched apps appear as cards + related research. "This is the trust moment — *we've done this before* — and we built it before asking the researcher for anything."
4. **Click "Start a project."** Show the warm handoff: *"Based on what you told us — researcher · [area]. We won't ask again."* Three paths: **Talk to the team (video)**, **3 quick questions**, or **email**.
5. **Take the chip path.** Three taps (stage, funding, timeline) + optional email. **No typing required** until the optional email.
6. **Show the confirmation.** *"Your project is with the team… you'll hear from a person."* Honest, immediate, with relevant links while they wait.
7. **(If Tavus keyed)** Re-run and click **Talk to the team** — the avatar opens already knowing their context and greets them by what they were looking at.
8. **Reveal the back-end.** Show the captured structured record (and the demand-signal log). "Every one of these is a lead we currently lose. And every 'no match' is a roadmap input."

> **Close the demo:** "Everything you just saw is working code. The discovery engine is live. The intake captures records today. The Tavus video is wired — it needs a recorded team member and a key to flip on."

---

## 6. The scale + moonshot (2 min)

- **Phase 1 (≈2 weeks):** the chip-survey intake live on the /contact page — provably shippable (it's a flow + a record + an email).
- **Phase 2–3:** Framer embed + analytics → Tavus video intake → transcript-to-report automation.
- **Phase 4–5:** AI matching, a CMS-backed inventory, then the moonshot.

> **The moonshot line:** "Nothing here is AppHatchery-specific except the data and the brand. There are 60+ CTSA hubs in the US, each with a portfolio and a contact page that goes nowhere. AppHatchery deploys this first, proves it, and the engine becomes infrastructure for academic research translation. The 'no-match' signal across 60 nodes would be the most honest real-time map of unmet researcher needs in the US health system. This is not a website feature — it's a SaaS layer."

---

## 7. The ask (close the meeting)

**Phase-1 POC in production in 2 weeks.** Three decisions are needed from this room (without them, specific pieces stall):

| Decision | Why it's blocking |
|---|---|
| **Which team member becomes the Tavus twin?** | Blocks the recording session (stock replica works for the demo meanwhile). |
| **What are the exact "good-fit" criteria?** | Shapes the routing logic + the conversation script. |
| **Who owns the "no-match" log?** | Without a named owner with a review cadence, the demand signal dies in month two. |
| *(Operational)* **Notion or Airtable?** + acknowledgment-email **legal/comms** sign-off | Determines the backend wiring + whether we can launch without approval. |

---

## 8. Objection handling (keep in your back pocket — from the hard version of the room)

- **"The AI will hallucinate and recommend the wrong tools."** → The matching is **deterministic** — `routing.js` ranks a finite, human-verified inventory; nothing is generated. The only LLM (the Tavus conversation) is constrained by tool-calling to that same verified list and is instructed never to invent a tool.
- **"Researchers won't talk to an AI avatar."** → Some won't — that's why the chip survey is always there. We **lead with the person** ("Talk to [Name]"), never the word "AI", and it's the *third* step, after they've already seen something relevant. Context before conversation.
- **"It's a quiz. Researchers hate quizzes."** → It gives value *before* it asks — the board shows the whole portfolio first; questions are a shortcut, not a gate; skip is always there. The word "qualify" never appears — it's matchmaking, not gatekeeping.
- **"The acknowledgment is just an auto-response."** → Yes, and it's honest about that: immediate (<5 min), specific (links to tools relevant to their stated area), brief, and never pretends to be personal. An empty acknowledgment beats a generic one.
- **"Too complex for 2 weeks."** → Phase 1 is *one page, one survey, one email.* The rest is shown so you see where it fits — we're not asking you to approve a 6-week build today.
- **"The demand-signal roadmap is theoretical."** → True at launch; it compounds after ~90 days. But a log of 30 queries with 5 misses already beats 30 emails that don't survive staff turnover. Present it as a side-effect benefit, not a day-one deliverable.

---

## 9. Honest status (so no one is surprised later)

| Piece | Status |
|---|---|
| Discovery engine (V2 canvas) | **Built, running, live-demoable** |
| Verified portfolio inventory (`content.js`) | **Built** — real apps/publications/services, verification flags |
| Routing brain (`routing.js`) | **Built** — 4-question flow, real-time preview |
| Integrated intake — chip survey + confirmation + structured record + demand log | **Built, live-demoable** |
| Tavus server (`/api/start-conversation`, persona + tools, webhook) | **Built** — needs `TAVUS_API_KEY` + a replica to go live |
| `routing.js` as a live tool inside the Tavus conversation | **Built** — needs a key to test end-to-end |
| Real backend (Notion/Airtable), automated email, transcript→report | **Designed; wiring is Phase 2–3** (decision + keys needed) |

---

*Tip: present from §1 → §5 (hook, problem, proof, combine, demo), then §6 (scale) and §7 (ask). Keep §8 ready for the marketing team's pushback. The demo is the argument — lead with it.*

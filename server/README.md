# AppHatchery POC — server

Zero-dependency Node server (Node 18+) that serves the discovery app **and** powers the
unified **discovery → Tavus intake** pipeline.

## Run

**Static only** (chip-survey intake — no key needed; always works):
```bash
python3 -m http.server 8000        # then open http://localhost:8000/version-2-canvas/
```

**Full pipeline** (live Tavus video intake):
```bash
cp server/.env.example .env        # fill in TAVUS_API_KEY
npm run setup:persona              # creates the intake persona → prints TAVUS_PERSONA_ID
TAVUS_API_KEY=… TAVUS_PERSONA_ID=… npm start
# open http://localhost:8000/version-2-canvas/
```
Without `TAVUS_API_KEY`, the "Talk to the team" handoff **falls back to the chip survey** — the POC always works.

## How the combine works (one pipeline)
1. **Discovery** (V2 canvas) → handoff → `POST /api/start-conversation` with the discovery answers + matched artifact ids.
2. `server/tavus.js` injects those as `conversational_context` + a `custom_greeting` → `POST tavusapi.com/v2/conversations` → returns a `conversation_url`. **The replica starts warm — it never re-asks what discovery captured.**
3. The front-end joins the room (Daily SDK) and answers the replica's **`match_portfolio`** / **`capture_intake_record`** tool calls by running the same **`routing.js`** brain — so the discovery engine lives *inside* the conversation.
4. `POST /api/tavus-webhook` receives `application.transcription_ready` → *(Phase 3)* synthesize a structured report, save to Notion/Airtable, send the acknowledgment email.

## To take live (decisions — master brief §10)
- A real team member recorded as the replica (stock `r90bbd427f71` is fine for the demo).
- Notion **vs** Airtable for lead records; an email key (Resend/Mailchimp) for acknowledgments.
- HIPAA / Emory legal review of Tavus transcript storage.

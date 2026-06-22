/**
 * AppHatchery POC server — zero dependencies (Node 18+ for global fetch).
 *   • Serves the static app (so /version-2-canvas/ works)
 *   • POST /api/start-conversation → creates a Tavus conversation pre-loaded with
 *     the discovery context, returns { conversation_url }
 *   • POST /api/tavus-webhook → receives conversation/transcript events
 *   • GET  /api/leads → the captured records (in-memory demo store)
 *
 * Run:  TAVUS_API_KEY=... TAVUS_PERSONA_ID=... node server/index.js
 * Without a key it still serves the app — the front-end falls back to the chip survey.
 */
import "./env.js";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createConversation, endConversation } from "./tavus.js";
import { fetchTranscript, synthesizeIntake, sendIntakeEmail } from "./notes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = process.env.PORT || 8000;
const leads = [];   // POC store — swap for Notion/Airtable (brief §10 decision)
const DATA_DIR = path.join(__dirname, "data");
try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (_) {}
function saveDoc(prefix, obj) { try { const f = path.join(DATA_DIR, `${prefix}-${Date.now()}.json`); fs.writeFileSync(f, JSON.stringify(obj, null, 2)); console.log("[saved]", path.basename(f)); return f; } catch (_) { return null; } }

/* End-of-call pipeline: transcript → GPT intake report → save locally → email the team. */
async function finalizeIntake({ conversation_id = null, transcript = null, discovery = {}, record = {} } = {}) {
  let tx = transcript;
  if ((!tx || !tx.length) && conversation_id) {            // transcript lands a few seconds after the call ends
    for (let i = 0; i < 5 && (!tx || !tx.length); i++) { await new Promise(r => setTimeout(r, 2500)); tx = await fetchTranscript(conversation_id); }
  }
  const synth = await synthesizeIntake({ transcript: tx || [], discovery, record });
  const to = process.env.INTAKE_EMAIL_TO || "info@apphatchery.org";
  const subject = `AppHatchery intake — ${record.researchArea || discovery.area || discovery.intent || "new inquiry"}`;
  const email = await sendIntakeEmail({ to, subject, markdown: synth.doc });
  const file = saveDoc("intake", { kind: "intake", conversation_id, discovery, record, transcriptLines: (tx || []).length, synthesized: synth.ok, reason: synth.reason || null, document: synth.doc, emailedTo: to, email, at: new Date().toISOString() });
  console.log(`[intake finalised] synth=${synth.ok} email=${email.via}(ok=${email.ok}) → ${file ? path.basename(file) : "?"}`);
  return { ok: synth.ok, emailed: email.ok, via: email.via, document: synth.doc, file };
}

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".webp": "image/webp", ".woff2": "font/woff2" };

const send = (res, code, body, headers = {}) => { res.writeHead(code, { "Cache-Control": "no-store", ...headers }); res.end(body); };
const json = (res, code, obj) => send(res, code, JSON.stringify(obj), { "Content-Type": "application/json" });
async function readBody(req) { const c = []; for await (const ch of req) c.push(ch); return Buffer.concat(c).toString("utf8"); }

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "POST" && url.pathname === "/api/start-conversation") {
    if (!process.env.TAVUS_API_KEY) return json(res, 503, { error: "TAVUS_API_KEY not set" });
    try { return json(res, 200, await createConversation(JSON.parse(await readBody(req) || "{}"))); }
    catch (e) { return json(res, 502, { error: String(e.message || e) }); }
  }
  if (req.method === "POST" && url.pathname === "/api/tavus-webhook") {
    try {
      const b = JSON.parse(await readBody(req) || "{}");
      console.log("[tavus webhook]", b.event_type || "?");
      // The FINAL DOCUMENT lands here. (Prod: synthesize w/ Claude → Notion/Airtable → ack email.)
      if (/transcription_ready|shutdown/.test(b.event_type || "")) {
        const file = saveDoc("tavus", { conversation_id: b.conversation_id, event: b.event_type, transcript: (b.properties && b.properties.transcript) || null, at: new Date().toISOString() });
        leads.push({ kind: "tavus", conversation_id: b.conversation_id, file, at: new Date().toISOString() });
      }
    } catch (_) {}
    return json(res, 200, { ok: true });
  }
  if (req.method === "POST" && url.pathname === "/api/lead") {       // structured intake records (chip + Tavus capture)
    try { const b = JSON.parse(await readBody(req) || "{}"); const file = saveDoc("lead", b); leads.push({ kind: "lead", ...b, file }); } catch (_) {}
    return json(res, 200, { ok: true });
  }
  if (req.method === "POST" && url.pathname === "/api/end-conversation") {
    try {
      const b = JSON.parse(await readBody(req) || "{}");
      const ended = await endConversation(b.conversation_id);
      finalizeIntake({ conversation_id: b.conversation_id, discovery: b.discovery || {}, record: b.record || {} }).catch(e => console.error("[finalize]", e));   // GPT flow runs async
      return json(res, 200, { ...ended, finalizing: true });
    } catch (_) { return json(res, 200, { ok: false }); }
  }
  if (req.method === "POST" && url.pathname === "/api/finalize") {       // test/trigger the GPT flow directly
    try { return json(res, 200, await finalizeIntake(JSON.parse(await readBody(req) || "{}"))); }
    catch (e) { return json(res, 500, { ok: false, error: String(e.message || e) }); }
  }
  if (req.method === "GET" && url.pathname === "/api/docs") {            // for the review page
    try { const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json")).sort().reverse().slice(0, 60); return json(res, 200, files.map(f => { try { return { file: f, ...JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf8")) }; } catch (_) { return { file: f }; } })); }
    catch (_) { return json(res, 200, []); }
  }
  if (req.method === "GET" && url.pathname === "/api/leads") return json(res, 200, leads);

  // ---- static files ----
  let p = decodeURIComponent(url.pathname);
  if (p === "/") p = "/index.html";
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) return send(res, 403, "forbidden");
  fs.readFile(file, (err, data) => {
    if (!err) return send(res, 200, data, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    fs.readFile(path.join(file, "index.html"), (e2, d2) => e2 ? send(res, 404, "not found") : send(res, 200, d2, { "Content-Type": "text/html" }));
  });
});

server.listen(PORT, () => {
  const on = !!process.env.TAVUS_API_KEY && !!process.env.TAVUS_PERSONA_ID;
  console.log(`AppHatchery POC → http://localhost:${PORT}/version-2-canvas/`);
  console.log(`Tavus video intake: ${on ? "ON" : "OFF (chip-survey fallback) — set TAVUS_API_KEY + TAVUS_PERSONA_ID"}`);
});

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
import { createConversation } from "./tavus.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = process.env.PORT || 8000;
const leads = [];   // POC store — swap for Notion/Airtable (brief §10 decision)

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
      // TODO (Phase 3): on application.transcription_ready → synthesize report (Claude)
      //       → save to Notion/Airtable → send acknowledgment email → notify team.
      leads.push({ kind: "tavus", event: b.event_type, conversation_id: b.conversation_id, at: new Date().toISOString(), raw: b });
    } catch (_) {}
    return json(res, 200, { ok: true });
  }
  if (req.method === "POST" && url.pathname === "/api/lead") {       // chip-survey records (optional server save)
    try { const b = JSON.parse(await readBody(req) || "{}"); leads.push({ kind: "chip", ...b }); console.log("[chip lead]", b.researchArea); } catch (_) {}
    return json(res, 200, { ok: true });
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

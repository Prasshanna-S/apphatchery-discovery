/**
 * Tavus CVI integration — server-side only (holds the API key).
 * Verified against docs.tavus.io (mid-2026): base https://tavusapi.com, header x-api-key,
 * POST /v2/conversations → { conversation_url }. Context is injected per-call so the
 * conversation starts WARM — the replica never re-asks what discovery already captured.
 */
import { ARTIFACTS, AUDIENCES, PROBLEM_AREAS } from "../shared/content.js";

const BASE = "https://tavusapi.com";

/* Turn the discovery handoff payload into Tavus conversational_context + a custom greeting. */
export function buildContext({ discovery = {}, matchedArtifacts = [] } = {}) {
  const who = discovery.who ? (AUDIENCES[discovery.who]?.label || discovery.who) : "a visitor";
  const area = discovery.area ? (PROBLEM_AREAS[discovery.area] || discovery.area) : null;
  const intent = discovery.intent || "explore";
  const matched = (matchedArtifacts || []).map(id => { const a = ARTIFACTS.find(x => x.id === id); return a ? a.title : id; }).filter(Boolean);
  const conversational_context = [
    `The visitor has ALREADY told us (do NOT re-ask): role = ${who}; reason for visiting = "${intent}"${area ? `; topic = ${area}` : ""}.`,
    matched.length ? `They saw and engaged with: ${matched.join(", ")}.` : `Nothing in our toolkit was an exact match — treat this as a potentially new build worth the team's attention.`,
    `Open by acknowledging what they're working on, then ask what specific capability gap they're trying to fill.`
  ].join(" ");
  const custom_greeting = matched.length
    ? `Hi — I saw you were looking at ${matched[0]}. Tell me a bit about what your project needs?`
    : `Hi, thanks for stopping by. Tell me a little about what you're working on?`;
  return { conversational_context, custom_greeting };
}

export async function createConversation(body) {
  const { conversational_context, custom_greeting } = buildContext(body);
  const callbackBase = process.env.PUBLIC_URL || "";
  const payload = {
    replica_id: process.env.TAVUS_REPLICA_ID || "r90bbd427f71",   // stock replica for the POC (no recording needed)
    persona_id: process.env.TAVUS_PERSONA_ID,                      // created by server/setup-persona.js
    conversation_name: "AppHatchery intake",
    conversational_context,
    custom_greeting,
    ...(callbackBase ? { callback_url: callbackBase + "/api/tavus-webhook" } : {}),
    properties: { max_call_duration: 1200, participant_left_timeout: 30, participant_absent_timeout: 60, enable_closed_captions: true }
  };
  const res = await fetch(`${BASE}/v2/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.TAVUS_API_KEY },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Tavus ${res.status}: ${await res.text()}`);
  return res.json();   // { conversation_id, conversation_url, status, ... }
}

/* End a conversation cleanly (frees the replica + free-tier minutes). Best-effort. */
export async function endConversation(conversationId) {
  if (!conversationId || !process.env.TAVUS_API_KEY) return { ok: false, skipped: true };
  try {
    const res = await fetch(`${BASE}/v2/conversations/${conversationId}/end`, { method: "POST", headers: { "x-api-key": process.env.TAVUS_API_KEY } });
    return { ok: res.ok, status: res.status };
  } catch (e) { return { ok: false, error: String(e.message || e) }; }
}

/**
 * AppHatchery — INTAKE PIPELINE  (shared/intake.js)
 * =================================================
 * Phase 1 of the unified system (per MASTER-BRIEF §9): the chip-survey intake that
 * the Discovery Engine hands off to. NO Tavus yet — Tavus is Phase 3 and slots in
 * behind the same structured-record contract with zero architectural change.
 *
 * Responsibilities:
 *   • INTAKE_QUESTIONS — the few fields discovery didn't capture (stage/funding/timeline)
 *   • buildLeadRecord() — fuse discovery context + intake answers + contact into one record
 *   • submitLead() — backend-agnostic: POST to a configured endpoint if present, else an
 *     honest no-credential fallback (persist locally + return a prefilled mailto). A real
 *     Notion/Airtable webhook drops in by setting window.AH_INTAKE_ENDPOINT — no code change.
 *   • demand-signal log — every submission (esp. "no match") logged = roadmap signal
 *   • ACK — the acknowledgment copy (warm, immediate, honest, never rejects)
 *
 * Framework-agnostic ES module; also on window.AHIntake for non-bundled pages.
 */

import CONTENT, { PIPELINE } from "./content.js";

/* The intake is short and tappable — discovery already has intent/audience/area/need. */
export const INTAKE_QUESTIONS = [
  {
    id: "stage", prompt: "Where are you in the process?",
    options: [
      { id: "idea",        label: "Just an idea",       hint: "Still shaping it" },
      { id: "funded",      label: "Funded & ready",     hint: "Grant in hand" },
      { id: "in_progress", label: "Already underway",   hint: "A study or build in motion" },
      { id: "unsure",      label: "Not sure yet",       hint: "That's fine too" }
    ]
  },
  {
    id: "funding", prompt: "How's it supported?",
    options: [
      { id: "funded",   label: "We have funding" },
      { id: "applying", label: "Applying / planning to" },
      { id: "none",     label: "No funding yet" },
      { id: "unsure",   label: "Unsure" }
    ]
  },
  {
    id: "timeline", prompt: "And the timeline?",
    options: [
      { id: "now",       label: "As soon as we can" },
      { id: "months",    label: "Over the next few months" },
      { id: "exploring", label: "Just exploring for now" }
    ]
  }
];

/* Fuse everything into the structured record the AH team receives. */
export function buildLeadRecord({ discovery = {}, matches = [], intake = {}, contact = {} } = {}) {
  const matchedIds = (matches || []).map(m => (m && (m.id || (m.artifact && m.artifact.id))) || m).filter(Boolean);
  return {
    submittedAt: new Date().toISOString(),
    // from the discovery engine (the warm-handoff context — never re-asked)
    intent: discovery.intent || null,
    audience: discovery.who || null,
    researchArea: discovery.area || null,
    need: discovery.need || null,
    matchedArtifacts: matchedIds,
    // from the intake chips
    projectStage: intake.stage || null,
    fundingStatus: intake.funding || null,
    timeline: intake.timeline || null,
    // from the optional contact step
    name: contact.name || null,
    email: contact.email || null,
    note: contact.note || null,
    source: contact.source || "discovery-canvas",
    // advisory only — a human always decides follow-up
    fitHint: deriveFitHint(intake, matchedIds)
  };
}
function deriveFitHint(intake, matchedIds) {
  if (intake.funding === "funded" || intake.stage === "funded") return "high";
  if (intake.timeline === "exploring") return "exploratory";
  if ((matchedIds || []).length === 0) return "new-build";
  return "medium";
}

/**
 * Submit a lead. Backend-agnostic by design (Notion vs Airtable still TBD per brief §10).
 *   • If window.AH_INTAKE_ENDPOINT is set → POST the record there (Notion/Airtable proxy, etc.)
 *   • Else (POC, no creds wired) → persist to localStorage + return a prefilled mailto so the
 *     lead is never lost and the team can still receive it. Honest, zero-dependency.
 * Always logs the demand signal first.
 * @returns {Promise<{ok, via, mailto?}>}
 */
export async function submitLead(record) {
  logDemandSignal(record);
  const endpoint = (typeof window !== "undefined" && window.AH_INTAKE_ENDPOINT) || null;
  if (endpoint) {
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record) });
      if (res.ok) return { ok: true, via: "endpoint" };
    } catch (_) { /* fall through to local fallback */ }
  }
  persistLocal(record);
  return { ok: true, via: "local", mailto: mailtoFor(record) };
}

export function mailtoFor(record) {
  const to = (PIPELINE && PIPELINE.email) || "info@apphatchery.org";
  const subject = `New project inquiry — ${record.researchArea || "general"} (${record.projectStage || "stage TBD"})`;
  const body = [
    `Name: ${record.name || "(not given)"}`,
    `Email: ${record.email || "(not given)"}`,
    ``,
    `Intent: ${record.intent || "-"}   Audience: ${record.audience || "-"}`,
    `Research area: ${record.researchArea || "-"}   Need: ${record.need || "-"}`,
    `Stage: ${record.projectStage || "-"}   Funding: ${record.fundingStatus || "-"}   Timeline: ${record.timeline || "-"}`,
    `Saw in discovery: ${(record.matchedArtifacts || []).join(", ") || "-"}`,
    record.note ? `\nNote: ${record.note}` : "",
    ``,
    `Fit hint (advisory only): ${record.fitHint || "-"}`,
    `Submitted: ${record.submittedAt}`
  ].filter(l => l !== undefined).join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function persistLocal(record) {
  try { const k = "ah_intake_records"; const a = JSON.parse(localStorage.getItem(k) || "[]"); a.push(record); localStorage.setItem(k, JSON.stringify(a)); } catch (_) {}
}
/* Demand signal — the strategic flywheel. Every query, especially the misses. */
export function logDemandSignal(record) {
  try {
    const k = "ah_demand_log";
    const a = JSON.parse(localStorage.getItem(k) || "[]");
    a.push({ t: record.submittedAt, intent: record.intent, audience: record.audience, area: record.researchArea, need: record.need, matched: (record.matchedArtifacts || []).length, noMatch: (record.matchedArtifacts || []).length === 0 });
    localStorage.setItem(k, JSON.stringify(a));
  } catch (_) {}
}
export function getDemandLog() { try { return JSON.parse(localStorage.getItem("ah_demand_log") || "[]"); } catch (_) { return []; } }
export function getLeads() { try { return JSON.parse(localStorage.getItem("ah_intake_records") || "[]"); } catch (_) { return []; } }

/* Acknowledgment — warm, immediate, honest, never a rejection (brief §13.2). */
export const ACK = {
  title: "Your project is with the team.",
  body: "We read every inquiry and follow up when there's a potential fit for our current capacity — usually within a few business days. Either way, you'll hear from a person.",
  directLine: (PIPELINE && PIPELINE.email) || "info@apphatchery.org"
};

const INTAKE = { INTAKE_QUESTIONS, buildLeadRecord, submitLead, mailtoFor, logDemandSignal, getDemandLog, getLeads, ACK };
export default INTAKE;
if (typeof window !== "undefined") window.AHIntake = INTAKE;

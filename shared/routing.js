/**
 * AppHatchery Discovery — ROUTING (shared/routing.js)
 * ---------------------------------------------------
 * The "brain": turns a visitor's answers into a ranked set of existing
 * matches PLUS the always-on contact pipeline. Data-driven (reads content.js),
 * supports PARTIAL answers so the V2 canvas can disperse progressively after
 * each question. Every path keeps the pipeline live — it is never a fallback-only.
 *
 * Routing thesis (from the brief): a visitor arrives with an IDEA, a PROBLEM,
 * or is EXPLORING →
 *   • idea     → lead with the pipeline, show adjacent existing work as proof
 *   • problem  → match to existing apps/publications + pipeline
 *   • explore  → roam everything; pipeline always present
 */

import CONTENT, { ARTIFACTS, AUDIENCES, PROBLEM_AREAS, PIPELINE } from "./content.js";

/* The (max 3) questions. One thing per screen; plain language; every option labeled. */
export const QUESTIONS = [
  {
    id: "intent",
    prompt: "What brings you here today?",
    help: "Pick whatever's closest — you can change course anytime.",
    options: [
      { id: "idea",    label: "I have an idea I want to build",      hint: "A tool, app, or study you're imagining" },
      { id: "problem", label: "I have a problem to solve",           hint: "A gap in your research or clinical work" },
      { id: "explore", label: "I'm just exploring",                  hint: "Show me what AppHatchery makes" }
    ]
  },
  {
    id: "who",
    prompt: "Which sounds most like you?",
    help: "This tailors what we show you.",
    options: [
      { id: "researcher",   label: AUDIENCES.researcher.label },
      { id: "clinician",    label: AUDIENCES.clinician.label },
      { id: "caregiver",    label: AUDIENCES.caregiver.label },
      { id: "publicHealth", label: AUDIENCES.publicHealth.label }
    ]
  },
  {
    id: "area",
    prompt: "What's it about?",
    help: "Choose the closest area.",
    // options are generated dynamically from the artifacts each audience can actually use
    dynamic: true
  },
  {
    id: "need",
    prompt: "And what would help most?",
    help: "Last one — this points you to the right thing.",
    options: [
      { id: "app",       label: "A ready-to-use app",   hint: "Something you can pick up today" },
      { id: "reference", label: "A quick reference",    hint: "Look something up fast" },
      { id: "studyTool", label: "A tool for a study",   hint: "Collect data or run a protocol" },
      { id: "evidence",  label: "The research behind it", hint: "Papers and validation" },
      { id: "talk",      label: "To talk it through",   hint: "I have an idea or a question" }
    ]
  }
];

/* Problem-area options relevant to a chosen audience (data-driven, not hardcoded). */
export function getAreaOptions(answers = {}) {
  const aud = answers.who;
  const pool = ARTIFACTS.filter(a => a.type === "app" || a.type === "tool" || a.type === "publication");
  const counts = {};
  for (const art of pool) {
    if (aud && Array.isArray(art.audience) && !art.audience.includes(aud) && !(answers.intent === "idea")) continue;
    for (const pa of (art.problemAreas || [])) counts[pa] = (counts[pa] || 0) + 1;
  }
  const ids = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const opts = ids.slice(0, 5).map(id => ({ id, label: PROBLEM_AREAS[id] || id }));
  opts.push({ id: "unsure", label: "I'm not sure yet" });
  return opts;
}

export function getOptions(questionId, answers = {}) {
  if (questionId === "area") return getAreaOptions(answers);
  const q = QUESTIONS.find(x => x.id === questionId);
  return q ? q.options : [];
}

/* Score one artifact against (possibly partial) answers. Higher = more relevant. */
export function scoreArtifact(artifact, answers = {}) {
  if (artifact.type === "news") return -1; // news isn't a routing target
  let score = 0;
  const { who, area, intent } = answers;

  if (who && Array.isArray(artifact.audience)) {
    if (artifact.audience.includes(who)) score += 3;
    else score -= 1;
  }
  if (area && area !== "unsure" && Array.isArray(artifact.problemAreas)) {
    if (artifact.problemAreas.includes(area)) score += 4;
  }
  // Intent shaping
  if (intent === "idea") {
    // builders want services + the "how to build" playbook, then adjacent apps
    if (artifact.type === "service") score += 3;
    if (artifact.id === "pub-app-dev-bmc") score += 5;
  }
  if (intent === "problem" && (artifact.type === "app" || artifact.type === "tool")) score += 1;

  // Need — the granular 4th question
  const need = answers.need;
  if (need === "app" && (artifact.type === "app" || artifact.type === "tool")) score += 3;
  if (need === "reference" && (artifact.problemAreas || []).includes("clinicalSupport")) score += 3;
  if (need === "studyTool" && (artifact.problemAreas || []).some(p => p === "dataCollection" || p === "research")) score += 3;
  if (need === "evidence" && artifact.type === "publication") score += 5;
  if (need === "talk" && artifact.type === "service") score += 2;

  // Prefer things people can actually use today
  if (artifact.status === "live") score += 2;
  else if (artifact.status === "prototype") score += 1;
  else if (artifact.status === "research" || artifact.status === "unknown") score -= 1;

  // De-emphasize stubs / unverified
  if (typeof artifact.description === "string" && artifact.description.startsWith("[STUB]")) score -= 3;

  return score;
}

/**
 * Rank artifacts for a given answer set.
 * @returns {{intent, audiences, problemAreas, matches, pipeline, noMatch, leadWithPipeline}}
 */
export function rank(answers = {}, { limit = 5, threshold = 1 } = {}) {
  const scored = ARTIFACTS
    .map(a => ({ artifact: a, score: scoreArtifact(a, answers) }))
    .filter(x => x.score >= threshold)
    .sort((a, b) => b.score - a.score);

  const matches = scored.slice(0, limit);
  const intent = answers.intent || "explore";

  return {
    intent,
    who: answers.who || null,
    area: answers.area || null,
    matches,
    pipeline: PIPELINE,               // ALWAYS present
    noMatch: matches.length === 0,
    leadWithPipeline: intent === "idea" || answers.need === "talk" || matches.length === 0
  };
}

/**
 * Canvas helper: given (partial) answers, decide which artifact ids stay vs disperse.
 * Used by V2 to thin the board progressively. Pipeline never disperses.
 */
export function partition(answers = {}, { keep = 6 } = {}) {
  const anyAnswer = Object.keys(answers).length > 0;
  if (!anyAnswer) {
    return { keep: ARTIFACTS.map(a => a.id), disperse: [] }; // full abundant board at start
  }
  const ranked = ARTIFACTS
    .map(a => ({ id: a.id, score: scoreArtifact(a, answers) }))
    .sort((a, b) => b.score - a.score);
  const keptIds = ranked.filter(r => r.score >= 1).slice(0, keep).map(r => r.id);
  const keptSet = new Set(keptIds);
  return {
    keep: keptIds,
    disperse: ARTIFACTS.filter(a => !keptSet.has(a.id)).map(a => a.id)
  };
}

const ROUTER = { QUESTIONS, getOptions, getAreaOptions, scoreArtifact, rank, partition };
export default ROUTER;
if (typeof window !== "undefined") { window.AHRoute = ROUTER; }

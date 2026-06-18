/**
 * One-time setup: create the AppHatchery intake persona on Tavus.
 * The persona carries the verified portfolio in its system prompt and exposes the
 * routing brain + intake capture as TOOLS — so the live conversation can match real
 * artifacts and capture a structured record. Prints the TAVUS_PERSONA_ID to set in env.
 *
 * Run:  TAVUS_API_KEY=... npm run setup:persona
 */
import "./env.js";
import { ARTIFACTS, ORG } from "../shared/content.js";

const BASE = "https://tavusapi.com";
if (!process.env.TAVUS_API_KEY) { console.error("Set TAVUS_API_KEY first."); process.exit(1); }

const portfolio = ARTIFACTS
  .filter(a => ["app", "tool", "publication"].includes(a.type))
  .map(a => `- ${a.title} [${a.type}]: ${a.tagline || (a.description || "").slice(0, 90)}`)
  .join("\n");

const system_prompt =
`You are a warm, research-fluent intake coordinator for ${ORG.fullName} — ${ORG.blurb}
You help researchers and clinicians find the right existing AppHatchery tool, or start a new project with the team. You are NOT a gatekeeper; you never reject anyone.

You may ONLY reference items from this verified portfolio. NEVER invent a tool. If nothing fits, say so honestly and route them to the team:
${portfolio}

Style: brief, human, like a knowledgeable colleague. Never say "AI", "bot", or "automated". When the person describes a need, call match_portfolio. Before the conversation ends, call capture_intake_record. Always close by assuring them their details are with the team and they'll hear from a person.`;

const tools = [
  { type: "function", function: {
    name: "match_portfolio",
    description: "Find AppHatchery apps/tools/publications that match the researcher's described need. Call when they describe a clinical problem or app idea.",
    parameters: { type: "object", properties: {
      problem_description: { type: "string" },
      research_area: { type: "string" },
      audience: { type: "string", enum: ["researcher", "clinician", "patient", "public_health"] }
    }, required: ["problem_description"] } } },
  { type: "function", function: {
    name: "capture_intake_record",
    description: "Save the researcher's structured intake before the conversation ends.",
    parameters: { type: "object", properties: {
      researcher_name: { type: "string" }, affiliation: { type: "string" },
      research_area: { type: "string" }, problem_description: { type: "string" },
      project_stage: { type: "string", enum: ["idea", "funded", "in_progress", "unsure"] },
      funding_status: { type: "string", enum: ["funded", "applying", "none", "unsure"] },
      timeline: { type: "string" }, email: { type: "string" }
    }, required: ["research_area", "problem_description"] } } }
];

const payload = {
  persona_name: "AppHatchery Intake",
  system_prompt,
  pipeline_mode: "full",
  default_replica_id: process.env.TAVUS_REPLICA_ID || "r90bbd427f71",
  layers: { llm: { model: "tavus-claude-haiku-4.5", tools, speculative_inference: true } }
};

const res = await fetch(`${BASE}/v2/personas`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-api-key": process.env.TAVUS_API_KEY },
  body: JSON.stringify(payload)
});
const data = await res.json().catch(() => ({}));
if (res.ok && data.persona_id) console.log(`\n✅ Persona created.\n   Set this in your env:  TAVUS_PERSONA_ID=${data.persona_id}\n`);
else console.error(`\n❌ ${res.status}: ${JSON.stringify(data)}\n`);

/**
 * AI intake synthesis (OpenAI) + email delivery.
 * Flow: conversation ends → fetch transcript → GPT writes a structured intake report
 *       → saved locally (server/data) → emailed to the team.
 * Zero-dependency (global fetch). Email sends via Resend if RESEND_API_KEY is set,
 * otherwise the composed report is returned/saved so nothing is lost.
 */
const OPENAI = "https://api.openai.com/v1/chat/completions";
const TAVUS = "https://tavusapi.com";

/* Pull the transcript for a finished conversation (verbose returns the turn list). */
export async function fetchTranscript(conversationId) {
  if (!conversationId || !process.env.TAVUS_API_KEY) return [];
  try {
    const res = await fetch(`${TAVUS}/v2/conversations/${conversationId}?verbose=true`, { headers: { "x-api-key": process.env.TAVUS_API_KEY } });
    if (!res.ok) return [];
    const d = await res.json();
    return Array.isArray(d.transcript) ? d.transcript : [];
  } catch (_) { return []; }
}

/* GPT → a clean markdown intake report for the AppHatchery team. */
export async function synthesizeIntake({ transcript = [], discovery = {}, record = {} } = {}) {
  const lines = (transcript || []).map(t => `${t.role || "?"}: ${t.content || ""}`).join("\n");
  const system =
`You are an intake analyst for AppHatchery, an Emory University / Georgia CTSA digital-health incubator.
From a discovery context + conversation transcript, write a concise, professional INTAKE REPORT for the AppHatchery team. Markdown, with exactly these sections:

# AppHatchery — Intake Report
**Summary** — 2–3 sentences.
**Who** — role / affiliation if known.
**Need** — the capability gap, in their words.
**Relevant AppHatchery work** — only items actually discussed; never invent one.
**Stage & funding** — if known.
**Recommended next step** — one concrete action for the team.
**Fit** — one line: strong fit / worth exploring / likely new build.

Be factual. If the transcript is empty, say so and summarise from the discovery context only.`;
  const user = `DISCOVERY CONTEXT:\n${JSON.stringify(discovery, null, 2)}\n\nSTRUCTURED RECORD:\n${JSON.stringify(record, null, 2)}\n\nTRANSCRIPT:\n${lines || "(no spoken transcript captured)"}`;

  if (!process.env.OPENAI_API_KEY) return { ok: false, reason: "no OPENAI_API_KEY", doc: fallback(discovery, record, lines) };
  try {
    const res = await fetch(OPENAI, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", temperature: 0.3, messages: [{ role: "system", content: system }, { role: "user", content: user }] })
    });
    if (!res.ok) return { ok: false, reason: `OpenAI ${res.status}: ${(await res.text()).slice(0, 240)}`, doc: fallback(discovery, record, lines) };
    const data = await res.json();
    const doc = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    return { ok: !!doc, doc: doc || fallback(discovery, record, lines) };
  } catch (e) { return { ok: false, reason: String(e.message || e), doc: fallback(discovery, record, lines) }; }
}
function fallback(discovery, record, lines) {
  return `# AppHatchery — Intake Report (unsynthesised)\n\n**Discovery:** ${JSON.stringify(discovery)}\n\n**Record:** ${JSON.stringify(record)}\n\n**Transcript:**\n${lines || "(none captured)"}`;
}

/* Email the report. Resend if a key is present; otherwise report it wasn't sent (still saved by caller). */
export async function sendIntakeEmail({ to, subject, markdown }) {
  const from = process.env.INTAKE_EMAIL_FROM || "AppHatchery Intake <onboarding@resend.dev>";
  if (!process.env.RESEND_API_KEY) return { ok: false, via: "none", note: "No RESEND_API_KEY — report saved locally, not emailed." };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({ from, to: [to], subject, text: markdown })
    });
    const body = await res.json().catch(() => ({}));
    return { ok: res.ok, via: "resend", status: res.status, id: body.id || null, error: res.ok ? null : (body.message || body.name || JSON.stringify(body)) };
  } catch (e) { return { ok: false, via: "resend", error: String(e.message || e) }; }
}

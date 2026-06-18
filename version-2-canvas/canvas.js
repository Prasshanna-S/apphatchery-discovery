/* ============================================================================
   V2 — 2D Scattered Canvas · engine  (clean consolidated build)
   ----------------------------------------------------------------------------
   • Board = your real logo variants + a few app screenshots + the mascot,
     ring-spread around the centre, infinite drag, GSAP-owned transforms.
   • Ambient drift (starts after reveal; pauses on hover/drag) + gentle idle float.
   • All project stickers stay VISIBLE during the questions; hovering an option
     previews/highlights the relevant ones; the END emphasises matches.
   • Hover a logo → lift + slide-in tooltip (clears on leave); click → detail.
   • Light minimal console: big question · 1·2·3 stepper · a/b/c chips.
     Dragging partially minimises it (tap/hover to expand).
   • Result: apps as horizontal cards (logo + name) + papers list + big contact.
   ============================================================================ */

import CONTENT, { ARTIFACTS, PIPELINE, AUDIENCES, PROBLEM_AREAS } from "../shared/content.js";
import ROUTER, { QUESTIONS, getOptions, partition, rank } from "../shared/routing.js";
import INTAKE, { INTAKE_QUESTIONS } from "../shared/intake.js";

const gsap = window.gsap;
if (gsap) gsap.registerPlugin(...[window.Draggable, window.InertiaPlugin].filter(Boolean));
const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
let userReduced = false, reduced = mql.matches;
mql.addEventListener?.("change", e => { reduced = e.matches || userReduced; syncMotion(); });
const asset = p => p ? "../" + p.replace(/^\.?\//, "") : null;

const viewport = document.getElementById("viewport");
const world = document.getElementById("world");
const consoleEl = document.getElementById("console");
const pipeEl = document.getElementById("pipeline");
const liveEl = document.getElementById("live");
const simplified = document.getElementById("simplified");
const detailEl = document.getElementById("detail");
const ORG_SITE = CONTENT.ORG?.site || "https://apphatchery.org";

const REAL_LOGOS = ["fabla", "vocalis-care", "typeu", "ga-tb-guide", "cchd-pulseox"];
const BOARD_ASSETS = [
  { id: "fabla", src: "assets/stickers/fabla.png" },
  { id: "fabla", src: "assets/stickers/fabla-icon.png" },
  { id: "vocalis-care", src: "assets/stickers/vocalis.png" },
  { id: "typeu", src: "assets/stickers/typeu.png" },
  { id: "typeu", src: "assets/stickers/typeu-icon.png" },
  { id: "ga-tb-guide", src: "assets/stickers/tbguide.png" },
  { id: "cchd-pulseox", src: "assets/stickers/pulseox.png" },
  { id: "cchd-pulseox", src: "assets/stickers/pulseox-mark.png" },
  { id: "guide", src: "assets/mascots/guide.png", deco: true },
  { id: "fabla", src: "assets/screens/fabla.png", screen: true },
  { id: "eyra", src: "assets/screens/eyra.png", screen: true },
  { id: "sensory-sims", src: "assets/screens/sensory-sims.png", screen: true }
];
const TILE = { w: 1560, h: 1020 };
let layout = [], tiles = [];
let focused = false, dragging = false, hovering = false, wx = 0, wy = 0;
const state = { step: -1, answers: {} };

/* ----------------------------------------------------------------- LAYOUT */
function computeLayout() {
  // even angular spacing (→ no overlap) on a ring that clears + surrounds the centre card
  const n = BOARD_ASSETS.length, cx = TILE.w / 2, cy = TILE.h / 2;
  layout = BOARD_ASSETS.map((a, i) => {
    const ang = (i / n) * Math.PI * 2 + (rand(a.src) - 0.5) * 0.22;
    const rad = 0.74 + rand(a.src + "r") * 0.24;
    return { ...a, x: cx + Math.cos(ang) * rad * TILE.w * 0.44, y: cy + Math.sin(ang) * rad * TILE.h * 0.48, rot: (rand(a.src) - 0.5) * 8 };
  });
}
function buildTiles() {
  const tpl = document.createElement("div"); tpl.className = "tile";
  layout.forEach(it => tpl.appendChild(stickerEl(it)));
  for (let i = 0; i < 9; i++) { const t = tpl.cloneNode(true); tiles.push(t); world.appendChild(t); }
  positionTiles(0, 0);
  document.querySelectorAll(".sticker").forEach(el => {
    el._rot = +el.dataset.rot || 0; el._scale = 1;
    if (gsap) gsap.set(el, { xPercent: -50, yPercent: -50, rotation: el._rot });
  });
}
function stickerEl(it) {
  const el = document.createElement("div");
  el.className = "sticker" + (it.deco ? " sticker--deco" : "") + (it.screen ? " sticker--shot" : "");
  el.dataset.id = it.id; el.dataset.rot = it.rot;
  el.style.left = it.x + "px"; el.style.top = it.y + "px";
  el.innerHTML = `<img class="sticker__img" src="${asset(it.src)}" alt="" draggable="false" onerror="this.closest('.sticker').remove()">`;
  return el;
}
function positionTiles(px, py) {
  if (viewport) viewport.style.backgroundPosition = `${px}px ${py}px`;
  const vw = viewport.clientWidth, vh = viewport.clientHeight;
  const ci = Math.round((-px + vw / 2) / TILE.w), cj = Math.round((-py + vh / 2) / TILE.h);
  let k = 0;
  for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const t = tiles[k++]; if (t) t.style.transform = `translate(${(ci + di) * TILE.w}px, ${(cj + dj) * TILE.h}px)`; }
}

/* ----------------------------------------------------------------- DRAG + MOTION */
let drag;
function setupDrag() {
  centerWorld();
  if (!gsap || !window.Draggable) return;
  drag = window.Draggable.create(world, {
    type: "x,y", inertia: !!window.InertiaPlugin && !reduced, allowContextMenu: true, dragClickables: true, minimumMovement: 6,
    onDragStart() { dragging = true; minimizeConsole(true); },
    onDrag() { wx = this.x; wy = this.y; positionTiles(wx, wy); },
    onThrowUpdate() { wx = this.x; wy = this.y; positionTiles(wx, wy); },
    onDragEnd() { dragging = false; minimizeConsole(false); },
    onThrowComplete() { dragging = false; minimizeConsole(false); }
  })[0];
  window.addEventListener("resize", debounce(() => positionTiles(wx, wy), 120));
  if (gsap) gsap.delayedCall(1.5, () => gsap.ticker.add(ambient));
}
function ambient() {
  if (reduced || dragging || hovering) return;
  ambient.t = (ambient.t || 0) + 0.004;
  wx += 0.04 + Math.sin(ambient.t) * 0.045; wy += -0.025 + Math.cos(ambient.t * 0.8) * 0.04;
  gsap.set(world, { x: wx, y: wy }); if (drag) drag.update(); positionTiles(wx, wy);
}
function centerWorld() { wx = 0; wy = 0; gsap ? gsap.set(world, { x: 0, y: 0 }) : (world.style.transform = "translate(0,0)"); positionTiles(0, 0); }
function idleFloat() {
  if (reduced || !gsap) return;
  document.querySelectorAll(".sticker__img").forEach((img, i) => gsap.to(img, { y: (i % 2 ? -1 : 1) * (5 + (i % 4) * 2), rotation: (i % 2 ? 1 : -1) * 1.3, duration: 2.6 + (i % 5) * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: (i % 7) * 0.3 }));
}

/* ----------------------------------------------------------------- HOVER + CLICK */
const tip = document.createElement("div"); tip.className = "tip"; tip.hidden = true; document.body.appendChild(tip);
let downXY = null, moved = false;
world.addEventListener("pointerover", e => {
  const s = e.target.closest(".sticker"); if (!s || dragging) return;
  hovering = true;
  if (gsap) gsap.to(s, { scale: s._scale * 1.12, rotation: 0, duration: 0.34, ease: "power3.out", overwrite: "auto" });
  if (!s.classList.contains("sticker--deco")) { const a = ARTIFACTS.find(x => x.id === s.dataset.id); if (a) { tip.innerHTML = `<strong>${escapeHtml(a.title)}</strong><span>${escapeHtml(a.tagline || "")} · see more →</span>`; tip.hidden = false; placeTip(e); } }
});
world.addEventListener("pointermove", e => { if (downXY && Math.hypot(e.clientX - downXY[0], e.clientY - downXY[1]) > 6) moved = true; if (!tip.hidden) placeTip(e); });
world.addEventListener("pointerout", e => {
  const s = e.target.closest(".sticker"); if (!s) return;
  hovering = false; tip.hidden = true;
  if (gsap) gsap.to(s, { scale: s._scale, rotation: s._rot, duration: 0.4, ease: "power3.out", overwrite: "auto" });
});
function placeTip(e) { tip.style.left = (e.clientX + 16) + "px"; tip.style.top = (e.clientY + 18) + "px"; }
world.addEventListener("pointerdown", e => { downXY = [e.clientX, e.clientY]; moved = false; });
world.addEventListener("click", e => { const s = e.target.closest(".sticker"); if (!s || moved || s.classList.contains("sticker--deco")) return; const a = ARTIFACTS.find(x => x.id === s.dataset.id); if (a) openDetail(a); });

/* ----------------------------------------------------------------- DETAIL */
let lastFocusEl = null;
function logoFor(a) {
  if (a && REAL_LOGOS.includes(a.id) && a.asset?.sticker) return asset(a.asset.sticker);
  if (a && a.asset?.screen) return asset(a.asset.screen);
  return "../assets/stickers/fabla.png";
}
function ctaFor(a) { return a.type === "publication" ? "Read paper" : a.type === "service" ? "Learn more" : "Open"; }
function openDetail(art) {
  const su = art.secondaryUrls || {}, links = [];
  if (art.url) links.push({ label: ctaFor(art), href: art.url });
  if (su.iosAppStore) links.push({ label: "App Store", href: su.iosAppStore });
  if (su.googlePlay) links.push({ label: "Google Play", href: su.googlePlay });
  if (su.paper) links.push({ label: "Paper", href: su.paper });
  const audience = (art.audience || []).map(a => AUDIENCES[a]?.short || a).join(" · ");
  const shot = art.asset?.screen ? asset(art.asset.screen) : null;
  const panel = detailEl.querySelector(".detail__panel");
  panel.innerHTML = `
    <button class="detail__close" data-close aria-label="Close">✕</button>
    ${shot ? `<div class="detail__shot"><img src="${shot}" alt="" loading="lazy" onerror="this.closest('.detail__shot').remove()"></div>` : ""}
    <div class="detail__head">
      <div class="detail__logo"><img src="${logoFor(art)}" alt=""></div>
      <div><span class="mono-label">${art.type === "publication" ? "Paper" : art.type}${art.year ? " — " + art.year : ""}</span>
        <h2 id="detailTitle">${escapeHtml(art.title)}</h2>
        ${art.tagline ? `<p class="detail__tag">${escapeHtml(art.tagline)}</p>` : ""}</div>
    </div>
    <p class="detail__desc">${escapeHtml(art.description.replace(/^\[STUB\]\s*/, ""))}</p>
    ${audience ? `<p class="detail__for"><span class="mono-label">For</span> ${escapeHtml(audience)}</p>` : ""}
    <div class="detail__links">${links.map((l, i) => `<a class="lnk ${i === 0 ? "lnk--go" : ""}" href="${l.href}" target="_blank" rel="noopener">${escapeHtml(l.label)} →</a>`).join("")}</div>
    <a class="detail__pipe" href="${PIPELINE.primaryCta.url}" target="_blank" rel="noopener">Working on something like this? <strong>Talk to us →</strong></a>`;
  panel.querySelector("[data-close]").addEventListener("click", closeDetail);
  detailEl.querySelector(".detail__backdrop").onclick = closeDetail;
  lastFocusEl = document.activeElement; detailEl.hidden = false;
  if (gsap && !reduced) gsap.fromTo(panel, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out" });
  panel.querySelector(".detail__close").focus();
  announce(`${art.title}. ${art.tagline || ""}`);
}
function closeDetail() { detailEl.hidden = true; lastFocusEl?.focus?.(); }
document.addEventListener("keydown", e => { if (e.key === "Escape" && !detailEl.hidden) closeDetail(); });

/* ----------------------------------------------------------------- CONSOLE */
function stepper(active) { return `<ol class="stepper" aria-hidden="true">${QUESTIONS.map((_, i) => `<li class="${i === active ? "on" : ""} ${i < active ? "done" : ""}">${i + 1}</li>`).join("")}</ol>`; }
function minimizeConsole(on) { document.body.classList.toggle("q-explore", on); }

function renderIntro() {
  state.step = -1; state.answers = {};
  document.body.classList.remove("q-explore", "is-result");
  consoleEl.className = "console console--intro";
  consoleEl.innerHTML = `
    <span class="mono-label">Welcome to AppHatchery</span>
    <h1 class="qbig">Let's find what<br>you're <span class="kw">curious</span> about.</h1>
    <p class="qhelp">Drag to wander what we've built — or answer a few quick questions and we'll guide you to the right tool, study, or straight to the team.</p>
    <div class="chips">
      <button class="chip chip--go" id="beginBtn">Guide me <span aria-hidden="true">→</span></button>
      <button class="chip" id="browseBtn">Just browsing</button>
    </div>`;
  consoleEl.querySelector("#beginBtn").addEventListener("click", () => { enterFocused(); goToStep(0); });
  consoleEl.querySelector("#browseBtn").addEventListener("click", () => toggleSimplified(true));
  announce("AppHatchery discovery. Drag to explore, or let us guide you.");
}
function renderQuestion(i) {
  const q = QUESTIONS[i], opts = getOptions(q.id, state.answers), L = "abcdefgh";
  document.body.classList.remove("is-result");
  consoleEl.className = "console console--q";
  consoleEl.innerHTML = `
    ${stepper(i)}
    <div class="qmain">
      <span class="mono-label">${String(i + 1).padStart(2, "0")} / ${String(QUESTIONS.length).padStart(2, "0")}</span>
      <h2 class="qbig">${formatQ(q.prompt)}</h2>
      <div class="chips">${opts.map((o, j) => `<button class="chip" data-val="${o.id}"><span class="chip__k">${L[j]}</span>${escapeHtml(o.label)}</button>`).join("")}</div>
      ${i > 0 ? `<button class="ghostlink" id="backBtn">← back</button>` : ""}
    </div>`;
  consoleEl.querySelectorAll(".chip[data-val]").forEach(b => {
    b.addEventListener("click", () => choose(q.id, b.dataset.val));
    b.addEventListener("pointerenter", () => previewOption(q.id, b.dataset.val));
    b.addEventListener("pointerleave", clearPreview);
    b.addEventListener("focus", () => previewOption(q.id, b.dataset.val));
    b.addEventListener("blur", clearPreview);
  });
  consoleEl.querySelector("#backBtn")?.addEventListener("click", () => goToStep(i - 1));
  if (gsap && !reduced) gsap.from(consoleEl.querySelector(".qbig"), { y: 14, autoAlpha: 0, duration: 0.4, ease: "power3.out" });
  announce(`Step ${i + 1} of ${QUESTIONS.length}. ${q.prompt}`);
}
function formatQ(s) { const w = s.split(" "), last = w.pop(); return `${escapeHtml(w.join(" "))} <span class="kw">${escapeHtml(last)}</span>`; }
function choose(qid, val) { state.answers[qid] = val; applyReceding(); if (state.step < QUESTIONS.length - 1) goToStep(state.step + 1); else renderResult(); }
function goToStep(i) {
  if (i < 0) { exitFocused(); renderIntro(); applyReceding(); return; }
  QUESTIONS.forEach((q, j) => { if (j >= i) delete state.answers[q.id]; });
  state.step = i;
  if (i >= QUESTIONS.length) renderResult(); else renderQuestion(i);
  applyReceding();
}
function renderResult() {
  state.step = QUESTIONS.length;
  const r = rank(state.answers, { limit: 8 });
  document.body.classList.add("is-result");
  consoleEl.className = "console console--result";
  const apps = r.matches.filter(m => m.artifact.type === "app" || m.artifact.type === "tool").slice(0, 4);
  const papers = r.matches.filter(m => m.artifact.type === "publication").slice(0, 3);
  const appCards = apps.map(({ artifact: a }) => `
    <button class="appcard" data-id="${a.id}">
      <span class="appcard__img"><img src="${logoFor(a)}" alt="" onerror="this.style.opacity=0"></span>
      <span class="appcard__title">${escapeHtml(a.title)}</span>
      <span class="appcard__tag">${escapeHtml(a.tagline || "")}</span>
    </button>`).join("");
  const paperRows = papers.map(({ artifact: a }) => `
    <button class="paperrow" data-id="${a.id}"><span class="paperrow__t">${escapeHtml(a.title)}</span><span class="paperrow__v mono-label">${escapeHtml(String(a.year || "paper"))}</span></button>`).join("");
  consoleEl.innerHTML = `
    <span class="mono-label">${apps.length ? "Made for you" : "A new idea"}</span>
    <h2 class="qbig">${apps.length ? `Start <span class="kw">here</span>.` : `Let's <span class="kw">build it</span>.`}</h2>
    ${apps.length ? `<div class="appcards">${appCards}</div>` : `<p class="qhelp">What you're describing isn't in our toolkit yet — and that's exactly what AppHatchery loves to help build.</p>`}
    ${papers.length ? `<div class="papers"><span class="mono-label">Related research</span>${paperRows}</div>` : ""}
    <button class="contactbar" id="intakeBtn" type="button">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2z"/></svg>
      <span class="contactbar__txt"><strong>Have an idea of your own?</strong><span>Talk it through with the team.</span></span>
      <span class="contactbar__go">Start a project →</span>
    </button>
    <div class="resfoot"><button class="ghostlink" id="seeAllBtn">View everything</button><button class="ghostlink" id="restartBtn">↺ Start over</button></div>`;
  consoleEl.querySelectorAll(".appcard, .paperrow").forEach(c => {
    c.addEventListener("click", () => { const a = ARTIFACTS.find(x => x.id === c.dataset.id); if (a) openDetail(a); });
    c.addEventListener("pointerenter", () => isolate(c.dataset.id));
    c.addEventListener("pointerleave", () => isolate(null));
  });
  consoleEl.querySelector("#restartBtn").addEventListener("click", reset);
  consoleEl.querySelector("#seeAllBtn").addEventListener("click", () => toggleSimplified(true));
  consoleEl.querySelector("#intakeBtn")?.addEventListener("click", renderHandoff);
  applyReceding();
  if (gsap && !reduced) gsap.from(consoleEl.querySelectorAll(".appcard, .paperrow, .qbig, .contactbar"), { y: 12, autoAlpha: 0, duration: 0.4, stagger: 0.05, ease: "power3.out" });
  announce(apps.length ? `${apps.length} apps and ${papers.length} papers matched.` : "A new idea — let's build it together.");
}
function reset() { exitFocused(); renderIntro(); applyReceding(); }

/* ===================== UNIFIED PIPELINE — discovery → intake (Tavus + chip fallback) ===================== */
const TAVUS_TEAM_NAME = "the team";   // TODO: real AH member once decided (brief §10)
function discoveryBits() {
  const who = state.answers.who ? (AUDIENCES[state.answers.who]?.short || state.answers.who) : null;
  const area = state.answers.area ? (PROBLEM_AREAS[state.answers.area] || null) : null;
  return [who, area].filter(Boolean);
}
function renderHandoff() {
  consoleEl.className = "console console--intake";
  const bits = discoveryBits();
  const ctx = bits.length
    ? `Based on what you told us — <strong>${escapeHtml(bits.join(" · "))}</strong>. We won't ask again.`
    : `Tell us a little about your project and we'll route it to the right person.`;
  consoleEl.innerHTML = `
    <span class="mono-label">Start a project</span>
    <h2 class="qbig">Let's <span class="kw">talk it through</span>.</h2>
    <p class="qhelp">${ctx}</p>
    <div class="handoff">
      <button class="handoff__opt handoff__opt--video" id="hoVideo">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11z"/></svg>
        <span class="handoff__txt"><strong>Talk to ${escapeHtml(TAVUS_TEAM_NAME)} now</strong><span>A short live conversation, right here</span></span>
        <span class="handoff__go">→</span>
      </button>
      <button class="handoff__opt" id="hoChips">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 6h16v2H4zM4 11h16v2H4zM4 16h10v2H4z"/></svg>
        <span class="handoff__txt"><strong>Answer 3 quick questions</strong><span>Prefer to tap, not talk</span></span>
        <span class="handoff__go">→</span>
      </button>
      <a class="handoff__opt handoff__opt--mail" href="mailto:${INTAKE.ACK.directLine}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 4 8 5 8-5"/></svg>
        <span class="handoff__txt"><strong>Just email us</strong><span>${escapeHtml(INTAKE.ACK.directLine)}</span></span>
      </a>
    </div>
    <button class="ghostlink" id="hoBack">← back to results</button>`;
  consoleEl.querySelector("#hoVideo").addEventListener("click", startTavus);
  consoleEl.querySelector("#hoChips").addEventListener("click", () => { state.intake = {}; renderIntakeQuestion(0); });
  consoleEl.querySelector("#hoBack").addEventListener("click", renderResult);
}
async function startTavus() {
  const btn = consoleEl.querySelector("#hoVideo");
  if (btn) { btn.classList.add("is-loading"); btn.querySelector(".handoff__go").textContent = "…"; }
  const r = rank(state.answers, { limit: 6 });
  try {
    const res = await fetch("/api/start-conversation", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discovery: state.answers, matchedArtifacts: r.matches.map(m => m.artifact.id) })
    });
    if (!res.ok) throw new Error("conversation unavailable");
    const data = await res.json();
    if (!data.conversation_url) throw new Error("no conversation_url");
    openTavus(data.conversation_url, data.conversation_id);
  } catch (_) {
    // graceful fallback — live video not configured (no TAVUS_API_KEY) → chip survey
    state.intake = {}; renderIntakeQuestion(0);
    announce("Live video isn't available right now — a few quick questions instead.");
  }
}
function loadDaily() {
  return new Promise((resolve, reject) => {
    if (window.Daily) return resolve();
    const s = document.createElement("script");
    s.src = "https://unpkg.com/@daily-co/daily-js"; s.crossOrigin = "anonymous";
    s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
  });
}
async function openTavus(url, conversationId) {
  let m = document.getElementById("tavus");
  if (!m) { m = document.createElement("div"); m.id = "tavus"; m.className = "tavus"; document.body.appendChild(m); }
  m.innerHTML = `<div class="tavus__backdrop" data-close></div>
    <div class="tavus__panel"><button class="detail__close" data-close aria-label="End conversation">✕</button>
      <div id="tavusCall" class="tavus__frame"></div></div>`;
  m.hidden = false;
  let call = null;
  const cleanup = () => { try { call && call.destroy(); } catch (_) {} m.hidden = true; m.innerHTML = ""; };
  m.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", cleanup));
  try {
    await loadDaily();
    call = window.Daily.createFrame(document.getElementById("tavusCall"), { iframeStyle: { width: "100%", height: "100%", border: "0" }, showLeaveButton: true });
    call.on("app-message", e => handleTavusMessage(e, call, conversationId));
    call.on("left-meeting", cleanup);
    await call.join({ url });
  } catch (_) {
    const slot = document.getElementById("tavusCall");   // Daily unavailable → plain iframe (avatar + warm context still work)
    if (slot) slot.outerHTML = `<iframe class="tavus__frame" src="${url}" allow="camera; microphone; autoplay; fullscreen" title="Talk to the AppHatchery team"></iframe>`;
  }
}
/* The routing brain, answered live as Tavus tool calls — the discovery engine INSIDE the conversation. */
function handleTavusMessage(e, call, conversationId) {
  const msg = e && e.data; if (!msg || msg.event_type !== "conversation.tool_call") return;
  const name = msg.properties && msg.properties.name;
  let args = {}; try { args = JSON.parse((msg.properties && msg.properties.arguments) || "{}"); } catch (_) {}
  if (name === "match_portfolio") {
    const ans = { ...state.answers };
    const map = { researcher: "researcher", clinician: "clinician", patient: "caregiver", public_health: "publicHealth" };
    if (args.audience && map[args.audience]) ans.who = map[args.audience];
    const r = rank(ans, { limit: 3 });
    const text = r.matches.length
      ? "From our portfolio: " + r.matches.map(({ artifact: a }) => `${a.title} — ${a.tagline || ""}`).join("; ") + "."
      : "Nothing in the current toolkit is an exact match — this sounds like a new build worth the team's time.";
    sendTavus(call, conversationId, "respond", text);
  } else if (name === "capture_intake_record") {
    const r = rank(state.answers, { limit: 6 });
    const rec = INTAKE.buildLeadRecord({
      discovery: state.answers, matches: r.matches.map(m => m.artifact),
      intake: { stage: args.project_stage, funding: args.funding_status, timeline: args.timeline },
      contact: { name: args.researcher_name, email: args.email, note: args.problem_description, source: "tavus" }
    });
    INTAKE.submitLead(rec);
    sendTavus(call, conversationId, "echo", "Perfect — your details are with the team now. You'll hear from a person soon.");
  }
}
function sendTavus(call, conversationId, kind, text) {
  try {
    call.sendAppMessage({
      message_type: "conversation", event_type: `conversation.${kind}`, conversation_id: conversationId,
      properties: kind === "echo" ? { modality: "text", text, done: true } : { text }
    }, "*");
  } catch (_) {}
}
function renderIntakeQuestion(i) {
  const q = INTAKE_QUESTIONS[i], L = "abcdefgh";
  consoleEl.className = "console console--intake";
  consoleEl.innerHTML = `
    <div class="console__head"><span class="mono-label">Start a project · ${i + 1}/${INTAKE_QUESTIONS.length}</span>
      <button class="ghostlink" id="iBack">← back</button></div>
    <h2 class="qbig">${formatQ(q.prompt)}</h2>
    <div class="chips">${q.options.map((o, j) => `<button class="chip" data-val="${o.id}"><span class="chip__k">${L[j]}</span>${escapeHtml(o.label)}</button>`).join("")}</div>`;
  consoleEl.querySelectorAll(".chip[data-val]").forEach(b => b.addEventListener("click", () => {
    state.intake[q.id] = b.dataset.val;
    (i < INTAKE_QUESTIONS.length - 1) ? renderIntakeQuestion(i + 1) : renderIntakeDetails();
  }));
  consoleEl.querySelector("#iBack").addEventListener("click", () => i === 0 ? renderHandoff() : renderIntakeQuestion(i - 1));
  if (gsap && !reduced) gsap.from(consoleEl.querySelector(".qbig"), { y: 12, autoAlpha: 0, duration: 0.35, ease: "power3.out" });
}
function renderIntakeDetails() {
  consoleEl.className = "console console--intake";
  consoleEl.innerHTML = `
    <span class="mono-label">Almost there</span>
    <h2 class="qbig">Where do we <span class="kw">reach you</span>?</h2>
    <p class="qhelp">Optional — leave an email and we'll follow up. You'll get a confirmation either way.</p>
    <div class="intake-form">
      <input class="field" id="iName" type="text" placeholder="Name (optional)" autocomplete="name" />
      <input class="field" id="iEmail" type="email" placeholder="Email (optional)" autocomplete="email" />
      <textarea class="field" id="iNote" rows="2" placeholder="Anything you'd like the team to know? (optional)"></textarea>
    </div>
    <div class="intake-actions">
      <button class="chip chip--go" id="iSend">Send to the team →</button>
      <button class="ghostlink" id="iBack2">← back</button>
    </div>`;
  consoleEl.querySelector("#iSend").addEventListener("click", submitIntake);
  consoleEl.querySelector("#iBack2").addEventListener("click", () => renderIntakeQuestion(INTAKE_QUESTIONS.length - 1));
}
async function submitIntake() {
  const r = rank(state.answers, { limit: 6 });
  const contact = {
    name: consoleEl.querySelector("#iName")?.value.trim() || null,
    email: consoleEl.querySelector("#iEmail")?.value.trim() || null,
    note: consoleEl.querySelector("#iNote")?.value.trim() || null,
    source: "discovery-canvas"
  };
  const record = INTAKE.buildLeadRecord({ discovery: state.answers, matches: r.matches.map(m => m.artifact), intake: state.intake, contact });
  const btn = consoleEl.querySelector("#iSend"); if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
  const res = await INTAKE.submitLead(record);
  renderConfirmation(res, r);
}
function renderConfirmation(res, r) {
  consoleEl.className = "console console--confirm";
  const recs = (r?.matches || []).slice(0, 3).map(({ artifact: a }) =>
    `<a class="confirm-link" href="${a.url || a.secondaryUrls?.iosAppStore || a.secondaryUrls?.paper || ORG_SITE}" target="_blank" rel="noopener">${escapeHtml(a.title)} →</a>`).join("");
  consoleEl.innerHTML = `
    <div class="confirm-tick" aria-hidden="true">✓</div>
    <span class="mono-label">Received</span>
    <h2 class="qbig">${escapeHtml(INTAKE.ACK.title)}</h2>
    <p class="qhelp">${escapeHtml(INTAKE.ACK.body)}</p>
    ${recs ? `<div class="confirm-recs"><span class="mono-label">While you wait — relevant to you</span><div class="confirm-recs__links">${recs}</div></div>` : ""}
    <div class="resfoot">
      ${res && res.mailto ? `<a class="ghostlink" href="${res.mailto}">Send a copy by email</a>` : ""}
      <button class="ghostlink" id="cRestart">↺ Start over</button>
    </div>`;
  consoleEl.querySelector("#cRestart").addEventListener("click", reset);
  if (gsap && !reduced) gsap.from(consoleEl.querySelectorAll(".confirm-tick, .qbig, .qhelp, .confirm-recs, .resfoot"), { y: 12, autoAlpha: 0, duration: 0.4, stagger: 0.06, ease: "power3.out" });
  announce(INTAKE.ACK.title + " " + INTAKE.ACK.body);
}

/* ----------------------------------------------------------------- STATES (GSAP) */
function tweenSticker(el, props) { if (gsap) gsap.to(el, { duration: 0.5, ease: "power3.out", overwrite: "auto", ...props }); }
function applyReceding() {
  const result = state.step >= QUESTIONS.length;
  const keep = new Set(partition(state.answers, { keep: 6 }).keep);
  document.querySelectorAll(".sticker").forEach(el => {
    if (el.classList.contains("sticker--deco")) { el._scale = 1; tweenSticker(el, { autoAlpha: 1, scale: 1, rotation: el._rot }); el.style.pointerEvents = "auto"; return; }
    const match = keep.has(el.dataset.id);
    if (result) { el._scale = match ? 1.2 : 1; tweenSticker(el, { autoAlpha: match ? 1 : 0.3, scale: match ? el._scale : 0.9, rotation: el._rot }); }
    else { el._scale = 1; tweenSticker(el, { autoAlpha: 1, scale: 1, rotation: el._rot }); }
    el.style.pointerEvents = "auto";
  });
}
function isolate(id) { document.querySelectorAll(".sticker").forEach(el => { if (el.classList.contains("sticker--deco")) return; const dim = id != null && el.dataset.id !== id; tweenSticker(el, { autoAlpha: dim ? 0.1 : 1, scale: (id && el.dataset.id === id) ? el._scale * 1.08 : el._scale, duration: 0.3 }); }); }
function previewOption(qid, val) { const keep = new Set(partition({ ...state.answers, [qid]: val }, { keep: 6 }).keep); document.querySelectorAll(".sticker").forEach(el => { if (el.classList.contains("sticker--deco")) return; const on = keep.has(el.dataset.id); tweenSticker(el, { autoAlpha: on ? 1 : 0.16, scale: on ? el._scale * 1.1 : el._scale * 0.95, duration: 0.3 }); }); }
function clearPreview() { applyReceding(); }
function enterFocused() { focused = true; document.body.classList.add("is-focused"); if (gsap) gsap.to(world, { x: 0, y: 0, duration: reduced ? 0 : 0.6, ease: "power3.inOut", onUpdate() { wx = +gsap.getProperty(world, "x"); wy = +gsap.getProperty(world, "y"); positionTiles(wx, wy); } }); }
function exitFocused() { focused = false; document.body.classList.remove("is-focused", "q-explore", "is-result"); }

/* ----------------------------------------------------------------- PIPELINE / LIST / DOCK */
function renderPipeline() {
  pipeEl.innerHTML = `
    <div class="pipe-card">
      <svg class="pipe-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2z"/></svg>
      <div class="pipe-body"><span class="pipe-sub mono-label">Have an idea?</span><strong>Start a project</strong></div>
      <div class="pipe-actions">
        <a class="pipe-go" href="${PIPELINE.primaryCta.url}" target="_blank" rel="noopener">Contact us →</a>
        <a class="pipe-mail" href="mailto:${PIPELINE.email}">${escapeHtml(PIPELINE.email)}</a>
      </div>
    </div>`;
  if (gsap && !reduced) gsap.from(pipeEl, { y: 90, autoAlpha: 0, duration: 0.9, ease: "back.out(1.6)", delay: 0.7 });
}
function buildSimplified() {
  const groups = { app: "Apps & tools", publication: "Research", service: "Services" }, by = {};
  ARTIFACTS.forEach(a => { if (a.type === "news") return; const k = a.type === "tool" ? "app" : a.type; (by[k] = by[k] || []).push(a); });
  simplified.innerHTML = `<div class="simplified__inner">
    <button class="detail__close" id="closeList" aria-label="Close">✕</button>
    <span class="mono-label">Everything we make</span><h1 class="qbig">The toolkit</h1>
    ${["app", "publication", "service"].map(k => by[k] ? `<section class="sgroup"><h2 class="mono-label">${groups[k]}</h2><ul class="slist">${by[k].map(a => { const href = a.url || a.secondaryUrls?.iosAppStore || a.secondaryUrls?.paper || ORG_SITE; return `<li><a href="${href}" target="_blank" rel="noopener"><span class="stitle">${escapeHtml(a.title)}</span><span class="stag">${escapeHtml(a.tagline || "")}</span></a></li>`; }).join("")}</ul></section>` : "").join("")}
    <a class="chip chip--go" href="${PIPELINE.primaryCta.url}" target="_blank" rel="noopener" style="margin-top:24px">${escapeHtml(PIPELINE.title)} →</a></div>`;
  simplified.querySelector("#closeList").addEventListener("click", () => toggleSimplified(false));
}
function toggleSimplified(force) {
  const show = force ?? simplified.hasAttribute("hidden");
  document.getElementById("btnList").setAttribute("aria-pressed", String(show));
  simplified.hidden = !show;
  if (show) { lastFocusEl = document.activeElement; simplified.querySelector("h1")?.setAttribute("tabindex", "-1"); simplified.querySelector("h1")?.focus(); } else lastFocusEl?.focus?.();
}
function syncMotion() { document.documentElement.classList.toggle("reduce-motion", reduced); document.getElementById("btnMotion").setAttribute("aria-pressed", String(userReduced)); }
function wireDock() {
  document.getElementById("backLink")?.addEventListener("click", e => { if (document.referrer && document.referrer !== location.href) { e.preventDefault(); history.back(); } });
  document.getElementById("btnReset").addEventListener("click", reset);
  document.getElementById("btnList").addEventListener("click", () => toggleSimplified());
  document.getElementById("btnMotion").addEventListener("click", () => { userReduced = !userReduced; reduced = userReduced || mql.matches; syncMotion(); });
  consoleEl.addEventListener("pointerenter", () => minimizeConsole(false));
  consoleEl.addEventListener("click", () => { if (document.body.classList.contains("q-explore")) minimizeConsole(false); });
  document.addEventListener("keydown", e => {
    if (!simplified.hidden || !detailEl.hidden) return;
    const opts = [...consoleEl.querySelectorAll(".chip[data-val]")], k = e.key.toLowerCase();
    const idx = "abcdefgh".indexOf(k) >= 0 ? "abcdefgh".indexOf(k) : (/[1-8]/.test(k) ? +k - 1 : -1);
    if (idx >= 0 && opts[idx]) { e.preventDefault(); opts[idx].click(); }
  });
}
function reveal() {
  if (reduced || !gsap) { idleFloat(); return; }
  // NOTE: never tween the console's transform/opacity — it relies on CSS translate(-50%,-50%)
  // for centring, and a GSAP transform would break that + leave it translucent.
  gsap.from(".sticker", { autoAlpha: 0, scale: 0.92, duration: 0.5, stagger: { amount: 0.4, from: "random" }, ease: "power2.out" });
  gsap.from([".dock", ".topbar"], { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.08, delay: 0.22 });
  gsap.delayedCall(1.2, idleFloat);
}
function announce(m) { if (liveEl) { liveEl.textContent = ""; setTimeout(() => liveEl.textContent = m, 50); } }
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
function rand(seed) { let h = 2166136261; for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 10000) / 10000; }
function init() {
  if (!world) return;
  computeLayout(); buildTiles(); setupDrag();
  renderPipeline(); buildSimplified(); wireDock(); syncMotion();
  renderIntro(); reveal();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

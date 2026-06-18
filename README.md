# AppHatchery Discovery Experience

An interactive way for researchers, clinicians, and innovators to find the right
AppHatchery tool, study, or path to the team — instead of bouncing off a static site.

## Status

- **Shared foundation** (`shared/`)
  - `content.js` — verified content inventory (apps, publications, services, people, the always-on contact pipeline), with honest verification flags.
  - `routing.js` — the matching brain: a 4-question guided flow → ranked matches + pipeline.
  - `tokens.css` — design tokens (brand-aligned, accessibility-tuned).
- **Version 2 — 2D scattered canvas** (`version-2-canvas/`) — **built.**
  An infinite, drag-anywhere board of AppHatchery's real app logos + screenshots. A light,
  minimal guided console (stepper · big question · lettered options) whose answers highlight
  the relevant projects; the result surfaces matched apps as cards + related research, with a
  persistent contact card. Vanilla JS + GSAP 3.13 (CDN).
- **Versions 1 (simple accessible guide), 3 (WebGL), 4 (embeddable widget)** — planned.

## Run

Static files; ES-module imports need http (not `file://`):

```bash
python3 -m http.server 8000
# then open http://localhost:8000/version-2-canvas/
```

## Assets

`assets/` holds app logos, screenshots, and the slot system documented in `assets/README.md`.
Drop a project's screenshot at `assets/screens/<id>.png` to enrich its card + detail view.

---
Built with Claude Code.

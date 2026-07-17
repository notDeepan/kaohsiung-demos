# REDESIGN REPORT — Kaohsiung Demo Kit

Date: 2026-07-15 · Scope: `cafe/` rebuilt to the approved hospitality brief; `mfg/` built new to the approved manufacturer brief. Approved briefs: [DIRECTION-hospitality.md](DIRECTION-hospitality.md) · [DIRECTION-manufacturer.md](DIRECTION-manufacturer.md). Before-state preserved at git tag `pre-redesign`.

## Results vs budget (Lighthouse mobile, simulated throttling, live GitHub Pages URLs — same method as AUDIT.md)

| Metric | cafe before | cafe after | budget | mfg (new) | budget |
|---|---|---|---|---|---|
| Performance score | 55 | **91** | ≥ 90 | **89** (with live 3D) | ≥ 85 |
| FCP | 16.8 s | **1.25 s** | — | 1.38 s | — |
| LCP | 18.6 s | **2.99 s** (lab) / ~2.2 s real-clock devtools | < 2.5 s aim | **1.85 s** | < 2.5 s |
| CLS | 0.001 | 0.013 | < 0.1 | 0.039 | < 0.1 |
| TBT | 0 ms | 114 ms | (INP proxy) | 112–331 ms across runs (three.js init) | — |

Raw reports in `docs/audit/lighthouse-*-{before,after}.json`. Note: mfg TBT varies run-to-run with the deferred three.js compile; it initializes after `window.load` + idle and never blocks first paint.

## What shipped

**cafe/ — "develop" world.** LXGW WenKai TC-led display type with Instrument Serif italic, General Sans + Noto Sans TC (variable) workhorses — all self-hosted subset woff2. Morning-paper → last-light palette with 鐵窗花 green accent; film-grain + vignette atmosphere everywhere. One motion signature: photographs develop like darkroom prints (GSAP + ScrollTrigger + Lenis); masked type rises; nothing else moves. Real-progress loader (fonts + hero decode, 1 s cap, sessionStorage skip). Editorial menu set like print with live open/closed status and today-row highlight. Graded map, LINE CTA primary, mobile sticky LINE bar. Full reduced-motion + no-JS static variants.

**mfg/ — "measure" world (new).** Cheng Chang Precision 鉦昌精密, CNC components. Archivo variable (expanded widths) + IBM Plex Mono data layer + Noto Sans TC. Gunmetal with 1px engineering grid, sheen, vignette; safety-orange = interaction, blueprint-cyan = data. Signature: dimension lines draw and tick-stamp, content rises behind them; ±0.500→±0.005 decimal counter. **Option A 3D hero:** procedural lathe-turned part (zero asset download, ~210 KB deferred three.js chunk), PMREM studio rig, ACESFilmic, DPR ≤ 2, offscreen/hidden pause, layered over a hand-drawn SVG blueprint that doubles as poster, reduced-motion state and WebGL fallback. Mono boot-line loader with real progress ticks. Conversion set: 48 h RFQ with drawing drop-zone + demo received-state, mono capability table, cert plates, export markets, sticky mobile RFQ bar.

**Shared:** bilingual EN/繁中 toggle (persisted, `lang`-switched), CJK rules enforced (1.75–1.85 leading, no CJK tracking, no faux italics, dims stay Latin mono). All fonts/JS self-hosted from `assets/`; font bytes start strictly post-FCP (media-defer flip at `window.load`; loaders wait on the post-flip `fonts.ready`). Launcher and README updated; `bnb/`, `shop/` untouched (next phase).

## Cliché re-scan (Phase 1 list)

`backdrop-filter` / glassmorphism: **0 hits** both sites. Cream+serif+terracotta: gone (green-accent paper world / gunmetal world). Gradient-as-hero: none — cafe hero is a photograph with scrim; remaining gradients are atmosphere (radial lamp glow, engineering-grid field) per the briefs. Stock fonts with no intent: replaced by committed, self-hosted pairings. Identical 3-card grids: replaced by asymmetric editorial/spec-sheet grids. Default easing: none — every tween uses power2/3/4 or the site cubic-bezier; one motion signature per site. Emoji icons: none. Lorem: none.

## Review & audit notes (honest scope)

- The `/code-review` plugin reviews a pending diff; this work is already merged to `main` (tagged `pre-redesign` → `HEAD`). Substituted with a documented manual review pass plus the automated suite — bugs found and fixed during it: double-reveal in the annotate loop, `aspect-ratio`+`max-height` intrinsic-width grid inflation, column-flex shrink-to-fit overflow via `margin-inline:auto` (688 px mobile overflow), scroll-cue transform conflict, loader race conditions, one bad hex token.
- Web-design-guidelines checklist applied directly: visible `:focus-visible` rings both sites, ≥44 px touch targets on nav controls, contrast fixes (`--steel-2` → 5:1), semantic landmarks, keyboard-reachable menus, `aria-expanded`/`aria-hidden` on toggles, reduced-motion variants, explicit image dimensions. Alt text is English-only (single-attribute limitation) — captions are bilingual.
- `scripts/verify.mjs` (headless Chrome): 24/24 assertions green — console-error-free on every page/viewport, toggles, RFQ flow, 3D live, no overflow at 390 px.

## Copy flagged `[NEEDS NATIVE REVIEW]`

All 繁中 marketing copy on both sites (hero lines, menu notes, RFQ promises). It is written to sound human and Taiwanese, but has not had native review — swap freely when a native speaker passes through.

## Show a prospect first (demo-meeting shortlist)

1. **mfg hero on a laptop** — loader boot-line → ±0.005 machining in → the 3D part turning over its own blueprint. This is the "not a template shop" moment.
2. **cafe on their phone** — hero photo developing, then tap 中文: the whole site flips language. Then scroll to the menu board.
3. **mfg RFQ** — drag any PDF onto the drop zone, submit, show the 48 h received state: "your buyers do this from Chicago."
4. **Reload either site** on their wifi — it's fast on a mid-range phone, and you have the Lighthouse numbers in this folder to prove it.

Screenshots: `docs/audit/after-*.png` (desktop, mobile, menu board, RFQ state, reduced-motion).

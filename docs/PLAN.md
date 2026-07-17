# Implementation Plan — Phase 3 build (both briefs approved 2026-07-15)

Decisions carried in: 3D = **Option A** (procedural part, ~210 KB deferred). `serve.js`/`start-demos.bat` restored.

## Architecture

- Keep zero-build static model: one HTML file per site + a new shared `assets/` tree (self-hosted vendor JS + subset fonts). No framework migration (nothing to migrate; mission rule satisfied).
- `assets/vendor/`: gsap.min.js 3.12.5, ScrollTrigger.min.js 3.12.5, lenis.min.js 1.1.x (UMD), three.module.min.js 0.170.0 (dynamic-imported by mfg only).
- `assets/fonts/<family>/`: woff2 + rewritten CSS, produced by `scripts/vendor-fonts.mjs` (fetches Google css2 / Fontshare CSS with a woff2 UA, downloads files, rewrites URLs relative). Families: LXGW WenKai TC, Noto Sans TC (400/500/700/900), Instrument Serif (400 + italic), General Sans (400/500/600), Archivo variable (wdth+wght), IBM Plex Mono (400/500). Fallback chain if WenKai TC unavailable on css2: jsdelivr npm package → Noto Serif TC 600/900 (deviation to be reported).
- Progressive enhancement: `documentElement.classList.add('js')` inline; all hidden-initial states applied only via GSAP inside `matchMedia('(prefers-reduced-motion: no-preference)')` — no-JS and reduced-motion users get full static content.
- Lenis: `new Lenis({ autoRaf:false, anchors:true })` + `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t*1000))` + `lagSmoothing(0)`.
- Bilingual: keep `.en`/`.zh` span system + localStorage + `lang` attr (audit: salvageable). Display lines show both languages permanently (TC leads); body/UI copy toggles.

## Page builds

**cafe/ v3** ("develop" world): loader (real progress = fonts.ready + hero decode, 2.2 s cap, sessionStorage skip on revisit) → hero photo full-bleed w/ grade+grain+vignette, 「光線好,咖啡慢。」 → editorial intro + facts line → asymmetric photo essay → dark menu board (short menu, dot leaders, signature dots, live today/open state) → pull-quote review + evening photos → visit (hours/transit/graded map iframe) → last-light footer → mobile LINE bar. Motion: image "develop" tweens + masked heading rises + one subtle hero parallax; nothing else.

**mfg/ new** ("measure" world): loader (mono bootline + real tick progress) → hero ±0.005 counter + drawn dimension lines + 3D turned part (lazy three.js, PMREM fromScene studio rig, ACESFilmic, DPR≤2, offscreen pause, SVG blueprint as poster/fallback/reduced-motion) → capabilities mono table (drawn rows) → 4-step process on one dimension line → cert plates → export markets (23 + region code columns + duotone port photo) → RFQ form w/ file-drop pattern + 48 h promise → footer → mobile RFQ bar.

**Launcher**: content-only addition of the mfg card (no restyle — out of scope).

## Verification & acceptance

- `scripts/verify.mjs` (puppeteer-core, channel: chrome): desktop 1440×900 + 390×844 screenshots to `docs/audit/`, console/pageerror capture (must be zero), lang-toggle assertion, mfg counter + RFQ success-state assertion, reduced-motion emulation shot.
- Lighthouse (mobile, throttled) local then live after push. Budgets: cafe LCP <1.8 s / ≥90; mfg ≥85 (with 3D); CLS <0.1; JS gz cafe <90 KB, mfg <260 KB incl. three chunk; fonts <200 KB per page loaded.
- Phase 5: /code-review on diff, web-design-guidelines audit, cliché re-scan (target zero hits), REDESIGN_REPORT.md with before/after.

# Creative Brief — Export Manufacturer Demo (new site at `mfg/`)

Fictional client: **鉦昌精密工業股份有限公司 · CHENG CHANG PRECISION IND. CO., LTD.** — CNC-machined components, Qianzhen, est. 1987. ISO 9001:2015 + IATF 16949, ±0.005 mm, 23 export countries, 40 CNC machining centers, 48-hour RFQ response. Status: **awaiting owner approval — no code until approved.**

## 1. Concept / thesis

**A spec sheet you can walk through — the factory measures itself onto your screen.** The hero states it with one oversized figure: ±0.005 mm.

## 2. Mood

Machined · deliberate · international.

## 3. Reference triangulation

Lusion (immaculate restraint, tactile material realism) × Locomotive (confident industrial editorial grids) × the typographic authority of a Mitutoyo/HAAS catalog. Aim: **an engineering document elevated to cinema.** Nothing playful anywhere.

## 4. Palette (atmosphere mandatory)

| Role | Hex | Usage |
|---|---|---|
| Dominant | `#171B1F` gunmetal | 60–70%; never flat — see atmosphere |
| Panels | `#1F252B` | cards, tables |
| Hairlines | `#313A42` | rules, grid, dimension lines at rest |
| Type | `#E9EDF0` machined silver | headings/body on dark |
| Accent 1 (≤7%) | `#FF4E1E` safety orange | CTAs, RFQ, live markers — interaction semantics only |
| Accent 2 | `#7FA6B8` blueprint cyan | dimension lines, part numbers, data labels — data semantics only, never decoration |

Atmosphere: 1px engineering grid at ~3% opacity across every background, radial machined sheen on panels, deep vignette. Anti-cliché defense (vs "near-black + one neon accent, centered"): two accents with strict *semantic* jobs, asymmetric spec-sheet grid, a monospace data layer, and drawn dimension lines — the darkness is a drawing office, not a neon void.

## 5. Type (self-hosted woff2, subset)

- **Display: Archivo variable** — width axis to Expanded, weights 600–900. Industrial grotesque with numerals built for oversized dims; display tracking −1.5%.
- **Data voice: IBM Plex Mono** 400/500 — part numbers, tolerances, tables, axis labels, the boot line. (Third voice reserved for mono per art-direction rules.)
- **CJK: Noto Sans TC** — body 400/500, display lines 900 at 0.95× Archivo cap height; body line-height 1.75 (TC) / 1.55 (EN); zero CJK letter-spacing; no faux italics. Dimensions and units stay Latin mono even inside TC sentences (±0.005 mm never translates).
- Preload Archivo variable only; Noto Sans TC via unicode-range subsets; total font budget < 200 KB.

## 6. Motion signature — "the measure"

Hairline dimension lines **draw** (scaleX, `power3.inOut`, 0.7 s), tick marks stamp their ends, then content clips in from behind the drawn rule — every section annotates itself like a CAD drawing. On scroll, dimension lines extend alongside sections (ScrollTrigger scrub on lines only; content never scrubs). Key numerals count to value with decimal precision (±0.500 → ±0.005). No other motion exists. `prefers-reduced-motion`: lines pre-drawn, content static.

## 7. Load sequence (first 2 s)

- 0–300 ms — gunmetal + engineering grid painted (pure CSS, instant first paint).
- 300–800 ms — mono boot line types on: `CHENG CHANG PRECISION — QIANZHEN, KAOHSIUNG — EST. 1987`, progress ticks driven by **real** asset preload.
- 800–1300 ms — hero numeral machines in: ±0.500 → ±0.005 with decimal-place easing.
- 1300–2000 ms — dimension lines draw the hero layout; nav settles. If the 3D part is approved, it fades in **whenever ready** — it never blocks paint (LCP is the headline).

## 8. Sound

**None — stated choice.** B2B buyers open this at office desks; autoplay audio costs credibility. (A single soft tick on RFQ submit was considered and rejected.)

## 3D hero — proposal with costs (decision required, not assumed)

| Option | What | Added weight (deferred, post-LCP) | Est. Lighthouse mobile |
|---|---|---|---|
| **A (recommended)** | Procedural machined part (turned/bored aluminum flange via LatheGeometry + machining details), small prefiltered studio envmap, ACESFilmic, scroll-scrubbed ±25° with 0.08 lerp, DPR ≤ 2, pauses offscreen | ~210 KB (three.js chunk ~170 KB gz + 40 KB env; model is code, 0 KB) | 88–92 |
| B | Real GLB part modeled in Blender, Draco + KTX2 | 1.2–1.8 MB + decoder ~220 KB | 85–88 |
| C | No 3D — macro photography with "measure" annotations | 0 | 93+ |

All options ship a static AVIF poster fallback (~60 KB) for reduced-motion / WebGL-failure / low-tier devices. LCP is unaffected in every option because first paint never waits for 3D.

## Copy direction (real, bilingual)

- Hero: EN **"±0.005 mm. Every part. Since 1987."** · 中 「±0.005 mm。每一件,自 1987。」 `[NEEDS NATIVE REVIEW]`
- Hero support: EN "CNC-machined components from Kaohsiung, shipped to 23 countries. Send a drawing — get a quote in 48 hours." · 中 「高雄 CNC 精密加工,出口 23 國。傳圖面,48 小時內回覆報價。」 `[NEEDS NATIVE REVIEW]`
- Capabilities opener: EN "Tolerance is a promise." · 中 「公差,是承諾。」 `[NEEDS NATIVE REVIEW]`

## Imagery list (one grade: gunmetal/cyan duotone)

Machined-surface macros (turning chatter, anodized fins) · CMM probe touching a part · caliper on bright-turned steel · shop floor, shallow depth of field · Kaohsiung port gantry cranes at dusk (the export story) · pallet/crating detail. Placeholders: curated Unsplash frames unified by one CSS duotone recipe; swapped for real factory photography per prospect.

## Conversion set (why an SME buys — prominent, beautiful)

RFQ form with drawing-upload pattern + 48 h promise (safety-orange primary) · capabilities/equipment table set in mono · certification plates (ISO 9001, IATF 16949) as typographic plates, not clip-art badges · export-markets map with measured reveal · factory/equipment section · downloadable one-page line-card (PDF pattern).

## Performance acceptance (Phase 4)

LCP < 1.8 s (type is LCP) · CLS < 0.1 · INP < 200 ms · initial JS < 90 KB gz, three.js chunk lazy-loaded only if Option A/B approved (total ≤ 260 KB gz) · fonts < 200 KB · first-load weight < 1.1 MB · Lighthouse mobile ≥ 85 with 3D, ≥ 90 without.

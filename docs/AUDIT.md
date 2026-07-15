# AUDIT — Kaohsiung Demo Kit (pre-redesign)

Date: 2026-07-15 · Auditor: Claude (Phase 1 of redesign mission) · State tagged `pre-redesign` in git.

## Scope

| Site in mission | Maps to | Status |
|---|---|---|
| 1. Export-manufacturer demo | — does not exist yet | Greenfield: nothing to audit; will be built new at `mfg/` |
| 2. Café / hospitality demo | `cafe/` (Harborside Coffee, v2) | Full audit below |
| (out of scope this phase) | `bnb/`, `shop/`, `index.html` launcher | Appendix scores only |

## Stack map

- Framework: none — self-contained single-file HTML per site (inline CSS/JS), no build step. Deployed on GitHub Pages from `main` root.
- Motion: no library. CSS transitions with default `ease`, one `IntersectionObserver` reveal pattern, one CSS marquee. No motion identity.
- Bilingual system: paired `.en`/`.zh` spans toggled by a `body.zh-mode` class, persisted in `localStorage`, `lang` attribute switched. Concept is sound; keep.
- Fonts: 4 families hotlinked from Google Fonts (`cafe/index.html:11`): Fraunces, Karla, Noto Serif TC, Noto Sans TC. Render-blocking, unsubsetted, not self-hosted.
- Images: Unsplash hotlinks (`?q=80&w=900–1900`), JPEG, no `srcset`, no explicit `width/height` attributes (CLS mitigated by `aspect-ratio` containers), `onerror` remove + gradient fallback.
- Third party: Google Maps iframe (lazy ✓), Google Fonts (blocking ✗).

## Cliché scorecard — `cafe/` (the current hospitality demo)

| # | Cliché | Verdict | Evidence |
|---|---|---|---|
| 1 | Purple/teal gradient hero + glassmorphism | **HIT (variant)** | Gradient hero underlay `cafe/index.html:115`; glassmorphism ×8: nav pill `:83`, hero badges `:122`, status pill `:130`, figcaption chips `:162`, `:236`, sig-card chip `:179`, mobile bar `:312` |
| 2 | Cream bg + generic serif + single terracotta accent | **EXACT HIT** | `--paper:#fcf8f1` `:18`, `--rust:#bf5b32` `:20`, Fraunces serif display `:11`, `:26`. This is the calibration cliché verbatim. |
| 3 | Near-black + one neon accent, centered | miss (cafe) | — |
| 4 | Inter/Arial/system with no intent | partial | Fraunces+Karla is a stock Google pairing chosen for safety, not subject; 4 families with no subsetting = no typographic intent at delivery level either |
| 5 | Emoji as icons / identical 3-card grids / centered-everything | **partial HIT** | No emoji (inline SVG ✓). But three identical 3-across card grids (signatures, reviews, bento stats) and centered CTA band |
| 6 | Flat backgrounds, no depth | partial pass | v2 added film grain + vignettes (`.grain`), but large flat fills remain on cards/menu panels |
| 7 | Stock hero copy | pass | "Slow coffee, by the old harbor." is subject-specific; keep the copy system |
| 8 | Default easing / no motion identity | **HIT** | Default `ease`/`.2s` transitions throughout; one generic fade-up reveal for everything; marquee is trend-borrowing, not a signature |
| 9 | Machine-translated / lorem | pass w/ flag | No lorem. 繁中 is competent but has never had native review — flag stays until reviewed |

**Verdict:** competent template tier. The conversion architecture (menu, hours, open-status, LINE CTAs, reviews, map) and the bilingual system are salvageable and good. The visual system — palette, glass, gradients, font delivery, motion — is exactly what the mission calls AI-slop and dies in the redesign.

## Performance (Lighthouse 12.x, mobile emulation + simulated throttling, live GitHub Pages URL)

| Metric | `cafe/` before | Budget (Phase 4) |
|---|---|---|
| Performance score | **55** | ≥ 90 |
| FCP | 16.8 s | < 1.8 s |
| **LCP** | **18.6 s** | **< 2.5 s (aim < 1.8 s)** |
| CLS | 0.001 ✓ | < 0.1 |
| TBT | 0 ms ✓ | (INP < 200 ms field) |
| Total weight | 2,914 KB | < 900 KB first load |

Root causes, in order: (1) render-blocking Google Fonts CSS chain — 4 families, no preload, no self-hosting, no subsetting; (2) Unsplash JPEG hotlinks up to `w=1900` with no `srcset`/AVIF; (3) hero image not preloaded and revealed via JS `onload` fade. Raw JSON: `docs/audit/lighthouse-cafe-before.json`.

## Appendix — out-of-scope pages (scored for honesty, untouched this phase)

- `bnb/`: **cliché #1 exact** — teal gradient hero `bnb/index.html:69`, glass chips `:74`, gradient room-photo fallbacks `:85`. Also default easing throughout.
- `shop/`: gradient hero `shop/index.html:56`, six gradient product tiles `:74–76`, `:371–376` (deliberate "packaging" concept, but reads as gradient-card AI look).
- `index.html` launcher: near-black + single gold accent + centered layout — cliché #3 adjacent.

These three inherit the redesign's system in a later phase; redesigning them now would dilute the two-site mission.

## Working-tree note

`serve.js` and `start-demos.bat` are deleted in the working tree (unstaged, still in git history and on the live deploy). Not authored by this audit; awaiting owner decision to restore or commit the removal.

# Kaohsiung Demo Kit 高雄示範網站

Client-ready demo mockups for food, hospitality & tourism businesses in Kaohsiung, Taiwan — built to show prospects what a modern bilingual (EN/中文) website does for their business.

**Live kit:** https://notdeepan.github.io/kaohsiung-demos/

| Demo | Client type | Highlights |
|---|---|---|
| [`mfg/`](mfg/) — Cheng Chang Precision 鉦昌精密 | Export manufacturers (machinery, metal, auto-parts) | ±0.005 mm hero with procedural 3D machined part, self-annotating dimension lines, capability table, ISO/IATF plates, export markets, 48 h RFQ flow with drawing upload |
| [`cafe/`](cafe/) — Harborside Coffee 港邊珈琲 | Cafés, restaurants | Photography-led editorial layout, film-grain "develop" reveals, LXGW WenKai display type, short bilingual menu, live open/closed status, LINE booking |
| [`bnb/`](bnb/) — Tide House 潮汐民宿 | B&Bs / 民宿 | Availability calendar, booking-request form with live total, "book direct save 10%", ferry directions |
| [`shop/`](shop/) — Takao Pantry 打狗果舖 | Specialty food & gift brands | Cart + mock checkout (LINE Pay / ECPay), NT$ ⇄ US$ toggle, shipping & customs tables |

All businesses, names, addresses, menus and reviews are **fictional placeholders** — each demo is meant to be re-skinned with a real prospect's content.

## Local preview

- Double-click `index.html` (no server needed), or
- Double-click `start-demos.bat` → serves at http://localhost:4173

No build step. `mfg/` and `cafe/` self-host fonts and vendor JS from `assets/` (GSAP + ScrollTrigger + Lenis; three.js lazy-loaded by `mfg/` only).

## Development

- `node scripts/vendor-fonts.mjs` — re-downloads and rewrites the self-hosted font CSS/woff2 into `assets/fonts/`.
- `npm install` once, then `node scripts/verify.mjs` — headless-Chrome smoke test: screenshots to `docs/audit/`, console-error check, language-toggle and RFQ assertions.

---

Demo kit by Deepan Goswami · goswami.deepan@gmail.com

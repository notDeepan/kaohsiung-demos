# Creative Brief — Hospitality Demo (redesign of `cafe/`)

Fictional client retained: Harborside Coffee 港邊珈琲, Yancheng. Status: **awaiting owner approval — no code until approved.**

## 1. Concept / thesis

**Afternoon light in an old Yancheng shophouse — a photo essay you can order from.** The hero states it with one full-bleed golden-hour photograph and four characters, nothing else.

## 2. Mood

Sun-faded · unhurried · tactile.

## 3. Reference triangulation

Studio Freight/Darkroom (buttery scroll, grain-over-editorial) × 14islands (content-forward scroll storytelling) × Cereal-magazine print stillness. Aim: **kinetic editorial with zero tech-flash — the photography does the selling.** No WebGL anywhere on this site.

## 4. Palette (atmosphere mandatory, flat fills banned)

| Role | Hex | Usage |
|---|---|---|
| Dominant | `#F4EFE6` "morning paper" | 60–70% of surface, always textured with paper grain |
| Ink | `#26201A` | type, hairlines |
| Deep surface | `#221C15` "last light" | footer + menu-board panels — the page darkens as you scroll, morning → evening |
| Accent (≤8%) | `#46654A` 鐵窗花綠 window-grille green | links, active states, price dots — Taiwan old-house ironwork green, deliberately **not** terracotta |
| Brand island | `#06C755` LINE green | LINE CTAs only, quarantined from the palette math |

Atmosphere: 35 mm grain overlay (3–4%), soft vignette + warm halation on every photograph, paper texture on light surfaces. The warm tones live **in the photography**, not in UI fills.

## 5. Type (self-hosted woff2, subset)

- **Display voice: LXGW WenKai TC** 400/700 — open-source kai (楷體). Chinese leads the display layer; this is the hand-painted-sign / handwritten-menu voice of Taiwanese cafés, and the one deliberate risk of this direction. Subset per page (~60–120 KB), preloaded.
- **Latin display partner: Instrument Serif** 400 + Italic — display sizes only, tracking −1%. On bilingual display lines: WenKai at 1em, Instrument Italic at 0.94em, shared baseline.
- **Workhorse: General Sans** (Fontshare) 400/500/600 + **Noto Sans TC** 400/500/700 via unicode-range subsets.
- CJK rules: body line-height 1.85 (TC) / 1.6 (EN); zero letter-spacing on CJK; no faux italics — TC emphasis uses weight or the green accent, never slant; punctuation-aware breaks (`text-wrap: pretty`, no leading 、。).

## 6. Motion signature — "the develop"

Every photograph enters like a darkroom print developing: grain-heavy, +½ stop overexposed, scale 1.04 → settles to graded, sharp, 1.0 in ~0.9 s `power2.out` on scroll entry (GSAP ScrollTrigger + Lenis). Everything else is line-masked type rises. Menu prices and contact info never animate. Full `prefers-reduced-motion` variant: final states, 200 ms crossfade only.

## 7. Load sequence (first 2 s)

- 0–250 ms — paper + grain painted (pure CSS, instant; this is first paint, no blank).
- 250–700 ms — 「港邊珈琲」 inks in (opacity + 2px blur → 0); a hairline rule draws beneath it, its width driven by **real** font/hero-image load progress.
- 700–1500 ms — hero photograph *develops* (the signature's first performance).
- 1400–1900 ms — headline lines rise via mask; the open-status dot breathes once. Then stillness.

## 8. Sound

**None — stated choice.** A café site is read at counters and in bed; silence is the hospitable option.

## Copy direction (real, bilingual)

- Hero: 「光線好,咖啡慢。」 / EN "Good light, slow coffee."
- Support: EN "A sixty-year-old shophouse, two minutes from Pier-2. Beans roasted out back. Brunch till two." · 繁中 「離駁二步行兩分鐘的六十年老屋。後院自家烘豆,早午餐供應到下午兩點。」 `[NEEDS NATIVE REVIEW]`
- Menu section opener: EN "The menu is short on purpose." · 「菜單不長,是故意的。」 `[NEEDS NATIVE REVIEW]`

## Imagery list (one shoot, one grade)

Window light on counter wood (AM) · pour-over stream backlit · crema macro · hands around a cup · charcoal-toast steam · shopfront at blue hour · Yancheng arcade texture · owner at the roaster with slight motion blur · beans on cooling tray · a harbor/ferry glimpse.
Grade recipe (applied uniformly so placeholders read as one shoot): warm highlights, lifted matte blacks, 10–12% grain, gentle halation. Placeholders: hand-picked Unsplash frames run through one shared CSS grade; swapped for the prospect's real photography per pitch.

## Conversion set (kept prominent)

Menu (short, bilingual, print-quality typesetting) · hours with live open/closed status · lazy-loaded Google Map · LINE Official Account CTA (primary) · booking note · Instagram-friendly photo grid.

## Performance acceptance (Phase 4)

LCP < 1.8 s (hero photo preloaded, AVIF/WebP + srcset) · CLS < 0.1 · INP < 200 ms · JS < 90 KB gz (GSAP+ScrollTrigger+Lenis + site code) · fonts < 180 KB total subset woff2 · first-load page weight < 900 KB · Lighthouse mobile ≥ 90.

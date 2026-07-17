// Headless-Chrome smoke test for the demo kit.
// Usage: node scripts/verify.mjs   (server must be running on :4173)
import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.join(ROOT, 'docs', 'audit');
const BASE = 'http://localhost:4173';
await mkdir(SHOTS, { recursive: true });

const browser = await puppeteer.launch({ channel: 'chrome', headless: 'new', args: ['--hide-scrollbars'] });
const failures = [];
const note = (ok, msg) => { console.log((ok ? 'PASS ' : 'FAIL ') + msg); if (!ok) failures.push(msg); };

async function fresh(viewport, reduced = false) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.errors = errors;
  await page.evaluateOnNewDocument(() => { try { localStorage.removeItem('demoLang'); } catch (e) {} });
  return page;
}
const settle = ms => new Promise(r => setTimeout(r, ms));

/* ---------- launcher ---------- */
{
  const p = await fresh({ width: 1440, height: 900 });
  await p.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 45000 });
  const cards = await p.$$eval('.card', els => els.map(e => e.getAttribute('href')));
  note(cards.length === 4 && cards[0] === 'mfg/index.html', `launcher: 4 cards, mfg first (got ${cards.join(', ')})`);
  await p.screenshot({ path: path.join(SHOTS, 'after-launcher-desktop.png') });
  note(p.errors.length === 0, 'launcher: zero console errors' + (p.errors.length ? ' — ' + p.errors.join(' | ') : ''));
  await p.close();
}

/* ---------- cafe desktop ---------- */
{
  const p = await fresh({ width: 1440, height: 900 });
  await p.goto(BASE + '/cafe/', { waitUntil: 'networkidle2', timeout: 45000 });
  await settle(3200); // loader + hero choreography
  const h1Vis = await p.$eval('.hero h1', el => {
    const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    return r.height > 40 && s.visibility !== 'hidden';
  });
  note(h1Vis, 'cafe: hero headline visible after load sequence');
  const heroShown = await p.$eval('#heroImg', el => +getComputedStyle(el).opacity > .9);
  note(heroShown, 'cafe: hero photograph developed to full opacity');
  const menuCount = await p.$$eval('.mi', els => els.length);
  note(menuCount >= 14, `cafe: menu items present (${menuCount})`);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  note(overflow <= 2, `cafe: no horizontal overflow (${overflow}px)`);
  await p.screenshot({ path: path.join(SHOTS, 'after-cafe-desktop.png') });
  // language toggle
  await p.click('.lang-t');
  const lang = await p.evaluate(() => document.documentElement.lang);
  const zhVisible = await p.$eval('.intro .lede.zh', el => getComputedStyle(el).display !== 'none');
  note(lang === 'zh-Hant' && zhVisible, `cafe: 中文 toggle switches lang + copy (lang=${lang})`);
  await p.click('.lang-t');
  // scroll deep for develop reveals + menu board shot
  await p.evaluate(() => document.getElementById('menu').scrollIntoView());
  await settle(1800);
  await p.screenshot({ path: path.join(SHOTS, 'after-cafe-menu.png') });
  note(p.errors.length === 0, 'cafe: zero console errors' + (p.errors.length ? ' — ' + p.errors.join(' | ') : ''));
  await p.close();
}

/* ---------- cafe mobile ---------- */
{
  const p = await fresh({ width: 390, height: 844, deviceScaleFactor: 2 });
  await p.goto(BASE + '/cafe/', { waitUntil: 'networkidle2', timeout: 45000 });
  await settle(3200);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  note(overflow <= 2, `cafe mobile: no horizontal overflow (${overflow}px)`);
  const burger = await p.$eval('#burger', el => getComputedStyle(el).display !== 'none');
  note(burger, 'cafe mobile: burger visible');
  await p.evaluate(() => scrollTo(0, 900)); await settle(900);
  const bbar = await p.$eval('#bbar', el => el.classList.contains('show'));
  note(bbar, 'cafe mobile: sticky LINE bar appears on scroll');
  await p.evaluate(() => scrollTo(0, 0)); await settle(600);
  await p.screenshot({ path: path.join(SHOTS, 'after-cafe-mobile.png') });
  note(p.errors.length === 0, 'cafe mobile: zero console errors' + (p.errors.length ? ' — ' + p.errors.join(' | ') : ''));
  await p.close();
}

/* ---------- mfg desktop ---------- */
{
  const p = await fresh({ width: 1440, height: 900 });
  await p.goto(BASE + '/mfg/', { waitUntil: 'networkidle2', timeout: 45000 });
  await settle(3400); // loader + counter
  const tol = await p.$eval('#tolVal', el => el.textContent);
  note(tol === '±0.005', `mfg: tolerance counter settled at ${tol}`);
  const lineDrawn = await p.$eval('#heroDim .dl-line', el => {
    const m = getComputedStyle(el).transform;
    return m === 'none' || m.includes('matrix(1');
  });
  note(lineDrawn, 'mfg: hero dimension line fully drawn');
  const live3d = await p.$eval('#partWrap', el => el.classList.contains('live'));
  console.log((live3d ? 'PASS' : 'WARN') + ' mfg: 3D part ' + (live3d ? 'live over blueprint' : 'not initialized (blueprint fallback shown — acceptable on headless GPU)'));
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  note(overflow <= 2, `mfg: no horizontal overflow (${overflow}px)`);
  await p.screenshot({ path: path.join(SHOTS, 'after-mfg-desktop.png') });
  // language toggle
  await p.click('.lang-t');
  const lang = await p.evaluate(() => document.documentElement.lang);
  note(lang === 'zh-Hant', `mfg: 中文 toggle (lang=${lang})`);
  await p.click('.lang-t');
  // RFQ flow
  await p.evaluate(() => document.getElementById('rfq').scrollIntoView());
  await settle(1400);
  await p.type('#f-co', 'Acme GmbH'); await p.type('#f-nm', 'J. Tester'); await p.type('#f-em', 'j@acme.de');
  await p.click('.rfq-f .btn-o');
  await settle(400);
  const ok = await p.$eval('#rfqOk', el => el.classList.contains('show'));
  note(ok, 'mfg: RFQ submit shows received state');
  await p.screenshot({ path: path.join(SHOTS, 'after-mfg-rfq.png') });
  note(p.errors.length === 0, 'mfg: zero console errors' + (p.errors.length ? ' — ' + p.errors.join(' | ') : ''));
  await p.close();
}

/* ---------- mfg mobile ---------- */
{
  const p = await fresh({ width: 390, height: 844, deviceScaleFactor: 2 });
  await p.goto(BASE + '/mfg/', { waitUntil: 'networkidle2', timeout: 45000 });
  await settle(3400);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  note(overflow <= 2, `mfg mobile: no horizontal overflow (${overflow}px)`);
  await p.evaluate(() => scrollTo(0, 1000)); await settle(900);
  const bbar = await p.$eval('#bbar', el => el.classList.contains('show'));
  note(bbar, 'mfg mobile: sticky RFQ bar appears on scroll');
  await p.evaluate(() => scrollTo(0, 0)); await settle(600);
  await p.screenshot({ path: path.join(SHOTS, 'after-mfg-mobile.png') });
  note(p.errors.length === 0, 'mfg mobile: zero console errors' + (p.errors.length ? ' — ' + p.errors.join(' | ') : ''));
  await p.close();
}

/* ---------- reduced motion ---------- */
{
  const p = await fresh({ width: 1440, height: 900 }, true);
  await p.goto(BASE + '/cafe/', { waitUntil: 'networkidle2', timeout: 45000 });
  await settle(700);
  const vis = await p.evaluate(() => {
    const img = document.getElementById('heroImg');
    const h1 = document.querySelector('.hero h1 .msk-l');
    return +getComputedStyle(img).opacity === 1 && getComputedStyle(h1).transform === 'none';
  });
  note(vis, 'cafe reduced-motion: hero fully visible, no hidden states, no loader');
  await p.close();

  const q = await fresh({ width: 1440, height: 900 }, true);
  await q.goto(BASE + '/mfg/', { waitUntil: 'networkidle2', timeout: 45000 });
  await settle(700);
  const vis2 = await q.evaluate(() => {
    const v = document.getElementById('tolVal').textContent;
    const rise = document.querySelector('.hsub');
    return v === '±0.005' && +getComputedStyle(rise).opacity === 1;
  });
  note(vis2, 'mfg reduced-motion: final states rendered statically');
  await q.screenshot({ path: path.join(SHOTS, 'after-mfg-reduced.png') });
  await q.close();
}

await browser.close();
console.log('\n' + (failures.length ? `${failures.length} FAILURE(S)` : 'ALL CHECKS PASSED'));
process.exit(failures.length ? 1 : 0);

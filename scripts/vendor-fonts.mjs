// Vendors web fonts for self-hosting: fetches provider CSS with a woff2-capable
// UA, downloads every referenced font file, rewrites URLs to local relative
// paths, and writes <slug>/<slug>.css under assets/fonts/.
// Usage: node scripts/vendor-fonts.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets', 'fonts');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const FAMILIES = [
  { slug: 'lxgw-wenkai-tc', css: 'https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@300;400;700&display=swap' },
  { slug: 'noto-sans-tc', css: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400..900&display=swap' },
  { slug: 'instrument-serif', css: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap' },
  { slug: 'ibm-plex-mono', css: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap' },
  { slug: 'archivo', css: 'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900&display=swap' },
  { slug: 'general-sans', css: 'https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap' },
];

async function fetchText(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}
async function fetchBin(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

let grandFiles = 0, grandBytes = 0;
for (const fam of FAMILIES) {
  try {
    let css = await fetchText(fam.css);
    // keep only woff2 sources inside src: lists (drop woff/ttf fallbacks)
    css = css.replace(/,\s*url\([^)]+\)\s*format\(['"]?(woff|truetype|opentype)['"]?\)/g, '');
    const dir = path.join(OUT, fam.slug);
    await mkdir(dir, { recursive: true });
    const urls = [...new Set([...css.matchAll(/url\(['"]?((?:https:)?\/\/[^)'"]+?)['"]?\)/g)].map(m => m[1]))];
    let i = 0, bytes = 0;
    const mapping = new Map();
    for (const u of urls) {
      const ext = (u.match(/\.(woff2?|ttf|otf)(\?|$)/) || [, 'woff2'])[1];
      mapping.set(u, `${fam.slug}-${String(i++).padStart(3, '0')}.${ext}`);
    }
    // download in batches of 12
    const entries = [...mapping.entries()];
    for (let b = 0; b < entries.length; b += 12) {
      await Promise.all(entries.slice(b, b + 12).map(async ([u, name]) => {
        const buf = await fetchBin(u.startsWith('//') ? 'https:' + u : u);
        bytes += buf.length;
        await writeFile(path.join(dir, name), buf);
      }));
    }
    for (const [u, name] of mapping) css = css.replaceAll(u, `./${name}`);
    await writeFile(path.join(dir, `${fam.slug}.css`), css);
    grandFiles += urls.length; grandBytes += bytes;
    console.log(`OK  ${fam.slug}: ${urls.length} files, ${(bytes / 1024).toFixed(0)} KB`);
  } catch (e) {
    console.log(`FAIL ${fam.slug}: ${e.message}`);
  }
}
console.log(`TOTAL: ${grandFiles} files, ${(grandBytes / 1048576).toFixed(1)} MB`);

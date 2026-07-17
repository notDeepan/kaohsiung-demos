// Splits the big vendored CJK font CSS into per-weight files so pages load
// only the weights they use. Usage: node scripts/split-font-css.mjs
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const JOBS = [
  // noto-sans-tc is vendored as a single variable-range css — no split needed
  ['assets/fonts/lxgw-wenkai-tc/lxgw-wenkai-tc.css', ['400']],
];

for (const [rel, weights] of JOBS) {
  const src = path.join(ROOT, rel);
  const css = await readFile(src, 'utf8');
  const blocks = css.match(/@font-face\s*\{[^}]*\}/g) || [];
  for (const w of weights) {
    const keep = blocks.filter(b => (b.match(/font-weight:\s*(\d+)/) || [])[1] === w);
    const out = src.replace(/\.css$/, `-${w}.css`);
    await writeFile(out, keep.join('\n'), 'utf8');
    console.log(path.basename(out), keep.length, 'faces,', Math.round(keep.join('\n').length / 1024) + 'KB');
  }
}

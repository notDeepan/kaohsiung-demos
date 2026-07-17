import { readFileSync } from "node:fs";
for (const n of ["cafe", "mfg"]) {
  const j = JSON.parse(readFileSync(`docs/audit/lighthouse-${n}-after.json`, "utf8"));
  const a = j.audits, el = a["largest-contentful-paint-element"];
  console.log(`== ${n} ==`);
  try {
    const node = el.details.items[0].items[0].node;
    console.log("LCP:", node.snippet.replace(/\s+/g, " ").slice(0, 110));
    const ph = el.details.items[1].items;
    console.log("phases:", ph.map(x => `${x.phase} ${Math.round(x.timing)}ms`).join(" | "));
  } catch (e) { console.log("LCP extract failed:", e.message); }
  try {
    const net = a["network-requests"].details.items.filter(i => /webp|unsplash/.test(i.url)).slice(0, 4)
      .map(i => `${Math.round(i.transferSize / 1024)}KB ${i.url.split("/").pop().slice(0, 44)}`);
    console.log("images:", net.join(" · "));
  } catch (e) {}
}

// Pull the latest map data from the map's Google Sheet into public/data.json (the nightly backup).
//
//   npm run pull-data          uses dataUrl from map.config.ts
//   OPENTHINK_DATA_URL="https://script.google.com/macros/s/…/exec" npm run pull-data
//
// The URL is the Apps Script web app from apps-script/Code.gs (Deploy → Web app).
// It only serves the public tabs — never Feedback or Change Log.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** dataUrl from map.config.ts (read as text, so this needs no TypeScript tooling). */
function configUrl() {
  try {
    const cfg = readFileSync(fileURLToPath(new URL("../map.config.ts", import.meta.url)), "utf8");
    return /^\s*dataUrl:\s*["'`]([^"'`]*)["'`]/m.exec(cfg)?.[1]?.trim() || "";
  } catch {
    return "";
  }
}
const url = process.env.OPENTHINK_DATA_URL || process.argv[2] || configUrl();
if (!url) {
  console.log("No web app URL yet (map.config.ts → dataUrl is empty), so there is nothing to back up.");
  process.exit(0);
}

const res = await fetch(url, { redirect: "follow" });
if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
const data = await res.json();
for (const key of ["coalitions", "organizations", "edges"]) {
  if (!Array.isArray(data[key])) throw new Error(`Response is missing "${key}" — is this the right URL?`);
}

const out = fileURLToPath(new URL("../public/data.json", import.meta.url));
writeFileSync(out, JSON.stringify(data, null, 2) + "\n");
const count = (k) => data.coalitions.reduce((n, c) => n + c[k].length, 0);
console.log(
  `Wrote ${out}: ${data.coalitions.length} coalitions, ${data.organizations.length} orgs, ` +
    `${count("projects")} projects, ${count("events")} events.`,
);

// The social justice sheet (?feed=social-justice): one backup file per sector in public/sectors/, named after
// its Coalitions row (sector_palestinian_rights → palestinian-rights.json). Skipped until that sheet is linked.
try {
  const sjUrl = `${url}${url.includes("?") ? "&" : "?"}feed=social-justice`;
  const sjRes = await fetch(sjUrl, { redirect: "follow" });
  const sj = sjRes.ok ? await sjRes.json() : null;
  if (!sj || sj.unlinked || !Array.isArray(sj.coalitions) || !sj.coalitions.length) {
    console.log("Social justice sheet: not linked yet, sector files left as they are.");
  } else {
    for (const c of sj.coalitions) {
      if (!/^sector_[a-z0-9_]+$/.test(c.id)) continue;
      const sector = c.id.slice("sector_".length).replace(/_/g, "-");
      const organizations = sj.organizations.filter((o) => (o.coalition_ids || []).includes(c.id));
      const ids = new Set(organizations.map((o) => o.id));
      const file = {
        generated_at: sj.generated_at, sector, source: "Social justice sheet (nightly backup)",
        coalitions: [c], organizations, edges: sj.edges.filter((e) => e.source === c.id && ids.has(e.target)),
      };
      const at = fileURLToPath(new URL(`../public/sectors/${sector}.json`, import.meta.url));
      writeFileSync(at, JSON.stringify(file, null, 1) + "\n");
      console.log(`Wrote ${at}: ${organizations.length} groups.`);
    }
  }
} catch (err) {
  console.warn("Social justice sheet could not be read:", err.message);
}

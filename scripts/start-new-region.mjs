// Turns a copy of the MA Climate Organization Map into an empty starting point for another region. The template
// (github.com/turibiusrozario-tutorials/template.climateorgmap.earth) is already that, so a map forked from it
// never needs this. Run it once in a copy of the MA map:
//
//   node scripts/start-new-region.mjs            shows what it would change (nothing is touched)
//   node scripts/start-new-region.mjs --yes      makes the changes
//
// It keeps all the code, the topic lists and the geography files, and removes Massachusetts's data:
//   - public/data.json becomes an empty map (no coalitions, groups or links)
//   - public/topics*.json keep their topic lists but lose MA's research records and bills; src/source-check.json empties
//   - Massachusetts logos, the researched Vermont/Oregon maps, the money layer, the social justice layers,
//     research notes and the MA team's work log are deleted
//   - map.config.ts: a blank settings file (name, state, land acknowledgement and web app URL to fill in)
//   - src/forms.config.ts + src/forms.fields.json: the Massachusetts form links are cleared (the sheet sends yours)
// Afterwards it lists what you still set by hand.
import { existsSync, readdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const go = process.argv.includes("--yes");

/** The settings file a new map starts from (the same as the template's own map.config.ts). */
const BLANK_CONFIG = readFileSync(new URL("./map.config.blank.ts", import.meta.url), "utf8");
const done = [];
const act = (what, fn) => {
  done.push(what);
  if (go) fn();
};

const EMPTY = { generated_at: new Date().toISOString(), coalitions: [], organizations: [], edges: [], org_links: [] };
act("public/data.json → an empty map", () => writeFileSync("public/data.json", JSON.stringify(EMPTY, null, 1) + "\n"));
act("public/thoughts.json → empty", () => writeFileSync("public/thoughts.json", "{}\n"));
// The topic lists stay; the MA research records filed under them (and MA's bills) go, so the Topics page starts empty.
for (const f of ["public/topics.json", "public/topics-wiki.json"]) {
  if (!existsSync(f)) continue;
  const t = JSON.parse(readFileSync(f, "utf8"));
  if (!t.records?.length && !t.bills?.length) continue;
  act(`${f}: keep the topic list, drop ${t.records?.length || 0} Massachusetts records and ${t.bills?.length || 0} bills`, () =>
    writeFileSync(f, JSON.stringify({ ...t, records: [], bills: [] }, null, 1) + "\n"));
}
act("src/source-check.json → empty (the MA items' page check)", () =>
  writeFileSync("src/source-check.json", JSON.stringify({ checked: "", remove: [], fix: {}, add: {}, groups: {} }, null, 1) + "\n"));

if (existsSync("public/logos")) {
  const logos = readdirSync("public/logos");
  act(`public/logos/: delete ${logos.length} Massachusetts logos`, () => {
    for (const f of logos) rmSync(join("public/logos", f), { recursive: true, force: true });
    writeFileSync("public/logos/.gitkeep", "");
    writeFileSync("src/logos.web.json", "[]\n"); // no WebP copies yet (scripts/web-logos.py makes them)
  });
}
for (const dir of ["public/maps", "public/money", "public/sectors", "research", "data-review"]) {
  if (existsSync(dir)) act(`${dir}/: delete (Massachusetts-only research and layers)`, () => rmSync(dir, { recursive: true, force: true }));
}
for (const f of readdirSync(".").filter((f) => /_LLM\.log$/.test(f))) {
  act(`${f}: delete (the MA team's work log)`, () => rmSync(f));
}

const edit = (file, from, to, what) => {
  const s = readFileSync(file, "utf8");
  if (!from.test(s)) return;
  act(`${file}: ${what}`, () => writeFileSync(file, s.replace(from, to)));
};
edit("src/forms.config.ts", /url: "https:\/\/docs\.google\.com\/forms\/[^"]*"/g, 'url: ""', "clear the Massachusetts form links (the + button says the forms aren't connected yet)");
act("src/forms.fields.json → empty (the sheet's web app sends your forms' questions)", () => writeFileSync("src/forms.fields.json", "{}\n"));
act("map.config.ts → a blank settings file to fill in", () => writeFileSync("map.config.ts", BLANK_CONFIG));

console.log(go ? "Done:" : "Would do (run again with --yes to make these changes):");
for (const d of done) console.log("  - " + d);
console.log(`
Still to set (README.md → "Start your own map"; <your site>/setup.html checks each step):
  - map.config.ts             your map's name, state and land acknowledgement; later the sheet's web app URL
  - GitHub Settings → Pages    your custom domain, if you have one (otherwise <you>.github.io/<repo>)`);

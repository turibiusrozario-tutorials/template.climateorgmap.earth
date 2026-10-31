// Brings another copy's code changes into this one, keeping this map's own files (its settings, data, logos and
// notes). The template uses it to take in the MA map's improvements:
//
//   node scripts/sync-upstream.mjs                      merges nkessel/openthink_mycc development_branch
//   node scripts/sync-upstream.mjs <git url> <branch>   merges another copy (e.g. the MA map taking in the template)
//
// What it does:
//   1. a trial merge, to list the files where both sides changed the same lines;
//   2. the real merge with "-X ours": in those lines this copy's side is kept, every other change comes in;
//   3. this map's own files (OWN below) are put back as they were, including ones this copy deleted;
//   4. commits, and prints the files to look over. Push when it looks right (or open a pull request).
// Maps made from the template don't need this: GitHub's "Sync fork" button is enough, because the template never
// changes a map's settings, data or logos (the first two lines of OWN). Don't edit the template's notes in your map
// (README.md and the others below); put what's yours in map.config.ts.
import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";

/** Files each copy keeps as its own: never taken from the other copy. Folders end in "/". */
export const OWN = [
  "map.config.ts", // the one settings file
  "public/data.json", "public/thoughts.json", "public/logos/", "src/logos.web.json", // the map's data and logos
  "src/forms.config.ts", "src/forms.fields.json", "src/region.config.ts", "src/data.config.ts", // older copies keep settings here
  "public/maps/", "public/money/", "public/sectors/", "research/", "data-review/", // the MA map's research layers
  "README.md", "HANDOFF.md", "CLAUDE.md", "public/guide.html", // each copy's own notes and guide
];
const isOwn = (f) => OWN.some((o) => (o.endsWith("/") ? f.startsWith(o) : f === o)) || /(^|\/)[^/]*_LLM\.log$/.test(f);

const [url = "https://github.com/nkessel/openthink_mycc", branch = "development_branch"] = process.argv.slice(2);
const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const tryGit = (...args) => { try { return git(...args); } catch (e) { return null; } };
const lines = (s) => (s ? s.split("\n").filter(Boolean) : []);

if (git("status", "--porcelain")) {
  console.error("Commit or stash your changes first (git status shows uncommitted work).");
  process.exit(1);
}
console.log(`Fetching ${url} ${branch}…`);
git("fetch", url, branch);
const theirs = git("rev-parse", "FETCH_HEAD");

// 1. trial merge: which files really conflict?
tryGit("merge", "--no-commit", "--no-ff", theirs);
const conflicted = lines(tryGit("diff", "--name-only", "--diff-filter=U"));
tryGit("merge", "--abort");

// 2. the real merge
tryGit("merge", "--no-commit", "--no-ff", "-X", "ours", theirs);

// 3. put this map's own files back
const touched = new Set([...lines(tryGit("diff", "--name-only", "HEAD")), ...lines(tryGit("diff", "--name-only", "--cached", "HEAD")), ...lines(tryGit("diff", "--name-only", "--diff-filter=U"))]);
const kept = [];
for (const f of touched) {
  if (!isOwn(f)) continue;
  if (tryGit("cat-file", "-e", `HEAD:${f}`) !== null) git("checkout", "HEAD", "--", f);
  else {
    tryGit("rm", "-rf", "--cached", "--ignore-unmatch", "--", f);
    if (existsSync(f)) rmSync(f, { recursive: true, force: true });
  }
  kept.push(f);
}
const left = lines(tryGit("diff", "--name-only", "--diff-filter=U"));
if (left.length) {
  console.log("\nStill conflicting (fix these by hand, then `git add` them and `git commit`):\n  " + left.join("\n  "));
  process.exit(1);
}
if (!git("diff", "--cached", "--name-only")) {
  tryGit("merge", "--abort");
  console.log("Nothing new to bring in.");
  process.exit(0);
}
git("commit", "-m", `Merge ${url} ${branch} (kept this map's own files)`);
console.log(`\nMerged ${theirs.slice(0, 7)}.`);
if (kept.length) console.log(`Kept this map's own version of ${kept.length} file(s) (settings, data, logos, notes).`);
const review = conflicted.filter((f) => !isOwn(f));
if (review.length) console.log("Both sides changed the same lines here; this copy's lines were kept, so look these over:\n  " + review.join("\n  "));
console.log("\nThen: npm run build && npm run test:apps-script, and push.");

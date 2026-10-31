# Climate Organization Map template — notes for Claude Code

**Start with [HANDOFF.md](HANDOFF.md)** (current state, what's waiting, recent changes) and update it before you finish a session, so any account can pick up where the last one stopped.

Follow the team's shared rules in [LLM_GUIDELINES.md](LLM_GUIDELINES.md). In short: brief answers, label responses (`1.01`), use detail tags `[0]`–`[4]` (default `[2]`), state your uncertainty, `git pull` + check open PRs before coding, branch off `main` and open a PR into it, and log what you did and why in `<github-username>_LLM.log`.

## Project

- Vite + TypeScript + D3 single-page app; the template of the MA Climate Organization Map (github.com/nkessel/openthink_mycc) with Massachusetts taken out. Data schema: `src/types.ts`.
- **A map's settings are all in `map.config.ts`** (resolved by `src/map-config.ts`, state presets in `src/us-states.ts`). Never change it, `public/data.json`, `public/thoughts.json`, `public/logos/` or `src/logos.web.json` in the template: every fork would conflict on Sync fork. New settings get a default in `src/map-config.ts`.
- The Google Sheet is the source of truth. `apps-script/Code.gs` (+ `Confirm.gs`) reads the region from `<site>/region.json`, builds the forms, checks editors, queues reviews, logs submissions, and serves the public data plus the forms' links (`data.forms`) as a web app. See `apps-script/SETUP.md`.
- The site (GitHub Pages, `.github/workflows/pages.yml`, deploys from the default branch) reads the web app at `dataUrl`, falling back to `public/data.json` (nightly backup, `.github/workflows/sync-data.yml`). `public/setup.html` checks a new map's setup.
- Bring in the MA map's code changes with `node scripts/sync-upstream.mjs`.
- `npm run test:apps-script` and `npm run check:apps-script` test the Apps Script in Node; CI runs them on every PR.

## Commands

- `npm run dev` — local dev server
- `npm run build` — typecheck + production build (run before opening a PR)

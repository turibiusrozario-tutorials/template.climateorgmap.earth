# Handoff: working notes for the next session

Read this first, then `CLAUDE.md` and `LLM_GUIDELINES.md`. **Update this file at the end of every session** (newest
first under "Recent"). This repo is public: no emails, phone numbers, passwords or private sheet contents here.

## What this repo is
- The forkable template for new climate organization maps: the MA map's code
  ([nkessel/openthink_mycc](https://github.com/nkessel/openthink_mycc)) with Massachusetts taken out, and every
  per-map setting in one file, `map.config.ts`. Goal: a new map in about 15 minutes, all in the browser.
- New maps fork it and get updates with GitHub's **Sync fork**. The template must never change a map's own files
  (`map.config.ts`, `public/data.json`, `public/thoughts.json`, `public/logos/`, `src/logos.web.json`).
- Code is developed in the MA repo for now: bring it in with `node scripts/sync-upstream.mjs` (keeps the template's
  own files, lists files to look over). Later the template may become the upstream for every map, MA included.

## How the pieces find each other (no copying by hand)
- `map.config.ts` → `src/map-config.ts` (+ state presets in `src/us-states.ts`) → `REGION` for the site.
- The build (`vite.config.ts`) writes the title and land acknowledgement into `index.html` and emits `region.json`
  (read by the sheet script) and `apps-script.txt` (Code.gs + Confirm.gs, stamped with `SCRIPT_HASH`).
- The sheet script asks for the site's address once (`SITE_URL` script property) and saves `region.json` as
  `REGION_JSON`. Its web app sends the forms' links and question ids as `data.forms` (cached in `SITE_FORMS_*`
  properties; refreshed by Set up, Update the forms, Refresh form dropdowns). The site applies them in `src/forms.live.ts`.
- `public/setup.html` checks each setup step live (region.json, the web app, its forms, script version).

## Waiting on a person
1. Delete the branch `tmp-push-test` (a push-permission test; the session's git proxy wouldn't let it be deleted):
   repo → **Code** → branch menu (**main ▾**) → **View all branches** → trash icon next to it.
2. Test the README's steps from a second GitHub account (a repo owner can't fork their own repo).
3. Optional: turn on Pages for this repo (Settings → Pages → Source: GitHub Actions) to have a live demo of the
   empty template and its `setup.html`.
4. Optional: point the MA map's guide (`public/guide.html` in openthink_mycc) and the climateorgmap.earth directory at
   this template.

## Recent (newest first)
- 2026-11-01: First test run took 16 minutes. README and setup.html steps now say where each button is, have
  simplified drawings (`public/setup/*.svg`, made by a script; replace them with real screenshots any time, same file
  names), mark every wait (about 5 minutes of the 15) and do the Google steps during the first build. The map shows
  "Open the setup checklist" until `dataUrl` is set; the deploy run's summary links the map and checklist. Fixed: the
  Topics page showed MA groups on a new map (`public/topics*.json` still had MA's 618 research records and 22 bills;
  `src/source-check.json` had MA item fixes). Topic lists kept, records emptied; these files are now "own files" in
  `scripts/sync-upstream.mjs` and `start-new-region.mjs` empties them.
- 2026-10-31: Template created from openthink_mycc `development_branch` (8448878). One settings file; sheet region
  read from the site; forms read from the sheet; setup.html; deploy from the default branch; nightly backup reads
  `dataUrl`, commits directly and redeploys; sync-upstream script; tests use a frozen MA fixture
  (`tests/fixtures/ma-data.json`) so they pass with empty data.

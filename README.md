# Climate Organization Map: template

Start a climate organization map for your state or region: a network map of coalitions and the groups in them, a
geographic map, and lists of events, projects and actions. Point people keep their own group's information current
through Google Forms; your core team approves everything else. It's the code behind the
[MA Climate Organization Map](https://ma.climateorgmap.earth), with Massachusetts taken out.

Everything is free: the site runs on GitHub Pages, the data lives in your Google Sheet, and the forms are Google Forms
that the sheet builds for you. **You edit one file, [`map.config.ts`](map.config.ts).**

## Start your own map (about 15 minutes)

You need a GitHub account and a Google account (ideally a shared team account: see [Who owns what](#who-owns-what)).
Everything happens in the browser.

**On GitHub (5 minutes)**

1. On this repo's page, click **Fork**. Give it a name (e.g. `wi-climate-map`) and click **Create fork**.
2. In your fork: **Actions** tab → **I understand my workflows, go ahead and enable them**.
3. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Open [`map.config.ts`](map.config.ts) → pencil icon (**Edit**). Set `title` (e.g. `"WI Climate Organization Map"`),
   `state` (e.g. `"WI"`) and your `landAcknowledgement`. **Commit changes**.
5. **Actions** tab: wait for **Deploy to GitHub Pages** to get a green check (about 2 minutes). Your map is at
   `https://<your-github-name>.github.io/<repo-name>/`. Open **`…/setup.html`** there: it checks every step from here on.

**In Google (8 minutes)**

6. Open [sheets.new](https://sheets.new) and name the sheet (e.g. "WI Climate Organization Map data").
7. On your `setup.html` page, click **Copy the sheet script**. In the sheet: **Extensions → Apps Script**, select all
   in `Code.gs`, paste over it, **Save**.
8. Reload the sheet. In the new menu named after your map: **Set up sheet + forms (run once)**. Allow the permissions
   (Google may say the app isn't verified: **Advanced → Go to … (unsafe)**; it's your own script). If it stops after
   asking for permission, click the menu item again. Paste your map's address when asked, and your core team's emails.
9. In Apps Script: **Deploy → New deployment** → ⚙ **Web app**. Execute as **Me**, access **Anyone** → **Deploy** →
   copy the **Web app URL**.

**Back on GitHub (2 minutes)**

10. Edit `map.config.ts` again: paste the URL into `dataUrl`. **Commit changes**. After the deploy (about 2 minutes),
    every step on `setup.html` is green. Press **+** on your map to add your first group.

That's it: approved form submissions show on the map within a minute, and a backup of the data is saved into the repo
every night.

### What `map.config.ts` sets

| Setting | What it's for |
|---|---|
| `title` | The map's name: page title, top bar, form titles, emails, the sheet's menu |
| `state` | Two-letter code. Fills in where the geographic map opens, the main city (where a group with no address yet is placed), the time zone and the state name |
| `landAcknowledgement` | Shown on the loading screen and under "Land acknowledgement" in the menu |
| `dataUrl` | The sheet's web app URL (step 9) |
| optional | `shortTitle`, `timeZone`, `bounds`, `fallback`, `exampleTowns`, `exampleOrgs`, `geo` (see [`src/map-config.ts`](src/map-config.ts)) |

The sheet reads the name and state from your site, and the site reads the forms from the sheet, so nothing else is
copied by hand.

## Get updates

1. On your fork's GitHub page: **Sync fork → Update branch**. The template never changes `map.config.ts`, your data or
   your logos, so this doesn't conflict. Don't edit the template's other files (this README included) in your copy.
2. Open your `setup.html`. If **Sheet script up to date** isn't green: copy the script again, paste it over `Code.gs`,
   **Save**, then **Deploy → Manage deployments → ✏️ → Version: New version → Deploy** (the URL stays the same), and
   run **Update the forms** from the sheet's menu.

## A climateorgmap.earth address

Maps can have an address like `wi.climateorgmap.earth`.

1. Ask first, through the [MA map's feedback form](https://docs.google.com/forms/d/e/1FAIpQLScwazw1P9rbQT4KAoUn0DSuI6B9Lpdx-kcrZXdZV45-HlAVKw/viewform):
   the address you'd like, your repo's link and who maintains it.
2. Once approved: **Settings → Pages → Custom domain**: `wi.climateorgmap.earth` → **Save** (before the DNS record
   exists, so nobody else can claim it).
3. The climateorgmap.earth team adds `CNAME wi → <your-github-name>.github.io`.
4. When the address works, tick **Enforce HTTPS** (can take up to a day). Then, in the sheet's menu, **Connect to the
   map's website** with the new address.

If a map shuts down, its DNS record is removed so the address can't be taken over.

## Who owns what

- The sheet's script and web app run as the Google account that set them up. If that account closes, the forms stop
  recording and the map stops updating. Use a shared team account, or write down who takes over.
- The fork belongs to whoever made it: add a second maintainer (**Settings → Collaborators**).
- Share the sheet only with your core team. Point people never open it: they use the forms. On the sheet's **Editors**
  tab, give each group's point person (up to three) the group's id.

## How it works

| Piece | What it does | Where it lives |
|---|---|---|
| The website | The map people look at. Never changes data itself. | Your fork, published by GitHub Pages (`.github/workflows/pages.yml`) |
| The Google Sheet | The source of truth: every coalition, group, event, project and action, and who may edit each. | Your Google Drive |
| Google Forms | How point people add and fix their group's information (Google sign-in; others wait in **Needs Review**). | Built by the sheet's script (`apps-script/Code.gs`) |

The sheet's web app publishes only public tabs (never Editors, Needs Review, Feedback or Change Log), plus the forms'
links. The site falls back to `public/data.json` (the nightly backup, `.github/workflows/sync-data.yml`) when Google is
unreachable. More on the sheet: [`apps-script/SETUP.md`](apps-script/SETUP.md).

## For the template's maintainers

- The MA map ([nkessel/openthink_mycc](https://github.com/nkessel/openthink_mycc)) is where the code is developed for
  now. To bring its changes in: `node scripts/sync-upstream.mjs`, check `npm run build && npm run test:apps-script`,
  push. It keeps the template's own files (`OWN` in the script): settings, empty data, notes.
- Never change a map's own files here (`map.config.ts`, `public/data.json`, `public/thoughts.json`, `public/logos/`,
  `src/logos.web.json`): every fork would get a conflict. New settings get a default in `src/map-config.ts` instead.
- Later the template can become the upstream for every map, MA included: the MA map then runs the same script the
  other way (`node scripts/sync-upstream.mjs <template url> main`) and moves its settings into `map.config.ts`.

## Run locally

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # typecheck + production build into dist/
npm run test:apps-script
```

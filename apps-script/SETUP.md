# Setup: sheet, forms, and website (about 15 minutes, once)

The short version is in the [README](../README.md#start-your-own-map-about-15-minutes); your site's `setup.html` checks each step. This page has the details.

**How it fits together**
- **Google Sheet ("<your map> data")** — the source of truth for the map. Only the core team can open it.
- **Five Google Forms** — how point-people update their own org and add events/projects. They sign in with Google; the script checks their email against the **Editors** tab before changing anything.
- **Website (GitHub Pages)** — a static site that reads the sheet's public data live, with a nightly backup copy in the repo.

| Form | Who can use it | What it changes |
|---|---|---|
| Update your organization | Point-people for that org, admins. Anyone can *propose* a new org (reviewed). | Name, abbreviation, type, description, town, HQ address or "remote", coalitions, topics, youth-serving, membership size, website, logo link, public contact, **which orgs you work with and how often**, or remove |
| Add or edit an event | Point-people for the host org or coalition, admins | Org and/or coalition, name, description, date, time, whether it repeats, location, online?, topics, link, public contact, or remove |
| Add or edit a project | Same as events | Org and/or coalition, name, description, status, skills needed, location, online?, topics, link, public contact, or remove |
| Add or edit an action or volunteer opportunity | Same as events | Org and/or coalition, name, what people can do, type (take action / volunteer), urgency, deadline, skills, link, public contact, or remove |
| Send feedback | Anyone, no sign-in | Goes to the Feedback tab |

Every question is optional except "which one is this about?". Blank answers never overwrite anything.

## Access, review, and the Change Log

- **Admins** (edit everything, approve reviews, get alerts): the core team. Their emails are kept out of the code: in the Apps Script editor, **Project settings → Script properties**, add `ADMIN_EMAILS` with the emails separated by commas. Editors-tab rows with role `admin` are admins too. **Set up sheet + forms** asks for them the first time. The map's name, state and pin box come from the site (`map.config.ts` → `<site>/region.json`); the menu's **Connect to the map's website** reads them again.
- **Point-people**: add a row on the **Editors** tab — their email, and the `org_ids` and/or `coalition_ids` they manage (comma-separated ids from the Organizations/Coalitions tabs). One person can manage several.
- **Anything not allowed** (unknown email, someone else's org, a new org) goes to **Needs Review** instead of the map, is flagged in **Change Log** (highlighted yellow for unauthorized attempts), and emails the admins. Tick **approve** to apply it. When a new org is approved, the person who proposed it becomes its point-person automatically.
- **Email verification** (Oct 23): a new organization always needs a verified (Google sign-in) email; one sent without it is held, and can't be approved either. A point person typed on the organization form becomes an editor straight away only when it's the submitter's own signed-in email. Any other address is added to **Editors** as `pending` (allowed nothing) and emailed a one-time link; opening it makes them an editor and applies anything of theirs that was waiting. The link uses the web app's address, so redeploy a **New version** after updating the script.
- **Change Log** has one row per submission: time, email, form, status (added / updated / removed / needs review / approved…), flag, and every field's old → new value — enough to undo anything by hand.

## 1. Add the script to the sheet

1. Make a new Google Sheet ([sheets.new](https://sheets.new)), named after your map.
2. **Extensions → Apps Script**. Delete what's in `Code.gs` and paste in the sheet script: your site's `setup.html` →
   **Copy the sheet script** (or open `<your site>/apps-script.txt`; it is [`Code.gs`](Code.gs) and
   [`Confirm.gs`](Confirm.gs) together, as built with your site). Click **Save**.
3. Close that tab and reload the sheet. A menu named after your map appears (before setup it's called
   "Climate Organization Map").

## 2. Build everything

1. Menu → **Set up sheet + forms (run once)**.
2. Approve the permission prompt (it creates forms, edits this sheet, sends review alerts, reads your site's settings,
   and looks up addresses for map pins). If Google says the app is unverified: **Advanced → Go to project (unsafe)**:
   it's your own script. If nothing more happens after approving, run the menu item again.
3. It asks for your map's web address (`https://<you>.github.io/<repo>/`, or your custom domain) and reads the map's
   name and state from it, then for the core team's emails (blank = just you).
4. When it finishes: the tabs exist (empty for a new map; a sheet rebuilt later starts from the site's nightly
   backup), the five forms exist and are shared with the core team, and their links are on **Start Here**.

Running it again is safe: it skips forms that already exist (only updating their titles) and never overwrites filled tabs.

## 3. Publish the live data link

1. In Apps Script: **Deploy → New deployment → Web app**. Execute as **Me**, access **Anyone**. Copy the URL.
2. It only serves public data and the forms' links — never Editors, Needs Review, Feedback, or Change Log.
3. **After changing `Code.gs` later:** the web app keeps serving the version it was deployed with. Go to **Deploy → Manage deployments → ✏️ → Version: New version → Deploy** (same URL) so the site sees the change.

## 4. Connect the website

Put the web app URL into `dataUrl` in [`map.config.ts`](../map.config.ts) and commit. That's all: the site reads the
forms' links and questions from the web app, so after a page reload the **+** button opens your forms, pre-filled with
whatever org or coalition is open. Approved edits show up within a minute of a reload.

## 5. GitHub Pages and the nightly backup

1. **Settings → Pages → Build and deployment → Source: GitHub Actions**. The site deploys from the default branch
   (`main`); a repository variable `DEPLOY_BRANCH` picks another (then allow that branch under **Settings →
   Environments → github-pages**).
2. The nightly backup (`.github/workflows/sync-data.yml`) reads `dataUrl` from `map.config.ts`, commits
   `public/data.json` when the data changed, and redeploys. Set the repository variable `DATA_SYNC_PR = true` to get a
   pull request instead. If **Actions → Nightly data snapshot** says it is disabled, click **Enable workflow**.

## Who owns an event or project

Pick an **Organization**, a **Coalition**, or both:
- Organization only → that org's own event/project.
- Coalition (with or without an org) → the coalition's, hosted by that org if one is picked.
- Neither → saved but kept off the map; Change Log flags it with ⚠.

To move an item from a coalition to an org only, clear its `coalition_id` cell in the sheet.

## Day to day

- Review **Needs Review** when the alert email arrives; tick **approve** or leave it (set `status` to `rejected` for your own records).
- Add point-people on **Editors**. Then run **MA Climate Organization Map → Refresh form dropdowns** if you edited orgs/events/projects by hand.
- When someone is added to **Editors**, anything of theirs waiting in Needs Review is re-checked and saved automatically.
- A pin in the wrong town? Event and project locations without a town (e.g. "George Sherman Hall, 2nd floor") are now placed using the host org's town, and matches outside Massachusetts are ignored. To fix pins saved before this change, run **MA Climate Organization Map → Re-check event and project pins**.
- To stop key questions being skipped, run **MA Climate Organization Map → Make key questions required** once (event: name, date, online?, free food, who can come; project: name, online?, free food, who can come, help wanted). Location stays optional because online events have none; an in-person event saved without one keeps its "needs info" note.
- New organizations from anyone who isn't an admin wait in **Needs Review**. Admins' new orgs are saved straight away.
- The 1–4 scores (`ej_focus`, `grassroots`, `policy_expertise`, `in_building`) and `coalition_weights` are core-team columns; no form changes them.

## Updating the forms

Run **MA Climate Organization Map → Update the forms** after pasting a new version of the script. It is safe to run again. It:
- renames the organization form's "Short description" to **Mission statement and description**. New organizations then show on the Topics page under the topics they tick.
- brings the feedback form's "Which part of the map" choices up to date (Topics page, voting districts, details panel, phone, and so on).
- adds links on the organization form's thank-you page to the project, event and action forms. A Google Form can't branch into another form, so this is how someone goes on from their organization to its projects.

## Edit links and emails to submitters

- Every **Edit** button on the map opens the right form with everything already filled in. People only change what's different, and blank answers still keep the current value. **Copy as a new event** fills in an existing event as a new one, leaving the date blank. If you add, rename or remove questions on a form, run **Refresh form dropdowns** from the menu: the site picks up the new question ids from the web app.
- Whoever submits a form gets a short email. It says either that the change is on the map, or that it's waiting for the map team (and a second one when it goes live). To turn these off, add the Script property `NOTIFY_SUBMITTERS` = `off`.

## Topics on the forms (Wikipedia-based or group-based)

Run **MA Climate Organization Map → Use Wikipedia-based topics on the forms (Turibius)** once (after the update is merged, so the script can fetch `research/topics/wiki/topics-merged.csv` from GitHub). It:
- fills the **Topics** tab with Turibius's list: the 13 seed topics plus every topic at lift ≥ 8 (about 2,800), each with its aliases, Wikidata id and seed;
- makes the seed topics (plus "Youth serving") the checkboxes on the organization, event and project forms;
- matches whatever people type in **More topics** against every topic name and alias (exact first, then close spellings). There are no Wikipedia lookups: the related wording is already in Turibius's aliases. Anything that matches nothing lands on **Unmatched Input** for the monthly review (**Add reviewed aliases from Unmatched Input**).

The map's Topics page picks up these tags straight away, under the right seed topic, even before the research files are rebuilt. To switch back, run **Go back to group-based topics on the forms**.

## Social justice groups (their own spreadsheet)

The social justice layers (Palestinian rights, immigrant rights, Jewish spiritual life, movement skills & culture) are kept out of this sheet so it stays about climate. They live in **MA Climate Organization Map: social justice groups** (in Nathan's Drive), with the same tabs and columns as this sheet; share it only with the people who manage those groups.

1. After pasting the new `Code.gs` and deploying a new version, run **MA Climate Organization Map → Link the social justice spreadsheet** and paste that sheet's link.
2. The web app then serves it at `<web app URL>?feed=social-justice`. The map only asks for it when someone switches a social justice layer on, and the **Social justice** settings only show for people who open the map with the secret link (`…/openthink_mycc/?sj`; `?sj=off` hides them again). Until it's linked, the map uses the copies in `public/sectors/`.
3. The nightly snapshot backs it up into `public/sectors/` too.

## Limits worth knowing

- Point-people need a Google account to sign in (they can make one for any email address).
- The access check stops mistakes and casual misuse; it is not bank-grade security. Anyone with edit access to the sheet can change anything, so keep the sheet shared only with the core team.
- Logos are submitted as links (Forms can't take uploads without extra setup). Google Drive share links are converted automatically.
- "Suggested connections" are only as good as the descriptions and topics groups fill in.

## Updating the data and adding the actions form later (existing sheet)

Use this when the repo has new events/projects/actions (from `node scripts/apply-current-events.mjs --csv DIR`) or a new form.

1. **Update the script.** Extensions → Apps Script → replace `Code.gs` with the repo's, **Save**. Then **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**.
2. **Replace the data tabs.** For each of **Projects**, **Events** and **Actions**: open the tab, **File → Import → Upload** the matching CSV, choose **Replace current sheet**. (This wipes the old placeholders. New columns such as `recurrence`, `needs_info`, `host_org_id`, `description` and `link` come in with the CSV.) Edits people already made through the forms live in these tabs, so export first if you need them.
3. **Build the new form.** Reload the sheet, then **MA Climate Organization Map → Set up sheet + forms**. It skips the forms that exist, adds the missing "action" form and the event form's repeat question, and refreshes every dropdown from the tabs.
4. **Connect the site.** Nothing to copy: once the web app is redeployed (New version), the site reads the new form's link from it, and the "Update this action" link opens the new form.

Anything a point person edits through a form clears that item's "needs more information" notice.

## Group Confirmation Screen (Oct 29)

Each group gets its own private link to a page that shows everything the map has for it: its details, events, projects and actions. The point person enters their name and email, then for each card chooses **Edit**, **Approve** or **Remove**. **Save for later** keeps their work; **Finalize and Submit** puts it on the map (approved items are marked verified, removed ones hidden, edits written in, every change in Change Log) and adds them as a point person (up to three per group, pending until they open the email confirmation link). If two people open the same card, the second sees who is editing it and can ask them to hand it over.

1. In Apps Script, add a second file: **+ → Script**, name it `Confirm`, and paste in [`Confirm.gs`](Confirm.gs). Save, then deploy a new version of the web app.
2. In the sheet: **menu → Make confirmation links (one private link per group)**. It makes a separate spreadsheet, shared only with the admins, with one row and link per group. Running it again only adds rows for new groups.
3. Send each group its link (column `link`). The `status` column shows not sent → opened → saved for later → submitted.

Anyone with a group's link can change that group's information, so send it only to the group. To cut off a link, delete its row (or change its token) in the links spreadsheet.

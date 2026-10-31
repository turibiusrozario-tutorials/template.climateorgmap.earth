// Your map's settings: the only file a new map has to edit (see README.md → "Start your own map").
// Edit it on GitHub: open this file → pencil icon (Edit) → change the values → Commit changes. The site rebuilds in
// about a minute; <your map's address>/setup.html shows what's left to do. Getting updates later never changes this
// file, so your settings are kept.
import type { MapConfig } from "./src/map-config";

export default {
  // Your map's name: page title, loading screen, top bar, form titles, emails and the sheet's menu.
  title: "Your State Climate Organization Map",

  // Your US state's two-letter code ("WI", "TX", "DC", "PR"). Sets where the geographic map opens, the main city
  // (where a group with no address yet is placed), the time zone and the state name.
  state: "",

  // Your land acknowledgement: on the loading screen and under "Land acknowledgement" in the menu.
  // Plain text; a blank line starts a new paragraph; HTML links (<a href="https://…">…</a>) work.
  landAcknowledgement: `
[Write your land acknowledgement here: whose land your team is on, and what you commit to.]

<strong>Whose land are you on?</strong> <a href="https://native-land.ca" target="_blank" rel="noopener noreferrer">Native Land Digital</a>
`,

  // Step 4 of the setup: your sheet's web app URL (ends in /exec). Leave "" until then.
  dataUrl: "",

  // Optional: shortTitle, timeZone, bounds, fallback, exampleTowns, exampleOrgs... (see src/map-config.ts).
} satisfies MapConfig;

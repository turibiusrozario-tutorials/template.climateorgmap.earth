// Your map's settings: the only file a new map has to edit (see README.md → "Start your own map").
// Edit it on GitHub: open this file → pencil icon (Edit) → change the values → Commit changes. The site rebuilds in
// about a minute. Getting updates later never changes this file, so your settings are kept.
import type { MapConfig } from "./src/map-config";

export default {
  // Your map's name: page title, loading screen, top bar, form titles, emails and the sheet's menu.
  title: "MA Climate Organization Map",

  // Your US state's two-letter code ("WI", "TX", "DC", "PR"). Sets where the geographic map opens, the main city
  // (where a group with no address yet is placed), the time zone and the state name.
  state: "MA",

  // Your land acknowledgement: on the loading screen and under "Land acknowledgement" in the menu.
  // Plain text; a blank line starts a new paragraph; HTML links (<a href="https://…">…</a>) work.
  landAcknowledgement: `
<p>This platform was designed in Natick, Cambridge, and Boston, MA&mdash;on the ancestral homelands of the Massachusett, Nipmuc and Wampanoag peoples.</p>
<p>It was built with the help of Claude (AI), which was built on land seized from the Ramaytush Ohlone (San Francisco), and taken from the Duwamish and Suquamish (Seattle) and Lenape (New York) peoples. It runs on data centers in the stolen homeland of the Pokagon Potawatomi in Indiana, and other places whose names we don't yet know. We honor these first peoples, and the lands and waters they have cared for over countless generations.</p>
<p>With respect and gratitude, we receive the many gifts of the Earth along with the great labors of our sisters and brothers across the planet: including minerals in our computer chips mined by slaves, water extracted for cooling data centers, and the electricity generated from coal, gas, wind, and sunlight that powers this platform.</p>
<p>We acknowledge the harm woven into this, and commit to its repair, beginning with the return of land to Indigenous peoples and the freedom of enslaved people everywhere.</p>
<p>This platform is dedicated to all of our ancestors, all of our future ancestors, and to the welfare and benefit of all life on Earth.</p>
<p class="land-links"><strong>Whose land are you on?</strong> <a href="https://native-land.ca" target="_blank" rel="noopener noreferrer">Native Land Digital</a><br>
  <strong>Give back:</strong> <a href="https://www.realrentduwamish.org" target="_blank" rel="noopener noreferrer">Real Rent Duwamish</a>,
  <a href="https://www.ramaytush.org/donate.html" target="_blank" rel="noopener noreferrer">Association of Ramaytush Ohlone</a>,
  <a href="https://thelenapecenter.com" target="_blank" rel="noopener noreferrer">Lenape Center</a><br>
  <strong>Learn more:</strong> <a href="https://www.pokagonband-nsn.gov" target="_blank" rel="noopener noreferrer">Pokagon Band of Potawatomi</a>
</p>
`,

  // Step 3 of the setup: your sheet's web app URL (ends in /exec). Leave "" until then.
  dataUrl: "https://script.google.com/macros/s/AKfycbwj2109KXf2Ndv-0ZCHp0a6MH3aVSejxkqofBOfOFHRSvMi61DXjkeIe25OlsHNbs5S/exec",

  // ---- Optional. Leave these out to use your state's defaults (see src/map-config.ts for every option).
  shortTitle: "MA Climate Map",
  bounds: [[41.45, -73.55], [42.95, -69.85]],
  exampleTowns: "Worcester, Cape Cod, Greater Boston, statewide",
  exampleOrgs: ["Sunrise Boston — monthly", "Mass Power Forward — a few times a year"],
  extraMaps: true,
} satisfies MapConfig;

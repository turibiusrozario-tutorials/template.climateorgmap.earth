// Turns map.config.ts (the one file a new map edits) into the full region settings the site and the sheet script
// use. Anything left out of map.config.ts comes from the state's preset (src/us-states.ts) or a sensible default,
// so adding a new setting here never means editing every map's config file (which would make updates conflict).
import { US_STATES } from "./us-states";

export type LatLngBox = [[number, number], [number, number]];

/** What map.config.ts may set. Only `title`, `state` and `landAcknowledgement` are needed to start. */
export interface MapConfig {
  /** The map's full name: page title, loading screen, top bar, form titles, emails, the sheet's menu. */
  title: string;
  /** Two-letter US state code ("WI"), "DC" or "PR". Leave "" for a region that isn't one state (then set bounds + fallback). */
  state: string;
  /** Shown on the loading screen and in the menu. Plain text: a blank line starts a new paragraph. HTML links work. */
  landAcknowledgement: string;
  /** The sheet's web app URL (…/exec), from Deploy → New deployment → Web app. "" until then: the map shows public/data.json. */
  dataUrl: string;

  // ---- optional: leave out to use the state's preset
  /** Shown only where the full title won't fit (narrow phones). Default: "<state> Climate Map". */
  shortTitle?: string;
  /** Default: the state's name. */
  stateName?: string;
  /** Time zone of the map's events (calendar links). Default: the state capital's. */
  timeZone?: string;
  /** Where the geographic map opens: [[south, west], [north, east]]. Default: the whole state. */
  bounds?: LatLngBox;
  /** Where a group with no address yet is placed. Default: the state capital. */
  fallback?: { lat: number; lng: number; town: string };
  /** Bundled geography in public/geo/ (town outlines, districts) by prefix. Default: the state's files if the repo has them ("ma", "or"). */
  geo?: string[];
  /** Hint on the organization form's "Town or region" question. Default: "<capital>, statewide". */
  exampleTowns?: string;
  /** Hint on the form's "Who do you work with" question: "Name — how often". */
  exampleOrgs?: string[];
  /** Also show the researched Vermont / Oregon / USA maps (?map=vt|or|us). Only the original MA map uses these. */
  extraMaps?: boolean;
}

export interface Region {
  title: string;
  short: string;
  stateName: string;
  stateCode: string;
  timeZone: string;
  geo: string[];
  bounds: LatLngBox;
  fallback: { lat: number; lng: number; town: string };
  extraMaps: boolean;
  dataUrl: string;
  landHtml: string;
  exampleTowns: string;
  exampleOrgs: string[];
  /** A slightly larger box than the state, for the sheet script's "is this pin in the region?" check. */
  checkBounds: { south: number; west: number; north: number; east: number };
}

/** Geography files that ship in public/geo/ (see src/geodata.ts). */
const BUNDLED_GEO = ["ma", "or"];
/** The contiguous US, for a map that names no state. */
const US_BOUNDS: LatLngBox = [[24.4, -124.8], [49.4, -66.9]];

/** Plain text → paragraphs; text that already has <p> tags is used as it is. */
export function landHtml(text: string): string {
  const t = (text || "").trim();
  if (!t) return "";
  if (/<p[\s>]/i.test(t)) return t;
  return t.split(/\n\s*\n/).map((p) => `<p>${p.trim().replace(/\n/g, "<br>")}</p>`).join("\n");
}

export function resolveRegion(c: MapConfig): Region {
  const code = (c.state || "").trim().toUpperCase();
  const st = US_STATES[code];
  const stateName = c.stateName ?? st?.name ?? "";
  const title = (c.title || "").trim() || (stateName ? `${stateName} Climate Organization Map` : "Climate Organization Map");
  const bounds = c.bounds ?? st?.bounds ?? US_BOUNDS;
  const fallback = c.fallback ?? (st ? { lat: st.lat, lng: st.lng, town: st.city } : { lat: (bounds[0][0] + bounds[1][0]) / 2, lng: (bounds[0][1] + bounds[1][1]) / 2, town: "" });
  const box = st?.bounds ?? bounds;
  const pad = 0.1;
  const r2 = (x: number) => Math.round(x * 100) / 100;
  return {
    title,
    short: c.shortTitle || (code ? `${code} Climate Map` : title),
    stateName,
    stateCode: code,
    timeZone: c.timeZone ?? st?.timeZone ?? "America/New_York",
    geo: c.geo ?? (BUNDLED_GEO.includes(code.toLowerCase()) ? [code.toLowerCase()] : []),
    bounds,
    fallback,
    extraMaps: c.extraMaps ?? false,
    dataUrl: (c.dataUrl || "").trim(),
    landHtml: landHtml(c.landAcknowledgement),
    exampleTowns: c.exampleTowns ?? (fallback.town ? `${fallback.town}, statewide` : "a town or region, statewide"),
    exampleOrgs: c.exampleOrgs ?? ["Sunrise Movement — monthly", "Sierra Club — a few times a year"],
    checkBounds: { south: r2(box[0][0] - pad), west: r2(box[0][1] - pad), north: r2(box[1][0] + pad), east: r2(box[1][1] + pad) },
  };
}

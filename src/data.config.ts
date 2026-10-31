// Where the site loads its data from.
//
// LIVE_DATA_URL: the Google Apps Script web app URL, set as `dataUrl` in map.config.ts.
// When set, the site shows the sheet's current data, so approved form edits appear
// without anyone touching code. If it's empty or unreachable, the site falls back to
// the snapshot in public/data.json (refreshed nightly by .github/workflows/sync-data.yml).
import { REGION } from "./region.config";

export const LIVE_DATA_URL = REGION.dataUrl;

export const SNAPSHOT_URL = `${import.meta.env.BASE_URL}data.json`;

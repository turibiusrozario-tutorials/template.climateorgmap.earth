// The region this copy of the map covers. Set in map.config.ts (the one file a new map edits); this file fills in
// the rest from the state's preset (src/map-config.ts, src/us-states.ts). Don't edit it for your own map: updates
// may change it.
import MAP from "../map.config";
import { resolveRegion } from "./map-config";

export const REGION = resolveRegion(MAP);

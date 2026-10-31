// US states (plus DC and Puerto Rico): what map.config.ts fills in from the two-letter `state` code.
//   bounds: the state's bounding box [[south, west], [north, east]], from the US Census Bureau's 1:10m state outlines
//           (us-atlas 3.0.1); Alaska's Aleutians past 180° are cut at -180.
//   city / lat / lng: the state capital, where a group with no address yet is placed. Each one was checked to lie
//           inside its own state's outline, and every time zone against the IANA list (the capital's zone).
// Any of these can be overridden in map.config.ts.

export interface StatePreset {
  name: string;
  city: string;
  lat: number;
  lng: number;
  timeZone: string;
  bounds: [[number, number], [number, number]];
}

export const US_STATES: Record<string, StatePreset> = {
  AL: { name: "Alabama", city: "Montgomery", lat: 32.3792, lng: -86.3077, timeZone: "America/Chicago", bounds: [[30.22, -88.47], [35.01, -84.89]] },
  AK: { name: "Alaska", city: "Juneau", lat: 58.3019, lng: -134.4197, timeZone: "America/Juneau", bounds: [[51.23, -180], [71.35, -129.98]] },
  AZ: { name: "Arizona", city: "Phoenix", lat: 33.4484, lng: -112.074, timeZone: "America/Phoenix", bounds: [[31.33, -114.81], [37, -109.04]] },
  AR: { name: "Arkansas", city: "Little Rock", lat: 34.7465, lng: -92.2896, timeZone: "America/Chicago", bounds: [[33, -94.62], [36.5, -89.66]] },
  CA: { name: "California", city: "Sacramento", lat: 38.5816, lng: -121.4944, timeZone: "America/Los_Angeles", bounds: [[32.53, -124.41], [42.01, -114.13]] },
  CO: { name: "Colorado", city: "Denver", lat: 39.7392, lng: -104.9903, timeZone: "America/Denver", bounds: [[36.99, -109.06], [41, -102.04]] },
  CT: { name: "Connecticut", city: "Hartford", lat: 41.7658, lng: -72.6734, timeZone: "America/New_York", bounds: [[40.98, -73.73], [42.05, -71.79]] },
  DE: { name: "Delaware", city: "Dover", lat: 39.1582, lng: -75.5244, timeZone: "America/New_York", bounds: [[38.45, -75.79], [39.84, -75.05]] },
  DC: { name: "District of Columbia", city: "Washington", lat: 38.9072, lng: -77.0369, timeZone: "America/New_York", bounds: [[38.79, -77.12], [38.99, -76.91]] },
  FL: { name: "Florida", city: "Tallahassee", lat: 30.4383, lng: -84.2807, timeZone: "America/New_York", bounds: [[24.51, -87.63], [31, -80.03]] },
  GA: { name: "Georgia", city: "Atlanta", lat: 33.749, lng: -84.388, timeZone: "America/New_York", bounds: [[30.36, -85.61], [35, -80.84]] },
  HI: { name: "Hawaii", city: "Honolulu", lat: 21.3069, lng: -157.8583, timeZone: "Pacific/Honolulu", bounds: [[18.92, -160.25], [22.23, -154.81]] },
  ID: { name: "Idaho", city: "Boise", lat: 43.615, lng: -116.2023, timeZone: "America/Boise", bounds: [[41.99, -117.24], [49, -111.04]] },
  IL: { name: "Illinois", city: "Springfield", lat: 39.7817, lng: -89.6501, timeZone: "America/Chicago", bounds: [[36.97, -91.51], [42.51, -87.49]] },
  IN: { name: "Indiana", city: "Indianapolis", lat: 39.7684, lng: -86.1581, timeZone: "America/Indiana/Indianapolis", bounds: [[37.77, -88.1], [41.76, -84.78]] },
  IA: { name: "Iowa", city: "Des Moines", lat: 41.5868, lng: -93.625, timeZone: "America/Chicago", bounds: [[40.38, -96.63], [43.5, -90.14]] },
  KS: { name: "Kansas", city: "Topeka", lat: 39.0473, lng: -95.6752, timeZone: "America/Chicago", bounds: [[36.99, -102.05], [40, -94.59]] },
  KY: { name: "Kentucky", city: "Frankfort", lat: 38.2009, lng: -84.8733, timeZone: "America/New_York", bounds: [[36.5, -89.57], [39.15, -81.97]] },
  LA: { name: "Louisiana", city: "Baton Rouge", lat: 30.4515, lng: -91.1871, timeZone: "America/Chicago", bounds: [[28.93, -94.04], [33.02, -88.82]] },
  ME: { name: "Maine", city: "Augusta", lat: 44.3106, lng: -69.7795, timeZone: "America/New_York", bounds: [[43.06, -71.08], [47.46, -66.98]] },
  MD: { name: "Maryland", city: "Annapolis", lat: 38.9784, lng: -76.4922, timeZone: "America/New_York", bounds: [[37.92, -79.49], [39.72, -75.05]] },
  MA: { name: "Massachusetts", city: "Boston", lat: 42.3601, lng: -71.0589, timeZone: "America/New_York", bounds: [[41.24, -73.51], [42.89, -69.93]] },
  MI: { name: "Michigan", city: "Lansing", lat: 42.7325, lng: -84.5555, timeZone: "America/Detroit", bounds: [[41.7, -90.42], [48.19, -82.42]] },
  MN: { name: "Minnesota", city: "Saint Paul", lat: 44.9537, lng: -93.09, timeZone: "America/Chicago", bounds: [[43.5, -97.24], [49.38, -89.49]] },
  MS: { name: "Mississippi", city: "Jackson", lat: 32.2988, lng: -90.1848, timeZone: "America/Chicago", bounds: [[30.18, -91.64], [35, -88.1]] },
  MO: { name: "Missouri", city: "Jefferson City", lat: 38.5767, lng: -92.1735, timeZone: "America/Chicago", bounds: [[36, -95.77], [40.61, -89.1]] },
  MT: { name: "Montana", city: "Helena", lat: 46.5891, lng: -112.0391, timeZone: "America/Denver", bounds: [[44.36, -116.05], [49, -104.04]] },
  NE: { name: "Nebraska", city: "Lincoln", lat: 40.8136, lng: -96.7026, timeZone: "America/Chicago", bounds: [[40, -104.05], [43, -95.31]] },
  NV: { name: "Nevada", city: "Carson City", lat: 39.1638, lng: -119.7674, timeZone: "America/Los_Angeles", bounds: [[35, -120.01], [42, -114.04]] },
  NH: { name: "New Hampshire", city: "Concord", lat: 43.2081, lng: -71.5376, timeZone: "America/New_York", bounds: [[42.7, -72.56], [45.31, -70.7]] },
  NJ: { name: "New Jersey", city: "Trenton", lat: 40.2206, lng: -74.7597, timeZone: "America/New_York", bounds: [[38.93, -75.56], [41.36, -73.89]] },
  NM: { name: "New Mexico", city: "Santa Fe", lat: 35.687, lng: -105.9378, timeZone: "America/Denver", bounds: [[31.33, -109.05], [37, -103]] },
  NY: { name: "New York", city: "Albany", lat: 42.6526, lng: -73.7562, timeZone: "America/New_York", bounds: [[40.5, -79.76], [45.02, -71.86]] },
  NC: { name: "North Carolina", city: "Raleigh", lat: 35.7796, lng: -78.6382, timeZone: "America/New_York", bounds: [[33.85, -84.32], [36.59, -75.46]] },
  ND: { name: "North Dakota", city: "Bismarck", lat: 46.8083, lng: -100.7837, timeZone: "America/Chicago", bounds: [[45.93, -104.05], [49, -96.56]] },
  OH: { name: "Ohio", city: "Columbus", lat: 39.9612, lng: -82.9988, timeZone: "America/New_York", bounds: [[38.41, -84.82], [41.98, -80.52]] },
  OK: { name: "Oklahoma", city: "Oklahoma City", lat: 35.4676, lng: -97.5164, timeZone: "America/Chicago", bounds: [[33.62, -103], [37, -94.43]] },
  OR: { name: "Oregon", city: "Salem", lat: 44.9429, lng: -123.0351, timeZone: "America/Los_Angeles", bounds: [[41.99, -124.55], [46.27, -116.46]] },
  PA: { name: "Pennsylvania", city: "Harrisburg", lat: 40.2732, lng: -76.8867, timeZone: "America/New_York", bounds: [[39.72, -80.52], [42.27, -74.7]] },
  RI: { name: "Rhode Island", city: "Providence", lat: 41.824, lng: -71.4128, timeZone: "America/New_York", bounds: [[41.15, -71.86], [42.02, -71.12]] },
  SC: { name: "South Carolina", city: "Columbia", lat: 34.0007, lng: -81.0348, timeZone: "America/New_York", bounds: [[32.03, -83.35], [35.22, -78.54]] },
  SD: { name: "South Dakota", city: "Pierre", lat: 44.3683, lng: -100.351, timeZone: "America/Chicago", bounds: [[42.48, -104.06], [45.95, -96.44]] },
  TN: { name: "Tennessee", city: "Nashville", lat: 36.1627, lng: -86.7816, timeZone: "America/Chicago", bounds: [[34.98, -90.31], [36.68, -81.65]] },
  TX: { name: "Texas", city: "Austin", lat: 30.2672, lng: -97.7431, timeZone: "America/Chicago", bounds: [[25.84, -106.65], [36.5, -93.52]] },
  UT: { name: "Utah", city: "Salt Lake City", lat: 40.7608, lng: -111.891, timeZone: "America/Denver", bounds: [[37, -114.05], [42, -109.04]] },
  VT: { name: "Vermont", city: "Montpelier", lat: 44.2601, lng: -72.5754, timeZone: "America/New_York", bounds: [[42.73, -73.44], [45.02, -71.49]] },
  VA: { name: "Virginia", city: "Richmond", lat: 37.5407, lng: -77.436, timeZone: "America/New_York", bounds: [[36.54, -83.68], [39.47, -75.24]] },
  WA: { name: "Washington", city: "Olympia", lat: 47.0379, lng: -122.9007, timeZone: "America/Los_Angeles", bounds: [[45.54, -124.73], [49, -116.92]] },
  WV: { name: "West Virginia", city: "Charleston", lat: 38.3498, lng: -81.6326, timeZone: "America/New_York", bounds: [[37.2, -82.64], [40.64, -77.72]] },
  WI: { name: "Wisconsin", city: "Madison", lat: 43.0731, lng: -89.4012, timeZone: "America/Chicago", bounds: [[42.49, -92.89], [47.08, -86.82]] },
  WY: { name: "Wyoming", city: "Cheyenne", lat: 41.14, lng: -104.8202, timeZone: "America/Denver", bounds: [[41, -111.06], [45.01, -104.05]] },
  PR: { name: "Puerto Rico", city: "San Juan", lat: 18.4655, lng: -66.1057, timeZone: "America/Puerto_Rico", bounds: [[17.91, -67.94], [18.52, -65.22]] },
};

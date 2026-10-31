// Tests the parts of apps-script/Code.gs that let a new map run it unedited:
//  1. with no region saved, it uses neutral defaults (and starts the sheet empty)
//  2. connectSite_ reads <site>/region.json and saves it; a bad address changes nothing
//  3. formFields_ finds every question's entry id from pre-filled links (what the site needs to pre-fill forms)
//  4. long script properties are split and joined back exactly
//  5. the web app serves the saved forms with the data
// Run: npm run test:apps-script
const fs = require("fs");
const vm = require("vm");
const path = require("path");
const assert = require("assert");
const ROOT = path.resolve(__dirname, "..");
const CODE = fs.readFileSync(path.join(ROOT, "apps-script/Code.gs"), "utf8");

function load(props, fetchMap = {}) {
  const fetched = [];
  const ctx = {
    console, Math, Date, JSON, String, Number, Array, Object, RegExp, isNaN, decodeURIComponent,
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (k in props ? props[k] : null), setProperty: (k, v) => (props[k] = String(v)), deleteProperty: (k) => delete props[k] }) },
    UrlFetchApp: {
      fetch: (url) => {
        fetched.push(url);
        const body = fetchMap[url];
        return { getResponseCode: () => (body === undefined ? 404 : 200), getContentText: () => (body === undefined ? "Not found" : body) };
      },
    },
  };
  vm.createContext(ctx);
  vm.runInContext(CODE, ctx);
  return { ctx, G: (name) => vm.runInContext(name, ctx), fetched };
}

// 1. defaults
{
  const { G } = load({});
  assert.equal(G("REGION").title, "Climate Organization Map");
  assert.equal(G("REGION").stateName, "");
  assert.equal(G("SEED_URL"), "", "a new sheet starts empty until it knows its site");
  assert.equal(G("MA_RESEARCH"), false, "MA-only menu items hidden");
  assert.deepEqual(G("geocodeQueries_")("George Sherman Hall", ""), ["George Sherman Hall"], "no state to add");
  assert.ok(G("inMass_")(10, 10), "no box: every pin is accepted");
  console.log("template: defaults OK");
}

// 2. connect to the site
{
  const region = {
    title: "WI Climate Organization Map", short: "WI Climate Map", stateName: "Wisconsin", stateCode: "WI",
    bounds: { south: 42.39, west: -92.99, north: 47.18, east: -86.72 }, center: { lat: 43.0731, lng: -89.4012 }, town: "Madison",
    exampleTowns: "Madison, statewide", exampleOrgs: ["A — monthly"], dataUrl: "",
  };
  const props = {};
  const { G, fetched } = load(props, { "https://someone.github.io/wi-map/region.json": JSON.stringify(region) });
  assert.match(G("connectSite_")("https://bad.example/"), /Could not read https:\/\/bad\.example\/region\.json/);
  assert.equal(props.SITE_URL, undefined, "a failed address isn't kept");
  assert.equal(G("connectSite_")("someone.github.io/wi-map"), "");
  assert.equal(props.SITE_URL, "someone.github.io/wi-map");
  assert.equal(G("siteUrl_")(), "https://someone.github.io/wi-map/");
  assert.equal(fetched.at(-1), "https://someone.github.io/wi-map/region.json");
  assert.equal(G("REGION").title, "WI Climate Organization Map");
  assert.equal(JSON.parse(props.REGION_JSON).stateName, "Wisconsin");
  // a fresh run (every trigger reloads the script) picks the saved region and the site's backup as its seed
  const again = load(props);
  assert.equal(again.G("REGION").stateCode, "WI");
  assert.equal(again.G("SEED_URL"), "https://someone.github.io/wi-map/data.json");
  assert.deepEqual(again.G("geocodeQueries_")("Overture Center", ""), ["Overture Center, Wisconsin"]);
  assert.ok(again.G("VAGUE_PLACE").test("Wisconsin") && again.G("VAGUE_PLACE").test("statewide"));
  assert.ok(!again.G("inMass_")(42.36, -71.06), "a Boston pin is outside Wisconsin");
  assert.match(again.G("feedbackDesc_")(), /WI Climate Organization Map did/);
  assert.equal(again.G("startText_")()[0][0], "WI Climate Organization Map data");
  console.log("template: connect to the site OK");
}

// 3. question ids from pre-filled links
{
  const { ctx, G } = load({});
  const T = { TEXT: "TEXT", PARAGRAPH_TEXT: "PARAGRAPH_TEXT", MULTIPLE_CHOICE: "MC", LIST: "LIST", CHECKBOX: "CHECKBOX", SCALE: "SCALE", DATE: "DATE", TIME: "TIME", PAGE_BREAK: "PAGE_BREAK", SECTION_HEADER: "SECTION_HEADER" };
  ctx.FormApp = { ItemType: T };
  let calls = 0;
  const choiceItem = (choices) => ({ getChoices: () => choices.map((c) => ({ getValue: () => c })), createResponse: (v) => ({ v }) });
  const mk = (id, type, title, choices) => {
    const r = (v) => ({ id, v: Array.isArray(v) ? v[0] : v instanceof Date ? "2000-01-01" : typeof v === "number" ? "10:00" : v });
    const ci = choiceItem(choices || []);
    const item = { getType: () => type, getTitle: () => title, createResponse: r };
    return {
      ...item,
      asTextItem: () => item, asParagraphTextItem: () => item, asDateItem: () => item,
      asTimeItem: () => ({ createResponse: (h, m) => ({ id, v: `${h}:${m}` }) }),
      asScaleItem: () => ({ getLowerBound: () => 1, createResponse: (v) => ({ id, v: String(v) }) }),
      asListItem: () => ({ ...ci, createResponse: r }), asMultipleChoiceItem: () => ({ ...ci, createResponse: r }), asCheckboxItem: () => ({ ...ci, createResponse: r }),
    };
  };
  const items = [
    mk(11, T.TEXT, "Which event is this about?"),
    mk(12, T.SECTION_HEADER, "Details"),
    mk(13, T.TEXT, "Event name"),
    mk(14, T.PARAGRAPH_TEXT, "Event description"),
    mk(15, T.DATE, "Date"),
    mk(16, T.TIME, "Start time"),
    mk(17, T.MULTIPLE_CHOICE, "Is this online or remote?", ["Yes", "No"]),
    mk(18, T.MULTIPLE_CHOICE, "Is free food provided?", ["Yes", "No"]),
    mk(19, T.MULTIPLE_CHOICE, "Are you looking for help with this?", ["Yes", "No"]),
    mk(20, T.CHECKBOX, "Climate topic tags", ["Clean energy", "Transit"]),
    mk(21, T.LIST, "Coalition", ["— None —", "Mass Power Forward (MPF)"]),
    mk(22, T.TEXT, "Event name"), // a repeated title: the first one wins
  ];
  const form = {
    getItems: () => items,
    createResponse() {
      const rs = [];
      return {
        withItemResponse(r) { rs.push(r); return this; },
        toPrefilledUrl() { calls++; return "https://docs.google.com/forms/d/e/X/viewform?usp=pp_url&" + rs.map((r) => `entry.${r.id * 100}=${encodeURIComponent(r.v).replace(/%20/g, "+")}`).join("&"); },
      };
    },
  };
  const f = G("formFields_")(form);
  assert.equal(f["Event name"].entry, "entry.1300");
  assert.equal(f["Event description"].type, 1);
  assert.equal(f["Date"].entry, "entry.1500"); assert.equal(f["Date"].type, 9);
  assert.equal(f["Start time"].entry, "entry.1600"); assert.equal(f["Start time"].type, 10);
  assert.equal(f["Is this online or remote?"].entry, "entry.1700");
  assert.equal(f["Is free food provided?"].entry, "entry.1800");
  assert.equal(f["Are you looking for help with this?"].entry, "entry.1900", "third yes/no question found with its own link");
  assert.deepEqual(f["Climate topic tags"].choices, ["Clean energy", "Transit"]);
  assert.equal(f["Coalition"].type, 3);
  assert.ok(!f.Details, "headers are skipped");
  assert.equal(Object.keys(f).length, 10);
  assert.ok(calls <= 5, `few pre-filled links (${calls})`);
  // known ids are kept, so refreshing the dropdowns makes no links at all
  calls = 0;
  const again = G("formFields_")(form, f);
  assert.deepEqual(JSON.parse(JSON.stringify(again)), JSON.parse(JSON.stringify(f)));
  assert.equal(calls, 0);
  console.log("template: form question ids OK");
}

// 4. long properties
{
  const props = {};
  const { G } = load(props);
  const long = JSON.stringify({ x: "➕ Add a new event — ".repeat(800) });
  G("setLongProp_")("BIG", long);
  assert.ok(Number(props.BIG_N) > 1);
  assert.ok(Object.keys(props).filter((k) => k.startsWith("BIG_")).every((k) => k === "BIG_N" || props[k].length <= 3000));
  assert.equal(G("getLongProp_")("BIG"), long);
  G("setLongProp_")("BIG", "short");
  assert.equal(G("getLongProp_")("BIG"), "short");
  assert.equal(props.BIG_N, "1");
  assert.ok(!("BIG_1" in props), "old parts removed");
  console.log("template: long properties OK");
}

// 5. the web app serves the saved forms
{
  const props = {};
  const { ctx, G } = load(props);
  const forms = { links: { org: { url: "https://docs.google.com/forms/d/e/O/viewform", orgEntry: "entry.1" } }, fields: { org: { "Organization name": { entry: "entry.2", type: 0 } } } };
  G("setLongProp_")("SITE_FORMS", JSON.stringify(forms));
  ctx.readAll_ = () => ({ coalitions: [], orgs: [], connections: [], projects: [], events: [], actions: [], editors: [], topics: [] });
  ctx.buildDataFile_ = () => ({ coalitions: [], organizations: [], edges: [] });
  ctx.ContentService = { MimeType: { JSON: "json" }, createTextOutput: (t) => ({ setMimeType: () => t }) };
  const out = JSON.parse(G("doGet")({ parameter: {} }));
  assert.deepEqual(out.forms, forms);
  assert.equal(out.script_hash, "dev", "a script pasted from the repo says so");
  console.log("template: web app serves the forms OK");
}

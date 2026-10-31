import { defineConfig, type Plugin } from "vite";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import MAP from "./map.config";
import { resolveRegion } from "./src/map-config";

const REGION = resolveRegion(MAP);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Each build writes dist/version.json: the release tag (e.g. v1.2.0, or the commit when there is no tag yet),
 *  the commit and when it was built, so anyone can tell which version is live (<site>/version.json). */
function versionFile(): Plugin {
  const git = (cmd: string) => {
    try {
      return execSync(`git ${cmd}`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    } catch {
      return "";
    }
  };
  return {
    name: "version-json",
    apply: "build",
    generateBundle() {
      const commit = process.env.GITHUB_SHA || git("rev-parse HEAD");
      const tag = (process.env.GITHUB_REF_TYPE === "tag" && process.env.GITHUB_REF_NAME) || git("describe --tags --always");
      this.emitFile({
        type: "asset",
        fileName: "version.json",
        source: JSON.stringify({ version: tag || commit.slice(0, 7) || "dev", commit, built_at: new Date().toISOString() }, null, 2) + "\n",
      });
    },
  };
}

/**
 * map.config.ts → the page: the title and land acknowledgement go into index.html, and each build writes
 *  - region.json: the region settings the sheet script reads (apps-script/Code.gs → "Connect to the map"), and the
 *    repo it was built from (for setup.html's edit links);
 *  - apps-script.txt: Code.gs + Confirm.gs as one file, to paste into the sheet's Apps Script (always the version
 *    that matches this build).
 */
function mapConfig(): Plugin {
  return {
    name: "map-config",
    transformIndexHtml(html) {
      return html.replace(/%MAP_TITLE%/g, esc(REGION.title)).replace("%LAND_ACKNOWLEDGEMENT%", REGION.landHtml);
    },
    generateBundle() {
      const repo = process.env.GITHUB_REPOSITORY || "";
      const branch = process.env.GITHUB_REF_TYPE === "branch" ? process.env.GITHUB_REF_NAME || "" : "";
      const region = {
        title: REGION.title,
        short: REGION.short,
        stateName: REGION.stateName,
        stateCode: REGION.stateCode,
        timeZone: REGION.timeZone,
        bounds: REGION.checkBounds,
        center: { lat: REGION.fallback.lat, lng: REGION.fallback.lng },
        town: REGION.fallback.town,
        exampleTowns: REGION.exampleTowns,
        exampleOrgs: REGION.exampleOrgs,
        dataUrl: REGION.dataUrl,
        hasLandAcknowledgement: !!REGION.landHtml && !/\[write your land acknowledgement/i.test(REGION.landHtml),
        repo,
        branch,
      };
      const script = ["apps-script/Code.gs", "apps-script/Confirm.gs"]
        .map((f) => `// ===== ${f} =====\n` + readFileSync(f, "utf8"))
        .join("\n\n");
      const scriptHash = createHash("sha256").update(script).digest("hex").slice(0, 12);
      this.emitFile({ type: "asset", fileName: "region.json", source: JSON.stringify({ ...region, scriptHash }, null, 2) + "\n" });
      this.emitFile({ type: "asset", fileName: "apps-script.txt", source: script.replace("var SCRIPT_HASH = 'dev';", `var SCRIPT_HASH = '${scriptHash}';`) });
    },
  };
}

export default defineConfig({
  // Relative base so the built site works on GitHub Pages (served from /<repo>/)
  base: "./",
  plugins: [versionFile(), mapConfig()],
  server: {
    port: 5173,
    strictPort: false,
  },
});

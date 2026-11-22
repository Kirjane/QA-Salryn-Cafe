import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

let failures = 0;
function check(cond, msg) {
  if (cond) {
    console.log(`[PASS] ${msg}`);
  } else {
    console.error(`[FAIL] ${msg}`);
    failures++;
  }
}

// 1. Manifest & PNG hash integrity
const manifest = JSON.parse(fs.readFileSync(path.join(root, "data", "screens.json"), "utf8"));
const screens = manifest.screens || [];
check(screens.length === 80, `Registry contains 80 entries (74 original captures + 6 explicit missing/human-required)`);

const captured = screens.filter((s) => s.image !== null);
const missing = screens.filter((s) => s.image === null);
const dupes = captured.filter((s) => s.duplicateOf !== null);
check(captured.length === 74, `74 original capture entries preserved 1:1 (actual: ${captured.length})`);
check(missing.length === 6, `6 explicit MISSING_CAPTURE / HUMAN_REQUIRED entries documented (actual: ${missing.length})`);
check(dupes.length === 1 && dupes[0].id === "CEN-03" && dupes[0].duplicateOf === "CEN-02", `Exact byte-identical duplicate CEN-03 == CEN-02 documented`);

const uniqueFiles = new Set();
let hashMismatches = 0;
let brokenPaths = 0;
for (const s of captured) {
  const full = path.join(root, s.image);
  if (!fs.existsSync(full)) {
    brokenPaths++;
    continue;
  }
  uniqueFiles.add(s.image);
  const actualHash = crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex");
  if (actualHash !== s.hash) hashMismatches++;
}
check(brokenPaths === 0, `Zero broken screenshot paths in manifest`);
check(hashMismatches === 0, `All ${captured.length} captured entries match exact on-disk SHA-256 hashes`);
check(uniqueFiles.size === 73, `73 unique PNG binaries published under assets/screenshots/`);

// 2. Non-generic WHAT / WHY / SHOULD completeness
const observedSet = new Set();
const purposeSet = new Set();
let weakDescriptions = 0;
let missingRoute = 0;
for (const s of screens) {
  if (!s.observed || s.observed.length < 60) weakDescriptions++;
  if (!s.purpose || s.purpose.length < 40) weakDescriptions++;
  if (!s.expected || s.expected.length < 50) weakDescriptions++;
  if (!Array.isArray(s.testSteps) || s.testSteps.length === 0) weakDescriptions++;
  if (!s.sandboxRoute) missingRoute++;
  observedSet.add(s.observed);
  purposeSet.add(s.purpose);
}
check(weakDescriptions === 0, `All 80 entries have complete non-empty WHAT / WHY / SHOULD descriptions and test steps`);
check(observedSet.size === 80, `All 80 WHAT IS THERE descriptions are unique (zero copy-paste boilerplate)`);
check(purposeSet.size === 80, `All 80 WHY IT IS THERE descriptions are unique`);
check(missingRoute === 0, `All 80 entries map to an explicit sandboxRoute`);

// 3. Baseline PR #1 preservation & security / zero-backend guardrails
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const configJs = fs.readFileSync(path.join(root, "config.js"), "utf8");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");
const visualJs = fs.readFileSync(path.join(root, "visual-review.js"), "utf8");
const sandboxJs = fs.readFileSync(path.join(root, "sandbox.js"), "utf8");

check(fs.existsSync(path.join(root, "assets", "kirjane-logo-green.jpg")), `Official Kirjane green logo preserved`);
check(indexHtml.includes("assets/kirjane-logo-green.jpg"), `index.html references official Kirjane green logo`);
check(/windows:\s*\{\s*url:\s*""/.test(configJs) && /android:\s*\{\s*url:\s*""/.test(configJs), `config.js Windows & Android download URLs remain blank/disabled`);

const expectedCodes = [
  "A01","A02","A03","A04",
  "W01","W02","W03","W04","W05","W06","W07",
  "M01","M02","M03","M04","M05","M06",
  "F01","F02","F03","F04","F05","F06","F07","F08","F09","F10",
  "H01","H02","H03","H04"
];
const missingCases = expectedCodes.filter((c) => !appJs.includes(`"${c}"`));
check(missingCases.length === 0, `All 31 existing QA case IDs (A01–H04) preserved verbatim in app.js`);

const allPortalCode = indexHtml + "\n" + appJs + "\n" + visualJs + "\n" + sandboxJs + "\n" + JSON.stringify(manifest);
check(!/file:\/\/\//i.test(allPortalCode), `Zero file:/// links anywhere in portal HTML/JS/manifest`);
const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const livePortalJs = stripComments(appJs + "\n" + visualJs + "\n" + sandboxJs);
check(!/\bfetch\s*\(/i.test(livePortalJs) && !/XMLHttpRequest/i.test(livePortalJs), `Zero fetch() or XMLHttpRequest network calls in portal/sandbox JS (strictly backend-free)`);

if (failures > 0) {
  console.error(`\nManifest & static audit FAILED with ${failures} error(s).`);
  process.exit(1);
}
console.log(`\nALL STATIC & MANIFEST CHECKS PASSED (0 failures).`);

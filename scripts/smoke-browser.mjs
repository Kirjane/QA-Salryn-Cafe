import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Resolve playwright from local node_modules or optional PLAYWRIGHT_PKG / PLAYWRIGHT_MODULE env override
let playwright;
const pkgOverride = process.env.PLAYWRIGHT_PKG;
const modOverride = process.env.PLAYWRIGHT_MODULE;
try {
  const req = pkgOverride ? createRequire(pkgOverride) : createRequire(import.meta.url);
  playwright = req(modOverride || "playwright");
} catch (err) {
  console.error("Playwright not found. Install playwright (`npm i -D playwright`) or pass PLAYWRIGHT_PKG=<path-to-package.json>.", err.message);
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function startStaticServer() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const rel = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
      const full = path.resolve(root, rel);
      if (!full.startsWith(root) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
        res.writeHead(404); res.end("Not Found"); return;
      }
      const ext = path.extname(full).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      fs.createReadStream(full).pipe(res);
    });
    srv.listen(0, "127.0.0.1", () => resolve({ server: srv, port: srv.address().port }));
  });
}

let failures = 0;
const results = [];
function assert(cond, label, detail = "") {
  results.push({ label, pass: Boolean(cond), detail });
  if (cond) console.log(`[PASS] ${label}${detail ? " — " + detail : ""}`);
  else { console.error(`[FAIL] ${label}${detail ? " — " + detail : ""}`); failures++; }
}

const { server, port } = await startStaticServer();
const baseUrl = `http://127.0.0.1:${port}/`;
const proofDir = path.join(root, "docs", "portal-qa-proof");
fs.mkdirSync(proofDir, { recursive: true });

const browser = await playwright.chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const consoleErrors = [];
const pageErrors = [];
const networkUrls = [];

page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
page.on("pageerror", (err) => pageErrors.push(String(err)));
page.on("request", (req) => {
  const u = req.url();
  networkUrls.push(u);
});

// Stub external Google Fonts cleanly so smoke test runs offline-deterministically without artificial ERR_FAILED console noise
await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
  route.fulfill({ status: 200, contentType: "text/css; charset=utf-8", body: "" })
);

await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(500);

// 1. Check disabled download buttons & 31 cases preserved
const winDisabled = await page.getAttribute("#windowsLink", "aria-disabled");
const andDisabled = await page.getAttribute("#androidLink", "aria-disabled");
assert(winDisabled === "true" && andDisabled === "true", "Installer & APK download links remain disabled in Preparation Mode");

const caseCount = await page.locator("details.case").count();
assert(caseCount === 31, "All 31 existing QA test cases rendered", `count=${caseCount}`);

// 2. Check all 80 gallery cards & every <img> loads cleanly
const cardCount = await page.locator(".vr-card").count();
assert(cardCount === 80, "Visual Review renders all 80 entries (74 captures + 6 missing/human)", `count=${cardCount}`);

const imgStats = await page.evaluate(async () => {
  const imgs = Array.from(document.querySelectorAll(".vr-card img"));
  await Promise.all(imgs.map((img) => {
    img.loading = "eager";
    if (img.complete) return Promise.resolve();
    return new Promise((r) => { img.onload = r; img.onerror = r; });
  }));
  const broken = imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute("src"));
  return { total: imgs.length, broken };
});
assert(imgStats.total === 74 && imgStats.broken.length === 0, "All 74 screenshot card images resolve with zero broken thumbnails", `loaded=${imgStats.total}, broken=${imgStats.broken.length}`);

// Capture Portal Proof 1: Visual Review Gallery (top of section)
await page.evaluate(() => document.getElementById("visual-review")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(250);
await page.screenshot({ path: path.join(proofDir, "01-portal-visual-gallery.png") });

// 3. Test Gallery Filter + Search + Detail Viewer + Hotspots + Compare + Keyboard + Review Save
await page.fill("#vrSearchInput", "Spanish Latte");
await page.waitForTimeout(150);
const filteredCnt = await page.locator(".vr-card").count();
assert(filteredCnt >= 3 && filteredCnt < 20, "Visual Review search narrows cards accurately", `matches=${filteredCnt}`);
await page.fill("#vrSearchInput", "");
await page.waitForTimeout(150);

await page.locator('[data-open-screen="WIN-CASH-04"]').first().click();
await page.waitForSelector("#screenViewerDialog[open]");
const modalTitle = await page.textContent("#viewerTitle");
assert(modalTitle.includes("Variant & Modifier"), "Detail viewer opens WIN-CASH-04 with correct title", modalTitle);

// Toggle Side-by-Side Expected comparison and inspect hotspots
const hotspotCount = await page.locator("#viewerStage .hotspot-pin").count();
assert(hotspotCount >= 3, "Numbered hotspot overlays rendered on WIN-CASH-04", `pins=${hotspotCount}`);
await page.click("#toggleCompareBtn");
await page.waitForTimeout(150);
const compareVisible = await page.locator(".expected-compare-box").isVisible();
assert(compareVisible, "Side-by-side Expected Specification Checklist toggles cleanly");

// Capture Portal Proof 2: Detail Viewer with Hotspots & Expected Compare
await page.screenshot({ path: path.join(proofDir, "02-portal-screen-detail-hotspots.png") });

// Switch tabs (WHY / SHOULD / STEPS) & save a local visual review
await page.click('[data-vtab="why"]');
assert((await page.textContent("#viewerTabContent")).includes("Why This Screen Exists"), "WHY IT EXISTS tab renders grounded content");
await page.click('[data-vtab="should"]');
assert((await page.textContent("#viewerTabContent")).includes("What Should Be There"), "WHAT SHOULD BE THERE tab renders expected contract");
await page.fill("#rvAlias", "QA Smoke Tester");
await page.selectOption("#rvVerdict", "PASS");
await page.selectOption("#rvCategory", "Copy / Clarity");
await page.fill("#rvNotes", "Verified variant and modifier modal hotspots cleanly.");
await page.click('#screenReviewForm button[type="submit"]');
await page.waitForTimeout(150);
assert((await page.textContent("#rvSavedMsg")).includes("Saved locally"), "Per-screen visual review saves locally");

// Keyboard navigation: ArrowRight -> WIN-CASH-05, then click Try in Sandbox
await page.click("#viewerTitle"); // move focus off textarea
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(150);
const nextId = await page.textContent("#viewerScreenId");
assert(nextId === "WIN-CASH-05", "Keyboard ArrowRight advances cleanly to next screen", `now=${nextId}`);

// 4. Gallery -> Sandbox -> Back to Gallery round-trip
await page.click("#viewerSandboxBtn");
await page.waitForTimeout(250);
const dialogStillOpen = await page.locator("#screenViewerDialog[open]").count();
assert(dialogStillOpen === 0, "Jumping to Sandbox closes detail viewer");
const backChipVisible = await page.locator('#sbContextStrip [data-open-screen="WIN-CASH-05"]').isVisible();
assert(backChipVisible, "Sandbox context bar shows direct back-link to originating screenshot WIN-CASH-05");

// 5. Interactive Sandbox End-to-End Journeys
// 5a. Windows Cashier: Add item, send to kitchen, checkout, blind close
await page.click('[data-sb-act="save-send-prep"]');
await page.waitForTimeout(150);
await page.click('[data-sb-act="load-checkout"]');
await page.waitForTimeout(150);
await page.click('[data-sb-form="checkout"] button[type="submit"]');
await page.waitForTimeout(150);
assert((await page.textContent("#sbFrame")).includes("Payment confirmed"), "Sandbox Cashier completes synthetic Cash checkout");
await page.click('[data-sb-act="print-receipt"]');
await page.waitForTimeout(150);
assert((await page.textContent("#sbFrame")).includes("PREVIEW ONLY"), "Sandbox Receipt shows explicit PREVIEW ONLY modal");
await page.screenshot({ path: path.join(proofDir, "03-portal-sandbox-cashier.png") });
await page.click('[data-sb-act="close-modal"]');

// 5b. Orders & Kitchen
await page.click('[data-surface="win-kitchen"]');
await page.waitForTimeout(150);
await page.locator('[data-sb-act="kds-next"]').first().click();
await page.waitForTimeout(150);
assert((await page.textContent("#sbFrame")).includes("Preparing"), "Sandbox Kitchen advances ticket to Preparing");

// 5c. Back-Office Areas A-H + Error preset 404 reproduction
await page.click('[data-surface="win-backoffice"]');
await page.waitForTimeout(150);
await page.click('[data-sb-act="set-bo"][data-val="area-e"]');
await page.waitForTimeout(150);
await page.screenshot({ path: path.join(proofDir, "04-portal-sandbox-backoffice.png") });

await page.selectOption("#sbPresetSelect", "error");
await page.click('[data-sb-act="set-bo"][data-val="area-g"]');
await page.waitForTimeout(150);
assert((await page.textContent("#sbFrame")).includes("404"), "Sandbox Error preset truthfully reproduces reported Area G /api/settings/store 404");

// 5d. Central Owner Portal
await page.selectOption("#sbPresetSelect", "happy");
await page.click('[data-surface="central"]');
await page.waitForTimeout(150);
await page.click('[data-sb-act="approve-dev"]');
await page.waitForTimeout(150);
assert((await page.textContent("#sbFrame")).includes("Approved synthetic device"), "Sandbox Central Owner approves pending Patio Barista Kiosk");

// 5e. Android Cashier Browser Replica (Offline queue -> Reconnect & Sync + Bug repro)
await page.click('[data-surface="android"]');
await page.selectOption("#sbPresetSelect", "offline");
await page.waitForTimeout(150);
await page.click('[data-sb-act="and-save-order"]');
await page.waitForTimeout(150);
await page.screenshot({ path: path.join(proofDir, "05-portal-sandbox-android-replica.png") });
await page.click('[data-sb-act="and-screen"][data-val="setup"]');
await page.click('[data-sb-act="and-toggle-offline"]');
await page.click('[data-sb-act="and-reconnect"]');
await page.waitForTimeout(150);
assert((await page.textContent("#sbFrame")).includes("Pending operations: 0"), "Sandbox Android replica queues offline order and syncs to 0 pending on reconnect");

// Reset Demo Data
await page.click("#sbResetBtn");
await page.waitForTimeout(150);
assert((await page.textContent("#sbFrame")).includes("reset to clean synthetic seed") || (await page.locator("#sbPresetSelect").inputValue()) === "happy", "Reset Demo Data restores clean seed state");

// 6. Local persistence + JSON export / validated JSON import round-trip
await page.locator("#case-A01 summary").click();
await page.selectOption('[data-case="A01"]', "PASS");
await page.fill('[data-note="A01"]', "Smoke verified release tracking.");
await page.fill("#qaTester", "QA Smoke Tester");
await page.waitForTimeout(200);

await page.locator("#qaDashboard").scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await page.screenshot({ path: path.join(proofDir, "06-portal-dashboard-and-export.png") });

// Reload and verify localStorage persistence
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(400);
assert((await page.textContent("#doneCount")).startsWith("1 / 31"), "Case verdict persists across page reload");
assert((await page.textContent("#vrProgressNum")).startsWith("1 / 74"), "Visual screen review persists across page reload");

// Export JSON -> Clear localStorage -> Reload -> Import JSON -> Verify restoration
const exportedJson = await page.evaluate(() => JSON.stringify(window.SalrynQaApp.getReport()));
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(300);
assert((await page.textContent("#doneCount")).startsWith("0 / 31"), "Cleared localStorage resets progress to 0 / 31");

const invalidOk = await page.evaluate(() => window.SalrynQaApp.importJsonText('{"reportType":"WRONG"}'));
assert(invalidOk === false, "Validated JSON import rejects wrong reportType safely");

const validOk = await page.evaluate((txt) => window.SalrynQaApp.importJsonText(txt), exportedJson);
await page.waitForTimeout(200);
assert(validOk === true && (await page.textContent("#doneCount")).startsWith("1 / 31") && (await page.textContent("#vrProgressNum")).startsWith("1 / 74"),
  "Validated JSON import restores both 31-case and visual screen reviews cleanly");

// 7. Responsive overflow audit across 360 / 390 / 768 / 1024 / 1440 widths
for (const width of [360, 390, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 844 });
  await page.waitForTimeout(200);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 2, `Zero horizontal document overflow at ${width}px width`, `delta=${overflow}px`);
  if (width === 390) {
    await page.locator("#visual-review").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(proofDir, "07-portal-mobile-390px.png") });
  }
}

// 8. Zero production API calls & zero console/page errors
const prodCalls = networkUrls.filter((u) => /\/api\/|:5399|:5400|:5445/i.test(u));
const nonLocalNonFont = networkUrls.filter((u) => !u.startsWith(`http://127.0.0.1:${port}/`) && !u.startsWith("https://fonts."));
assert(prodCalls.length === 0, "Zero production API requests observed in browser network log", `prodCalls=${prodCalls.length}`);
assert(nonLocalNonFont.length === 0, "Zero unexpected external network requests", `unexpected=${nonLocalNonFont.length}`);
assert(consoleErrors.length === 0 && pageErrors.length === 0, "Zero browser console errors and zero uncaught page errors", `console=${consoleErrors.length}, page=${pageErrors.length}`);

await browser.close();
server.close();

fs.writeFileSync(path.join(proofDir, "smoke-results.json"), JSON.stringify({
  ranAtUtc: new Date().toISOString(),
  totalAssertions: results.length,
  passed: results.filter((r) => r.pass).length,
  failed: failures,
  consoleErrors,
  pageErrors,
  totalNetworkRequests: networkUrls.length,
  results
}, null, 2) + "\n", "utf8");

if (failures > 0) {
  console.error(`\nBROWSER SMOKE SUITE FAILED (${failures} failure(s)).`);
  process.exit(1);
}
console.log(`\nALL ${results.length} BROWSER SMOKE ASSERTIONS PASSED (0 failures).`);

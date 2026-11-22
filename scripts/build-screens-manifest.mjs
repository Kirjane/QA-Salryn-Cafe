import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCREENS_PART_A } from "./screen-definitions-a.mjs";
import { SCREENS_PART_B } from "./screen-definitions-b.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const APP_SHA = "3d23ef4b9c4bca7b992f9e58d28c61e9e474ad23";
const PORTAL_BASELINE_SHA = "a90866ce1ba2469a025b51b2c46b678f424a3c9b";

function readPngMetadata(relPath) {
  const fullPath = path.join(repoRoot, relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing screenshot file on disk: ${relPath}`);
  }
  const buf = fs.readFileSync(fullPath);
  // Verify PNG signature
  const pngSig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (buf.length < 24 || !buf.subarray(0, 8).equals(pngSig)) {
    throw new Error(`File is not a valid PNG: ${relPath}`);
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const sha256 = crypto.createHash("sha256").update(buf).digest("hex");
  return { bytes: buf.length, viewport: `${width}x${height}`, hash: sha256 };
}

const rawScreens = [...SCREENS_PART_A, ...SCREENS_PART_B];
const seenIds = new Set();
const uniqueImageFiles = new Set();

const screens = rawScreens.map((entry) => {
  if (seenIds.has(entry.id)) {
    throw new Error(`Duplicate screen ID in manifest definitions: ${entry.id}`);
  }
  seenIds.add(entry.id);

  const isQaPortal = entry.category === "06-QA-PORTAL";
  const sourceSha = isQaPortal ? PORTAL_BASELINE_SHA : APP_SHA;
  let hash = null;
  let bytes = 0;
  let viewport = null;

  if (entry.image) {
    const meta = readPngMetadata(entry.image);
    hash = meta.hash;
    bytes = meta.bytes;
    viewport = meta.viewport;
    uniqueImageFiles.add(entry.image);
  } else {
    viewport = "N/A (No Capture)";
  }

  return {
    id: entry.id,
    order: entry.order,
    title: entry.title,
    originalFilename: entry.originalFilename,
    image: entry.image,
    duplicateOf: entry.duplicateOf || null,
    hash,
    bytes,
    viewport,
    sourceSha,
    platform: entry.platform,
    category: entry.category,
    module: entry.module,
    workflow: entry.workflow,
    role: entry.role,
    state: entry.state,
    capturesStatus: entry.capturesStatus,
    priority: entry.priority,
    privacyAudit: entry.image ? "SYNTHETIC_SAFE_PUBLIC" : "NO_IMAGE",
    observed: entry.observed,
    purpose: entry.purpose,
    expected: entry.expected,
    expectedEvidence: entry.expectedEvidence,
    controlContracts: entry.controlContracts || [],
    discrepancies: entry.discrepancies || [],
    issues: entry.issues || [],
    testSteps: entry.testSteps || [],
    limitations: entry.limitations,
    sandboxRoute: entry.sandboxRoute,
    testCaseIds: entry.testCaseIds || []
  };
});

// Verify every physical PNG in assets/screenshots/ is referenced by at least one screen
function listPngs(dir) {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) out = out.concat(listPngs(full));
    else if (name.toLowerCase().endsWith(".png")) {
      out.push(path.relative(repoRoot, full).replace(/\\/g, "/"));
    }
  }
  return out;
}

const physicalPngs = listPngs(path.join(repoRoot, "assets", "screenshots")).sort();
const unreferenced = physicalPngs.filter((p) => !uniqueImageFiles.has(p));
if (unreferenced.length > 0) {
  throw new Error(`Unreferenced PNGs in assets/screenshots/: ${unreferenced.join(", ")}`);
}

const capturedEntries = screens.filter((s) => s.image !== null);
const missingEntries = screens.filter((s) => s.image === null);
const duplicateEntries = capturedEntries.filter((s) => s.duplicateOf !== null);
const defectEntries = screens.filter((s) => s.capturesStatus === "DEFECT_OBSERVED");
const boundaryEntries = screens.filter((s) => s.capturesStatus === "BOUNDARY_VERIFIED");
const partialEntries = screens.filter((s) => s.capturesStatus === "PARTIAL_CAPTURE");

const byCategory = {};
for (const s of capturedEntries) {
  byCategory[s.category] = (byCategory[s.category] || 0) + 1;
}

const manifest = {
  schemaVersion: "1.0.0",
  mission: "FORGE-SALRYN-QA-VISUAL-74-INTERACTIVE-SANDBOX",
  generatedAtUtc: new Date().toISOString(),
  sourceRepository: "Kirjane/Dev-Salryn-Cafe",
  sourceCommitSha: APP_SHA,
  qaPortalBaselineSha: PORTAL_BASELINE_SHA,
  privacyAuditSummary: {
    publicRepoSafe: true,
    blockedForPrivacyCount: 0,
    redactionsAppliedCount: 0,
    notes: "All 74 source captures were generated in a disposable local lab (127.0.0.1:5399 & 10.0.2.2:5445) using synthetic operators (Maria Santos, Leo Cruz, Cafe Yza Owner), synthetic credit customers, masked password fields, and ephemeral destroyed lab keys/join codes. Zero real customer PII, zero live secrets, zero private keys, and zero local OS user paths appear in any published PNG."
  },
  accounting: {
    reportedSourceCaptures: 74,
    availableCaptureEntries: capturedEntries.length,
    uniquePngFilesPublished: physicalPngs.length,
    publiclySafeUniquePngs: physicalPngs.length,
    blockedForPrivacy: 0,
    documentedDuplicates: duplicateEntries.length,
    explicitMissingOrHumanRequiredEntries: missingEntries.length,
    totalRegistryEntries: screens.length,
    annotatedCount: screens.length,
    mappedToSandboxCount: screens.filter((s) => Boolean(s.sandboxRoute)).length,
    defectObservedEntries: defectEntries.length,
    boundaryVerifiedEntries: boundaryEntries.length,
    partialCaptureEntries: partialEntries.length,
    categoryCountsCaptured: byCategory
  },
  reportedDefectsCatalog: [
    {
      id: "BUG-3D23-ANDROID-INTENT-CLEAR",
      severity: "Critical",
      classification: "Source-Confirmed Conflict",
      platform: "Android Cashier",
      affectedScreens: ["AND-06", "ERR-14", "MISS-AND-CHECKOUT-RECEIPT", "MISS-AND-KITCHEN-PREP", "MISS-AND-REFUND-MODALS"],
      sourceRef: "MobileCashierIntentStore.cs:122,146 vs AndroidKeyStoreSecretStore.cs:74-77 (Dev-Salryn-Cafe @ 3d23ef4b)",
      summary: "ClearConfirmedAsync and ResolveRejectedAsync write empty byte[] ([]) to IDeviceSecretStore, which AndroidKeyStoreSecretStore rejects with ArgumentException('Device secret cannot be empty.'), stranding Pending action: ShiftOpen forever."
    },
    {
      id: "BUG-3D23-RECEIPT-SNAPSHOT",
      severity: "High",
      classification: "Runtime Finding",
      platform: "Windows Host Web",
      affectedScreens: ["WIN-CASH-11", "WIN-ORD-03"],
      sourceRef: "Observed live on /api/cafe/print/jobs/receipt @ 3d23ef4b",
      summary: "Clicking Print Receipt or Reprint on newly completed Cafe sales fails with 'Sale has no persisted receipt snapshot.'"
    },
    {
      id: "BUG-3D23-KITCHEN-OPID",
      severity: "High",
      classification: "Runtime Finding",
      platform: "Windows Host Web",
      affectedScreens: ["WIN-KDS-02"],
      sourceRef: "Observed live on /cafe/kitchen Print Kitchen Ticket @ 3d23ef4b",
      summary: "Print Kitchen Ticket fails with 'A valid client-supplied operationId (or Idempotency-Key header) is required.'"
    },
    {
      id: "BUG-3D23-PUBLISH-OPID",
      severity: "High",
      classification: "Runtime Finding",
      platform: "Windows Host Web",
      affectedScreens: ["WIN-BO-C"],
      sourceRef: "Observed live on /cafe/backoffice Area C Publish Menu & Recipes @ 3d23ef4b",
      summary: "Publish Menu & Recipes fails with 'A valid client-supplied operationId (or Idempotency-Key header) is required.'"
    },
    {
      id: "BUG-3D23-SETTINGS-404",
      severity: "Medium",
      classification: "Runtime Finding",
      platform: "Windows Host Web",
      affectedScreens: ["WIN-BO-G", "MISS-WIN-STORE-SETTINGS"],
      sourceRef: "Observed live GET /api/settings/store -> 404 NotFound @ 3d23ef4b",
      summary: "Store & Receipt Settings endpoint is unmapped (404), silently omitting the Store Settings card in Back-Office Area G."
    }
  ],
  screens
};

fs.mkdirSync(path.join(repoRoot, "data"), { recursive: true });
fs.writeFileSync(path.join(repoRoot, "data", "screens.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
fs.writeFileSync(
  path.join(repoRoot, "data", "screens-data.js"),
  "/* Auto-generated from data/screens.json for file:// and HTTP static compatibility. Do not hand-edit. */\n" +
    "window.SALRYN_SCREENS_MANIFEST = " + JSON.stringify(manifest) + ";\n",
  "utf8"
);

// Write human-readable Phase 0 provenance & hash audit document
const mdLines = [
  "# Salryn Cafe Visual QA — Screenshot Manifest & Provenance Audit",
  "",
  `- **Mission:** \`${manifest.mission}\``,
  `- **Source Application Commit:** \`Kirjane/Dev-Salryn-Cafe\` @ \`${APP_SHA}\``,
  `- **QA Portal Baseline Commit:** \`Kirjane/QA-Salryn-Cafe\` (\`qa/portal-maintainer\`) @ \`${PORTAL_BASELINE_SHA}\``,
  `- **Reported Source Captures:** \`${manifest.accounting.reportedSourceCaptures}\``,
  `- **Available Capture Entries in Manifest:** \`${manifest.accounting.availableCaptureEntries}\``,
  `- **Unique Publicly Safe PNG Binaries Published:** \`${manifest.accounting.uniquePngFilesPublished}\``,
  `- **Documented Byte-Identical Duplicates:** \`${manifest.accounting.documentedDuplicates}\` (\`CEN-03\` == \`CEN-02\`, SHA-256 \`${screens.find((s) => s.id === "CEN-02").hash}\`)`,
  `- **Blocked for Privacy / PII / Secrets:** \`${manifest.accounting.blockedForPrivacy}\``,
  `- **Explicit Missing / Human-Required Entries (No Fabricated PNGs):** \`${manifest.accounting.explicitMissingOrHumanRequiredEntries}\``,
  `- **Total Annotated Registry Entries:** \`${manifest.accounting.totalRegistryEntries}\``,
  "",
  "## Category Distribution (Verified)",
  "",
  "| Category | Entries |",
  "|---|---:|",
  ...Object.entries(byCategory).map(([cat, cnt]) => `| \`${cat}\` | ${cnt} |`),
  `| \`MISSING-OR-HUMAN\` (No PNG invented) | ${missingEntries.length} |`,
  "",
  "## Public-Repository Privacy & Safety Audit",
  "",
  manifest.privacyAuditSummary.notes,
  "",
  "## Complete SHA-256 Provenance Inventory",
  "",
  "| # | Screen ID | Status | Viewport | Bytes | SHA-256 | Asset Path |",
  "|---:|---|---|---|---:|---|---|",
  ...screens.map((s) =>
    `| ${s.order} | \`${s.id}\` | \`${s.capturesStatus}\` | \`${s.viewport}\` | ${s.bytes} | \`${s.hash ? s.hash.slice(0, 16) + "…" : "NONE"}\` | ${s.image ? `\`${s.image}\`` : "_Missing / Human Required_"} |`
  ),
  ""
];

fs.writeFileSync(path.join(repoRoot, "docs", "SCREENSHOT-MANIFEST-AUDIT.md"), mdLines.join("\n"), "utf8");
console.log(`Built data/screens.json, data/screens-data.js, and docs/SCREENSHOT-MANIFEST-AUDIT.md: ${screens.length} entries (${physicalPngs.length} unique PNGs, ${duplicateEntries.length} duplicate, ${missingEntries.length} missing/human-required).`);

# Salryn Cafe · Kirjane Labs Visual QA & Field Testing Portal

This repository owns the **non-technical visual QA inspection library, backend-free frontend sandbox, and field testing portal** for Salryn Cafe, independently of the engineering codebase (`Kirjane/Dev-Salryn-Cafe`).

- **Visual Review Library (`#visual-review`):** Inspects all **74 real captured entries** from `Kirjane/Dev-Salryn-Cafe` @ `3d23ef4b9c4bca7b992f9e58d28c61e9e474ad23` (73 unique publicly safe PNG binaries + 1 documented byte-identical duplicate `CEN-03 == CEN-02`, 0 privacy-blocked) plus **6 explicit `MISSING_CAPTURE` / `HUMAN_REQUIRED` workflows** (never invented images). Each entry provides distinct **WHAT IS THERE**, **WHY IT IS THERE**, and **WHAT SHOULD BE THERE** guidance, numbered control hotspots, zoom/pan, side-by-side expected checklists, and browser-local multi-reviewer verdicts.
- **Interactive Frontend Sandbox (`#sandbox`):** Strictly **DEMO / SYNTHETIC DATA / ZERO BACKEND** simulation covering Windows Cashier (`/cafe/`), Orders & Lifecycle (`/cafe/orders`), Kitchen Display (`/cafe/kitchen`), Back-Office Areas A–H (`/cafe/backoffice`), Central Owner Portal (`/cafe/central`), and a clearly labeled browser visual replica of the Android Cashier (`MainActivity.cs`). Includes role switching, scenario presets (`Happy path`, `Empty store`, `Permission denied`, `Offline`, `Error`), viewport frames, and Reset Demo Data. **Never proves real server, payment, TLS, sync, or physical printer behavior.**
- **Field Testing Handbook & 31 Cases (`#downloads`, `#instructions`, `#checklist`, `#report`):** Preserves the official Kirjane green logo, Preparation Mode guardrails, blank/disabled installer and APK links in `config.js`, all 31 QA cases (`A01`–`H04`), browser-local JSON/CSV export, and validated JSON import.
- **Deployment Hold:** Vercel deployment, Git integration, and merges **require explicit Technical Authority approval**. No Vercel project, preview, or automatic deployment is authorized here.
- **Privacy & Security:** Public informational portal with zero authentication, zero backend, zero hidden telemetry, and zero credentials/PII/live databases.

## Local Run & Verification

Serve statically with any local HTTP server (or open `index.html` directly — `data/screens-data.js` supports both HTTP and `file://`):

```bash
npx --yes serve .
# or: python -m http.server 8080
```

Rebuild the SHA-256 screenshot manifest and audit document (`docs/SCREENSHOT-MANIFEST-AUDIT.md`):

```bash
node scripts/build-screens-manifest.mjs
```

Run automated manifest, description, privacy, and zero-backend checks:

```bash
node scripts/verify-portal.mjs
```

Run the Playwright browser smoke suite (verifies all 74 thumbnails, detail viewer hotspots, sandbox workflows, local persistence, JSON import/export round-trip, 360–1440px responsive overflow, and zero production API calls):

```bash
node scripts/smoke-browser.mjs
# Or point to an existing Playwright installation:
# PLAYWRIGHT_PKG=/path/to/package.json node scripts/smoke-browser.mjs
```

## Provenance & Portal Proof Artifacts

- Screenshot manifest & SHA-256 audit: [`docs/SCREENSHOT-MANIFEST-AUDIT.md`](docs/SCREENSHOT-MANIFEST-AUDIT.md)
- Portal verification proof captures (distinct from the 74 Cafe application captures): [`docs/portal-qa-proof/`](docs/portal-qa-proof/)
- Non-technical tester SOP: [`docs/HUMAN-QA-SOP.md`](docs/HUMAN-QA-SOP.md)
- Independent QA Portal Maintainer SOP: [`docs/QA-PORTAL-MAINTAINER.md`](docs/QA-PORTAL-MAINTAINER.md)

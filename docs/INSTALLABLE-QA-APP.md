# Kirjane Salryn Cafe QA — installable application

**Status:** Packaging source only; not yet an authorized production or public release.

This packages the existing screenshot review library (74 capture entries / 73 PNGs), synthetic Cafe frontend sandbox, and 31-case tester checklist as an offline QA application. It is **not** the real Cafe POS. It does not contact Central, manage real inventory, record financial transactions, print receipts, or provide multi-user synchronization.

## Windows desktop QA application (portable EXE)

The GitHub Actions workflow `.github/workflows/qa-app-package.yml` builds an unsigned standalone Windows x64 executable from exactly the submitted QA branch. It **does not deploy or release** the build. The QA maintainer must review the resulting artifact manifest, SHA-256, code, screenshots, and test evidence before any team distribution.

To build on an approved Windows machine (Node.js 22):

```powershell
node scripts/verify-portal.mjs
cd packaging
npm install --no-audit --no-fund
npm run build:win
```

Output: `packaging/release/Kirjane-SalrynCafe-QA-0.1.0-win-x64.exe`. This EXE contains the offline static site and screenshots. It uses Electron with Node integration disabled, Chromium sandbox enabled, and remote network navigation/requests denied. It has **no digital signature**; do not instruct testers to bypass unexpected endpoint security warnings. Signed, managed distribution requires a separate authorization and trusted signing key.

Tester review data lives locally in the application's Chromium profile. Use **Export JSON/CSV** to hand off findings; never assume reviews synchronize between devices.

## Browser install on Windows / Android / iOS (PWA)

After an owner-approved secure HTTPS hosting of the *QA-only* website, open it in Chrome or Edge and select **Install QA app** (or browser menu > Install app). iPhone Safari can use Share > Add to Home Screen. Offline support caches all 73 unique approved screenshot images plus the QA interface on first installation. Confirm the status says **Offline ready** before disconnecting. Google Fonts may fall back offline. A service worker cannot register from `file://`; use HTTPS or localhost. This does not create an Android APK.

The public website remains subject to the existing **NO VERCEL / NO DEPLOYMENT** hold until Technical Authority approval. PWA installation requires the site to be hosted on HTTPS or localhost.

## Release gates and operational boundary

- Keep `Kirjane/QA-Salryn-Cafe` QA-only, with synthetic data and explicit demo labeling.
- Do not put real customer data, payment credentials, signed licensing materials, certificates, device join codes, or private keys in this app.
- Do not replace `config.js` placeholders with unverified real POS download links.
- A **live operational Cafe system** is a separate Windows Host + Central + native Android package owned by `Kirjane/Dev-Salryn-Cafe`, requiring the pending Kirion-Nox review, entitlement, real devices, synchronization and printing acceptance. A standalone QA simulator does not satisfy these.
- Do not merge, deploy, distribute broadly or authorize production operations based solely on a passing QA application build.

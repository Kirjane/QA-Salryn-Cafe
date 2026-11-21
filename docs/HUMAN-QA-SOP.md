# Kirjane Labs — Salryn Cafe Human QA Standard Operating Procedure

**Audience:** Non-technical Kirjane Labs testers. **Source:** the public QA portal. **Status:** awaiting a frozen, matched QA build.

## 0. Your job
Use the actual Windows app and Android cashier on approved equipment. Report observed outcomes. You are not expected to inspect code, run commands, troubleshoot certificates, manage SQL databases, or visit GitHub. Installation/pairing and real-world workflow testing belong to the QA team; security/concurrency correctness belongs to engineering.

## 1. Start conditions (hard gate)
The QA maintainer supplies: (a) one release identifier and source SHA, (b) a Windows installer and Android QA APK from that same SHA, (c) verified SHA-256 checksums, (d) an authorized test store and synthetic operator credentials shared privately, (e) a working approved Central QA endpoint and pairing/approval instructions, (f) a valid test entitlement or explicitly labeled restricted Debug QA mode. Do not execute payment tests if license entitlement does not allow it.

If any required item is missing: mark **BLOCKED**. Never bypass TLS, credentials, Windows protections, or licensing.

## 2. Physical equipment
- Windows 10/11 desktop or laptop with appropriate permission to install a test application.
- Approved Android tablet/phone, charged and on the designated QA network.
- Separate approved operator identities (authorized and restricted-credit role) and fictitious customer, product, inventory fixtures.
- Optional second device, thermal printer, and spare test machine for upgrade/uninstall tests.

## 3. Windows installation
1. Open the QA portal and download only the approved Windows package.
2. Check the QA release ID and filename against the maintainer-provided manifest.
3. Run normal installer UI. If a security/publisher warning is unexpected, stop and contact the maintainer. Do not disable Windows security.
4. Leave the approved default install location; do not install into protected Retail directories.
5. Open Salryn Cafe from the shortcut. Record a screenshot.
6. Configure only the test store per release instructions; authenticate with the provided synthetic account.
7. Inspect the live menu and record two example product names/prices.
8. Close and reopen the application; verify the synthetic records persist.

## 4. Android installation / device approval
1. Download the matching QA APK from the portal on an approved device.
2. Follow normal Android installer prompts; contact the maintainer if blocked.
3. Open the real native Salryn Cafe application.
4. Use only the release-specific **Central QA service** address provided by the maintainer.
5. Follow the QR/invite/approval procedure if included by the build; never guess server IPs or type unknown enrollment tokens.
6. Ask the authorized manager to approve this device in the designated admin interface. Never create approval by editing app data.
7. Log in with the synthetic operator, verify device approval/store scope and initial menu sync.
8. If enrollment/setup options do not exist or the Central endpoint is unavailable, mark BLOCKED—do not improvise security changes.

## 5. Financial and offline test protocol
- First perform synthetic Cash sale; record exact order ID and price total.
- Repeat with a permitted synthetic AR customer and with Cash+AR split. Check total = Cash + AR and receivable balance.
- Try restricted-credit operator; verify no unauthorized sale.
- Test repeated submit / rejected payment only using approved synthetic scenarios. Stop if real money or customer data appears.
- Open an approved shift before offline cashier tests. Disable connectivity, create a permitted order, restart Android while offline, reconnect, then compare the original operation ID and one resulting sale at Central/Windows.
- Test shift reconciliation and conflict with a second device if one is available. Manual cash movement without trustworthy source is a blocking issue, not an acceptable estimate.
- Check offline errors, printing and reporting with the proper QA fixtures.

## 6. How to classify each check
**PASS:** performed and observed the expected result.
**FAIL:** performed, but observed a wrong result.
**BLOCKED:** could not perform due to an unavailable prerequisite, missing feature, license, endpoint, test account or hardware.
**NOT RUN:** deliberately not performed. This is not a pass.

**Stop immediately:** duplicate sale/AR balance, lost operation, incorrect store/customer scope, unauthorized account granted access, insecure pairing prompt, guessed drawer totals, or real customer/production data.

## 7. Evidence and deliverables
Every tester exports the portal QA JSON report; CSV is optional for spreadsheet review. Include tester name/initials, test date, Windows model/OS, Android model/OS, release identifier/source SHA, status per case, exact error and observations. Attach screenshots with personal details removed, and an expected/actual amount table where finance is involved. Share these through the **designated team channel** given by the QA maintainer; this public static website does NOT accept uploads or transmit results.

## 8. Release decision
A successful installer and pairing do not prove financial concurrency security. Engineering owns current-SHA automated checks, Nox independent review, accepted Central scope and package integrity. QA owns actual installation/operational acceptance. Final release requires both, legitimate licensing/signing and separate Technical Authority authorization.

No tester may approve production rollout from a checklist alone.
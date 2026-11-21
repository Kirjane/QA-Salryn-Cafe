# Independent QA Portal Maintainer — Kirjane Labs

## Authority boundary
**Role:** `KIRJANE-LABS-QA-PORTAL-MAINTAINER`.
**Scope:** this standalone public repository only: `Kirjane/QA-Salryn-Cafe`.

The maintainer keeps the instructions accurate, coordinates non-technical testers, verifies engineering QA-artifact manifests, places approved Windows/Android download URLs in `config.js`, reviews exported QA feedback and sends code defects to Salryn engineering.

The QA portal maintainer is **not** Kirion-Nox, the Codex engineering writer, or a production-release approver. The role must be assigned to a real authorized Kirjane Labs person/account by the organization owner; the repository does not create or impersonate a GitHub identity.

## Update procedure
1. Confirm the Windows installer and Android APK come from the same frozen source SHA and have approved checksums.
2. Verify the release is an authorized QA artifact and the Central QA pairing guide works.
3. Update only `config.js` with the exact version, source SHA, HTTPS links, approved filenames/hashes and optional pairing guide.
4. Test download buttons, instructions, mobile layout and report-export locally.
5. Request maintainer review and obtain explicit permission for any Vercel deployment or Git connection.
6. Never upload test passwords, device tokens, SQLite databases, certificates/private keys, customer data or raw unredacted logs to this public repository.
7. Never merge/push product code from `Dev-Salryn-Cafe` into this portal.

## Vercel launch hold
This repository is **deployment-ready source only**. The owner expressly prohibited deployment without a separate explicit instruction.
- Do **not** create a Vercel project, connect Git integration or trigger automatic preview/production deploys yet.
- On later explicit authorization, select this QA repository, framework **Other/static**, root `./`, output `./`. Check that Deployment Protection / Vercel Authentication / Password Protection are **disabled**.
- Site intentionally has no authentication or backend. Public information only.
- The production domain and environment must be approved explicitly by the owner. Do not assume a Vercel URL.

## File ownership recommendation
Set organization CODEOWNERS to a designated `@Kirjane/<qa-team>` **only after verifying the team exists and has repository access**. Meanwhile GitHub organization owner retains review authority. A role description by itself does not provision an account or grant permissions.

## QA content edits
Technical implementation details belong in engineering repo. This site's writing is designed for non-technical humans. Use short verbs, exact expected results, screenshot examples and BLOCKED when no package/pairing instructions exist.
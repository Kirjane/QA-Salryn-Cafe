"use strict";

/* Kirjane Labs — Salryn Cafe Visual Review Library & Detail Inspector
   Browser-only, zero backend, preserves multi-reviewer history without silently overwriting. */

(function () {
  const VISUAL_STORE = "kirjane.salryn.cafe.visual.v1";
  const qs = (s, root = document) => root.querySelector(s);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const manifest = window.SALRYN_SCREENS_MANIFEST || { accounting: {}, reportedDefectsCatalog: [], screens: [] };
  const allScreens = Array.isArray(manifest.screens) ? manifest.screens : [];

  let state = {
    reviews: {}, // { [screenId]: [ { reviewerAlias, verdict, severity, category, source, device, notes, updatedAtUtc } ] }
    lastScreenId: null,
    defaultAlias: ""
  };

  function loadVisualState() {
    try {
      const raw = JSON.parse(localStorage.getItem(VISUAL_STORE) || "{}");
      if (raw && typeof raw === "object") {
        if (raw.reviews && typeof raw.reviews === "object") state.reviews = raw.reviews;
        if (typeof raw.lastScreenId === "string") state.lastScreenId = raw.lastScreenId;
        if (typeof raw.defaultAlias === "string") state.defaultAlias = raw.defaultAlias;
      }
    } catch {
      /* ignore corrupt storage */
    }
  }

  function saveVisualState() {
    try {
      localStorage.setItem(VISUAL_STORE, JSON.stringify(state));
    } catch {
      /* ignore storage quota error */
    }
    window.dispatchEvent(new CustomEvent("salryn:visual-updated"));
  }

  function getLatestReview(screenId) {
    const list = state.reviews[screenId];
    if (!Array.isArray(list) || !list.length) return null;
    return list[list.length - 1];
  }

  function getEffectiveVerdict(screenId) {
    const latest = getLatestReview(screenId);
    return latest ? latest.verdict || "NOT RUN" : "UNREVIEWED";
  }

  function statusBadgeMeta(status) {
    switch (status) {
      case "CAPTURED": return { cls: "captured", label: "Captured" };
      case "DEFECT_OBSERVED": return { cls: "defect", label: "Defect Observed" };
      case "PARTIAL_CAPTURE": return { cls: "partial", label: "Partial Capture" };
      case "BOUNDARY_VERIFIED": return { cls: "boundary", label: "Boundary Verified" };
      case "DUPLICATE_OF_CEN_02": return { cls: "duplicate", label: "Duplicate (CEN-02)" };
      case "MISSING_CAPTURE": return { cls: "missing", label: "Missing Capture" };
      case "HUMAN_REQUIRED": return { cls: "human", label: "Human Required" };
      default: return { cls: "notrun", label: status || "Unknown" };
    }
  }

  function verdictBadgeMeta(v) {
    switch (v) {
      case "PASS": return { cls: "pass", label: "PASS" };
      case "FAIL": return { cls: "fail", label: "FAIL" };
      case "BLOCKED": return { cls: "blocked", label: "BLOCKED" };
      case "NOT RUN": return { cls: "notrun", label: "NOT RUN" };
      default: return { cls: "notrun", label: "UNREVIEWED" };
    }
  }

  const filters = {
    category: "ALL",
    status: "ALL",
    priority: "ALL",
    review: "ALL",
    search: ""
  };

  let filteredScreens = [...allScreens];
  let activeScreenId = null;
  let activeTab = "what";
  let activeZoom = "fit";
  let showHotspots = true;
  let showCompare = false;
  let selectedHotspot = null;

  const CATEGORY_LABELS = [
    ["ALL", "All Entries"],
    ["01-WINDOWS-CASHIER", "Windows Cashier"],
    ["02-ORDERS-KITCHEN", "Orders & Kitchen"],
    ["03-BACKOFFICE", "Back-Office A–H"],
    ["04-CENTRAL-OWNER", "Central Owner"],
    ["05-ANDROID-CASHIER", "Android Cashier"],
    ["06-QA-PORTAL", "QA Portal"],
    ["07-RESPONSIVE", "Responsive"],
    ["08-DIALOGS-AND-ERRORS", "Dialogs & Errors"],
    ["MISSING-OR-HUMAN", "Missing / Human"]
  ];

  function renderDefectsPanel() {
    const grid = qs("#vrDefectsGrid");
    if (!grid) return;
    const defects = manifest.reportedDefectsCatalog || [];
    grid.innerHTML = defects.map((d) => {
      const links = (d.affectedScreens || []).map((sid) =>
        `<button type="button" class="mini-link-btn" data-open-screen="${esc(sid)}">${esc(sid)} ↗</button>`
      ).join("");
      return `
        <article class="defect-chip-card">
          <header>
            <code>${esc(d.id)}</code>
            <span class="vr-badge defect">${esc(d.severity)} · ${esc(d.classification)}</span>
          </header>
          <div><strong>${esc(d.platform)}:</strong> ${esc(d.summary)}</div>
          <div style="font-size:11px;color:#5c6b63;margin-top:4px">${esc(d.sourceRef)}</div>
          <div class="defect-links">${links}</div>
        </article>`;
    }).join("");
  }

  function renderCategoryPills() {
    const box = qs("#vrCategoryPills");
    if (!box) return;
    box.innerHTML = CATEGORY_LABELS.map(([code, label]) => {
      const count = code === "ALL" ? allScreens.length : allScreens.filter((s) => s.category === code).length;
      return `<button type="button" class="vr-pill ${filters.category === code ? "active" : ""}" data-vr-cat="${esc(code)}" aria-pressed="${filters.category === code}">${esc(label)} (${count})</button>`;
    }).join("");
  }

  function applyFilters() {
    const q = filters.search.trim().toLowerCase();
    filteredScreens = allScreens.filter((s) => {
      if (filters.category !== "ALL" && s.category !== filters.category) return false;
      if (filters.status !== "ALL" && s.capturesStatus !== filters.status) return false;
      if (filters.priority !== "ALL" && s.priority !== filters.priority) return false;
      const rev = getEffectiveVerdict(s.id);
      if (filters.review !== "ALL" && rev !== filters.review) return false;
      if (q) {
        const hay = [
          s.id, s.title, s.platform, s.module, s.workflow, s.state,
          s.observed, s.purpose, s.expected,
          ...(s.controlContracts || []).map((c) => c.label + " " + c.expectedOutcome),
          ...(s.testCaseIds || [])
        ].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function updateGuidedBar() {
    const captured = allScreens.filter((s) => s.image !== null);
    const reviewedCount = captured.filter((s) => {
      const v = getEffectiveVerdict(s.id);
      return v === "PASS" || v === "FAIL" || v === "BLOCKED";
    }).length;
    let issuesLogged = 0;
    for (const list of Object.values(state.reviews)) {
      if (Array.isArray(list)) {
        issuesLogged += list.filter((r) => r.verdict === "FAIL" || r.verdict === "BLOCKED" || (r.category && r.category !== "None")).length;
      }
    }
    const prog = qs("#vrProgressNum");
    const iss = qs("#vrIssuesNum");
    const last = qs("#vrLastScreen");
    const resumeBtn = qs("#vrResumeReviewBtn");
    if (prog) prog.textContent = `${reviewedCount} / ${captured.length}`;
    if (iss) iss.textContent = String(issuesLogged);
    if (last) last.textContent = state.lastScreenId || "None yet";
    if (resumeBtn) resumeBtn.disabled = !state.lastScreenId;
  }

  function renderGallery() {
    applyFilters();
    updateGuidedBar();
    const showing = qs("#vrShowingCount");
    if (showing) {
      showing.textContent = `Showing ${filteredScreens.length} of ${allScreens.length} registry entries`;
    }
    const grid = qs("#vrGalleryGrid");
    if (!grid) return;
    if (!filteredScreens.length) {
      grid.innerHTML = `<div class="cafe-card" style="grid-column:1/-1;text-align:center;padding:28px"><strong>No screens match your current filters.</strong><p style="margin:6px 0 0;font-size:13px;color:#55665d">Clear search text or switch category/status filters back to All.</p></div>`;
      return;
    }

    grid.innerHTML = filteredScreens.map((s) => {
      const capMeta = statusBadgeMeta(s.capturesStatus);
      const revVerdict = getEffectiveVerdict(s.id);
      const revMeta = verdictBadgeMeta(revVerdict);
      const thumbInner = s.image
        ? `<img loading="lazy" src="${esc(s.image)}" alt="${esc(s.id + " — " + s.title)}"><span class="vr-thumb-tag">${esc(s.platform)} · ${esc(s.viewport)}</span>`
        : `<div class="vr-missing-art"><strong>${esc(capMeta.label)}</strong><span>No real PNG captured — never fabricated. Inspect details or try the simulated UI sandbox.</span></div>`;
      return `
        <article class="vr-card" data-screen-card="${esc(s.id)}">
          <button type="button" class="vr-thumb" data-open-screen="${esc(s.id)}" aria-label="Inspect ${esc(s.id)} ${esc(s.title)}">
            ${thumbInner}
          </button>
          <div class="vr-card-body">
            <div class="vr-card-top">
              <span class="vr-id">#${String(s.order).padStart(2, "0")} · ${esc(s.id)}</span>
              <span class="vr-badge ${capMeta.cls}">${esc(capMeta.label)}</span>
              <span class="vr-badge ${revMeta.cls}">${esc(revMeta.label)}</span>
            </div>
            <h3>${esc(s.title)}</h3>
            <div class="vr-card-meta">${esc(s.module)} · ${esc(s.role)} · Priority ${esc(s.priority)}${s.hash ? ` · SHA ${esc(s.hash.slice(0, 8))}` : ""}</div>
            <p class="vr-card-excerpt">${esc(s.observed)}</p>
            <div class="vr-card-actions">
              <button type="button" class="vr-btn-sm" data-open-screen="${esc(s.id)}">Inspect WHAT / WHY / SHOULD</button>
              ${s.sandboxRoute && s.sandboxRoute !== "qa-portal-info"
                ? `<button type="button" class="vr-btn-sm secondary" data-jump-sandbox="${esc(s.sandboxRoute)}" data-from-screen="${esc(s.id)}">Sandbox ↗</button>`
                : ""}
            </div>
          </div>
        </article>`;
    }).join("");
  }

  function renderViewerStage(screen) {
    const stage = qs("#viewerStage");
    if (!stage) return;
    stage.classList.toggle("side-by-side", showCompare);

    const zoomScale = activeZoom === "fit" ? 1 : Number(activeZoom) / 100;
    let leftHtml = "";
    if (screen.image) {
      const hotspotsHtml = showHotspots
        ? (screen.controlContracts || []).map((c) =>
            `<button type="button" class="hotspot-pin ${selectedHotspot === c.num ? "selected" : ""}" style="left:${c.x}%;top:${c.y}%" data-hotspot="${c.num}" title="#${c.num}: ${esc(c.label)}" aria-label="Control hotspot ${c.num}: ${esc(c.label)}">${c.num}</button>`
          ).join("")
        : "";
      leftHtml = `
        <div class="viewer-img-frame" style="${activeZoom === "fit" ? "" : `transform:scale(${zoomScale});width:${Math.round(100 * zoomScale)}%`}">
          <img src="${esc(screen.image)}" alt="${esc(screen.id + " — " + screen.title)}">
          ${hotspotsHtml}
        </div>`;
    } else {
      leftHtml = `
        <div class="vr-missing-art" style="min-height:320px;border-radius:8px">
          <strong>${esc(statusBadgeMeta(screen.capturesStatus).label)}</strong>
          <span>${esc(screen.observed)}</span>
        </div>`;
    }

    let rightCompareHtml = "";
    if (showCompare) {
      const checks = [
        ...(screen.controlContracts || []).map((c) => `<li><strong>#${c.num} ${esc(c.label)}:</strong> ${esc(c.expectedOutcome)} <em>(${esc(c.rolePermission)})</em></li>`),
        ...(screen.discrepancies || []).map((d) => `<li style="color:#991b1b"><strong>Discrepancy:</strong> ${esc(d)}</li>`)
      ].join("") || "<li>See 'What should be there' tab for full expected contract.</li>";
      rightCompareHtml = `
        <aside class="expected-compare-box" aria-label="Expected specification checklist">
          <div class="compare-banner">EXPECTED SPECIFICATION CHECKLIST — NOT A SCREENSHOT OR FAKE ORIGINAL</div>
          <h4 style="margin:0 0 8px">Expected Behavior &amp; Contract</h4>
          <p style="margin:0 0 10px">${esc(screen.expected)}</p>
          <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px">${checks}</ul>
        </aside>`;
    }

    stage.innerHTML = leftHtml + rightCompareHtml;
  }

  function renderViewerTab(screen) {
    const container = qs("#viewerTabContent");
    if (!container) return;
    document.querySelectorAll("[data-vtab]").forEach((btn) => {
      const isAct = btn.dataset.vtab === activeTab;
      btn.classList.toggle("active", isAct);
      btn.setAttribute("aria-selected", String(isAct));
    });

    if (activeTab === "what") {
      const rows = (screen.controlContracts || []).map((c) => `
        <tr class="${selectedHotspot === c.num ? "highlighted" : ""}" data-hotspot-row="${c.num}">
          <td><strong>#${c.num}</strong></td>
          <td><strong>${esc(c.label)}</strong><br><small>${esc(c.target)}</small></td>
          <td>${esc(c.expectedOutcome)}<br><small style="color:#92400e">Failure: ${esc(c.failureOutcome)}</small></td>
          <td>${esc(c.rolePermission)}<br><small style="color:#4b6156">${esc(c.evidenceScope)}</small></td>
        </tr>`).join("");
      container.innerHTML = `
        <h4>What Is Literally Visible On This Screen</h4>
        <p>${esc(screen.observed)}</p>
        ${screen.duplicateOf ? `<div class="cafe-alert warn"><strong>Documented Duplicate:</strong> Exact SHA-256 duplicate of <code>${esc(screen.duplicateOf)}</code>. Preserved 1:1 for audit completeness without storing duplicate binary bytes.</div>` : ""}
        ${rows ? `<h4>Visible Controls &amp; Numbered Hotspots</h4>
          <table class="control-table">
            <thead><tr><th>#</th><th>Control</th><th>Expected / Failure Outcome</th><th>Role &amp; Evidence Scope</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>` : ""}
        <div class="provenance-box">
          <strong>Capture Provenance:</strong> Source SHA <code>${esc(screen.sourceSha)}</code> · File <code>${esc(screen.originalFilename || "NONE")}</code> · Viewport <code>${esc(screen.viewport)}</code> · Bytes <code>${screen.bytes}</code> · Privacy <code>${esc(screen.privacyAudit)}</code><br>
          <strong>SHA-256:</strong> <code>${esc(screen.hash || "N/A (Missing / Human Required)")}</code>
        </div>`;
    } else if (activeTab === "why") {
      container.innerHTML = `
        <h4>Why This Screen Exists</h4>
        <p>${esc(screen.purpose)}</p>
        <h4>Workflow Context</h4>
        <ul>
          <li><strong>Platform / Module:</strong> ${esc(screen.platform)} — ${esc(screen.module)}</li>
          <li><strong>Operator Role:</strong> ${esc(screen.role)}</li>
          <li><strong>Workflow Stage:</strong> ${esc(screen.workflow)} (${esc(screen.state)})</li>
          <li><strong>Related Real-Build QA Cases:</strong> ${(screen.testCaseIds || []).map((cid) => `<button type="button" class="mini-link-btn" data-jump-case="${esc(cid)}">${esc(cid)} ↗</button>`).join(" ") || "None mapped"}</li>
        </ul>`;
    } else if (activeTab === "should") {
      const discs = (screen.discrepancies || []).length
        ? `<h4>Observed Discrepancies (Actual vs Expected)</h4><ul>${screen.discrepancies.map((d) => `<li style="color:#991b1b">${esc(d)}</li>`).join("")}</ul>`
        : `<h4>Observed Discrepancies</h4><p style="color:#14532d">No discrepancy observed against expected contract in this capture.</p>`;
      const issuesHtml = (screen.issues || []).length
        ? `<h4>Reported Application Defects (Dev-Salryn-Cafe — Not Patched Here)</h4>${screen.issues.map((iss) => `
          <div class="cafe-alert" style="margin-bottom:8px">
            <strong>${esc(iss.id)} (${esc(iss.severity)} · ${esc(iss.kind)}):</strong> ${esc(iss.summary)}<br>
            <small><strong>Safe Repro:</strong> ${esc(iss.repro)}</small>
          </div>`).join("")}`
        : "";
      container.innerHTML = `
        <h4>What Should Be There (Expected Contract)</h4>
        <p>${esc(screen.expected)}</p>
        <p style="font-size:11.5px;color:#4f6358"><strong>Grounded Reference:</strong> ${esc(screen.expectedEvidence)}</p>
        ${discs}
        ${issuesHtml}`;
    } else {
      const steps = (screen.testSteps || []).map((st) => `<li>${esc(st)}</li>`).join("");
      container.innerHTML = `
        <h4>Plain-Language Steps to Test</h4>
        <ol>${steps}</ol>
        <h4>Known Evidence Limitations</h4>
        <p>${esc(screen.limitations)}</p>
        <h4>Mapped Real-Build QA Cases</h4>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
          ${(screen.testCaseIds || []).map((cid) => `<button type="button" class="mini-link-btn" data-jump-case="${esc(cid)}">Open Case ${esc(cid)} ↗</button>`).join("") || "<span>None</span>"}
        </div>
        ${screen.sandboxRoute && screen.sandboxRoute !== "qa-portal-info"
          ? `<button type="button" class="vr-btn-sm" data-jump-sandbox="${esc(screen.sandboxRoute)}" data-from-screen="${esc(screen.id)}">Open Matching Interactive Sandbox Screen ↗</button>`
          : ""}`;
    }
  }

  function renderReviewForm(screen) {
    qs("#reviewTargetId").textContent = screen.id;
    const testerDefault = (qs("#qaTester") && qs("#qaTester").value.trim()) || state.defaultAlias || "";
    const latest = getLatestReview(screen.id);
    qs("#rvAlias").value = (latest && latest.reviewerAlias) || testerDefault;
    qs("#rvVerdict").value = (latest && latest.verdict) || "NOT RUN";
    qs("#rvSeverity").value = (latest && latest.severity) || screen.priority || "P2";
    qs("#rvCategory").value = (latest && latest.category) || "None";
    qs("#rvSource").value = (latest && latest.source) || (screen.image ? "REAL_SCREENSHOT" : "SIMULATED_SANDBOX");
    qs("#rvDevice").value = (latest && latest.device) || `${window.innerWidth}x${window.innerHeight}`;
    qs("#rvNotes").value = (latest && latest.notes) || "";
    qs("#rvSavedMsg").textContent = "";

    const histBox = qs("#reviewerHistory");
    const list = state.reviews[screen.id] || [];
    if (!list.length) {
      histBox.innerHTML = `<div style="font-size:11.5px;color:#5a6b62">No local reviews saved for ${esc(screen.id)} yet. Different reviewer aliases are stored separately so disagreements are preserved.</div>`;
    } else {
      histBox.innerHTML = `<div style="font-size:11px;font-weight:700;color:#2e4b3d">Saved Reviewer Records (${list.length}):</div>` +
        list.map((r) => `
          <div class="reviewer-entry">
            <strong>${esc(r.reviewerAlias)}</strong> · <span class="vr-badge ${verdictBadgeMeta(r.verdict).cls}">${esc(r.verdict)}</span> · ${esc(r.severity)} · ${esc(r.category)} · <small>${esc(r.source)} · ${esc((r.updatedAtUtc || "").slice(0, 16).replace("T", " "))}</small>
            ${r.notes ? `<div style="margin-top:4px">${esc(r.notes)}</div>` : ""}
          </div>`).join("");
    }
  }

  function openScreenViewer(screenId) {
    const screen = allScreens.find((s) => s.id === screenId);
    if (!screen) return;
    activeScreenId = screen.id;
    state.lastScreenId = screen.id;
    selectedHotspot = null;
    saveVisualState();

    const idx = filteredScreens.findIndex((s) => s.id === screen.id);
    const listRef = idx >= 0 ? filteredScreens : allScreens;
    const pos = idx >= 0 ? idx : allScreens.findIndex((s) => s.id === screen.id);

    const badge = statusBadgeMeta(screen.capturesStatus);
    const badgeEl = qs("#viewerStatusBadge");
    badgeEl.className = "vr-badge " + badge.cls;
    badgeEl.textContent = badge.label;
    qs("#viewerScreenId").textContent = screen.id;
    qs("#viewerTitle").textContent = screen.title;
    qs("#viewerCounter").textContent = `${pos + 1} / ${listRef.length}`;

    const nativeLink = qs("#openNativeImgLink");
    if (screen.image) {
      nativeLink.href = screen.image;
      nativeLink.style.display = "inline-block";
    } else {
      nativeLink.style.display = "none";
    }

    const sbBtn = qs("#viewerSandboxBtn");
    if (screen.sandboxRoute && screen.sandboxRoute !== "qa-portal-info") {
      sbBtn.style.display = "inline-block";
      sbBtn.dataset.route = screen.sandboxRoute;
    } else {
      sbBtn.style.display = "none";
    }

    renderViewerStage(screen);
    renderViewerTab(screen);
    renderReviewForm(screen);
    updateGuidedBar();

    const dlg = qs("#screenViewerDialog");
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
  }

  function stepViewer(delta) {
    const list = filteredScreens.length ? filteredScreens : allScreens;
    if (!list.length) return;
    let idx = list.findIndex((s) => s.id === activeScreenId);
    if (idx < 0) idx = 0;
    const nextIdx = (idx + delta + list.length) % list.length;
    openScreenViewer(list[nextIdx].id);
  }

  function saveCurrentReview(advanceNext) {
    if (!activeScreenId) return;
    const alias = (qs("#rvAlias").value || "").trim() || "Anonymous Tester";
    state.defaultAlias = alias;
    const entry = {
      screenId: activeScreenId,
      reviewerAlias: alias,
      verdict: qs("#rvVerdict").value || "NOT RUN",
      severity: qs("#rvSeverity").value || "P2",
      category: qs("#rvCategory").value || "None",
      source: qs("#rvSource").value || "REAL_SCREENSHOT",
      device: (qs("#rvDevice").value || "").trim(),
      notes: (qs("#rvNotes").value || "").trim(),
      updatedAtUtc: new Date().toISOString()
    };

    const existing = Array.isArray(state.reviews[activeScreenId]) ? [...state.reviews[activeScreenId]] : [];
    const sameIdx = existing.findIndex((r) => (r.reviewerAlias || "").toLowerCase() === alias.toLowerCase());
    if (sameIdx >= 0) existing[sameIdx] = entry;
    else existing.push(entry);
    state.reviews[activeScreenId] = existing;
    saveVisualState();
    renderGallery();
    const screen = allScreens.find((s) => s.id === activeScreenId);
    if (screen) renderReviewForm(screen);
    qs("#rvSavedMsg").textContent = "Saved locally on this device.";
    if (advanceNext) stepViewer(1);
  }

  function setZoom(z) {
    activeZoom = z;
    [["zoomFitBtn", "fit"], ["zoom100Btn", "100"], ["zoom150Btn", "150"], ["zoom200Btn", "200"]].forEach(([id, val]) => {
      const b = qs("#" + id);
      if (b) b.classList.toggle("active", activeZoom === val);
    });
    const screen = allScreens.find((s) => s.id === activeScreenId);
    if (screen) renderViewerStage(screen);
  }

  function bindEvents() {
    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest("[data-open-screen]");
      if (openBtn) {
        e.preventDefault();
        openScreenViewer(openBtn.dataset.openScreen);
        return;
      }
      const catBtn = e.target.closest("[data-vr-cat]");
      if (catBtn) {
        filters.category = catBtn.dataset.vrCat;
        renderCategoryPills();
        renderGallery();
        return;
      }
      const vtab = e.target.closest("[data-vtab]");
      if (vtab) {
        activeTab = vtab.dataset.vtab;
        const sc = allScreens.find((s) => s.id === activeScreenId);
        if (sc) renderViewerTab(sc);
        return;
      }
      const pin = e.target.closest("[data-hotspot]");
      if (pin) {
        selectedHotspot = Number(pin.dataset.hotspot);
        activeTab = "what";
        const sc = allScreens.find((s) => s.id === activeScreenId);
        if (sc) {
          renderViewerStage(sc);
          renderViewerTab(sc);
        }
        return;
      }
      const sbJump = e.target.closest("[data-jump-sandbox]");
      if (sbJump) {
        const dlg = qs("#screenViewerDialog");
        if (dlg && dlg.open) dlg.close();
        if (window.SalrynSandbox && typeof window.SalrynSandbox.navigate === "function") {
          window.SalrynSandbox.navigate(sbJump.dataset.jumpSandbox, sbJump.dataset.fromScreen || activeScreenId);
        }
        const sec = qs("#sandbox");
        if (sec) sec.scrollIntoView({ behavior: "smooth" });
        return;
      }
      const caseJump = e.target.closest("[data-jump-case]");
      if (caseJump) {
        const dlg = qs("#screenViewerDialog");
        if (dlg && dlg.open) dlg.close();
        const el = qs("#case-" + caseJump.dataset.jumpCase);
        if (el) {
          el.open = true;
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });

    qs("#vrStatusFilter")?.addEventListener("change", (e) => { filters.status = e.target.value; renderGallery(); });
    qs("#vrPriorityFilter")?.addEventListener("change", (e) => { filters.priority = e.target.value; renderGallery(); });
    qs("#vrReviewFilter")?.addEventListener("change", (e) => { filters.review = e.target.value; renderGallery(); });
    qs("#vrSearchInput")?.addEventListener("input", (e) => { filters.search = e.target.value; renderGallery(); });

    qs("#vrStartReviewBtn")?.addEventListener("click", () => {
      const nextUnreviewed = allScreens.find((s) => s.image && getEffectiveVerdict(s.id) === "UNREVIEWED") || allScreens[0];
      if (nextUnreviewed) openScreenViewer(nextUnreviewed.id);
    });
    qs("#vrResumeReviewBtn")?.addEventListener("click", () => {
      if (state.lastScreenId) openScreenViewer(state.lastScreenId);
    });
    qs("#vrExportManifestBtn")?.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
      const u = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = u;
      a.download = "Salryn-Cafe-Screens-Manifest-3d23ef4b.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(u), 1000);
    });

    qs("#viewerPrevBtn")?.addEventListener("click", () => stepViewer(-1));
    qs("#viewerNextBtn")?.addEventListener("click", () => stepViewer(1));
    qs("#viewerCloseBtn")?.addEventListener("click", () => qs("#screenViewerDialog")?.close());
    qs("#viewerSandboxBtn")?.addEventListener("click", (e) => {
      const route = e.currentTarget.dataset.route;
      qs("#screenViewerDialog")?.close();
      if (route && window.SalrynSandbox) {
        window.SalrynSandbox.navigate(route, activeScreenId);
        qs("#sandbox")?.scrollIntoView({ behavior: "smooth" });
      }
    });

    qs("#zoomFitBtn")?.addEventListener("click", () => setZoom("fit"));
    qs("#zoom100Btn")?.addEventListener("click", () => setZoom("100"));
    qs("#zoom150Btn")?.addEventListener("click", () => setZoom("150"));
    qs("#zoom200Btn")?.addEventListener("click", () => setZoom("200"));

    qs("#toggleHotspotsBtn")?.addEventListener("click", (e) => {
      showHotspots = !showHotspots;
      e.currentTarget.classList.toggle("active", showHotspots);
      e.currentTarget.setAttribute("aria-pressed", String(showHotspots));
      e.currentTarget.textContent = showHotspots ? "Hotspots: ON" : "Hotspots: OFF";
      const sc = allScreens.find((s) => s.id === activeScreenId);
      if (sc) renderViewerStage(sc);
    });

    qs("#toggleCompareBtn")?.addEventListener("click", (e) => {
      showCompare = !showCompare;
      e.currentTarget.classList.toggle("active", showCompare);
      e.currentTarget.setAttribute("aria-pressed", String(showCompare));
      e.currentTarget.textContent = showCompare ? "Side-by-Side Expected: ON" : "Side-by-Side Expected: OFF";
      const sc = allScreens.find((s) => s.id === activeScreenId);
      if (sc) renderViewerStage(sc);
    });

    qs("#screenReviewForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      saveCurrentReview(false);
    });
    qs("#rvSaveNextBtn")?.addEventListener("click", () => saveCurrentReview(true));

    document.addEventListener("keydown", (e) => {
      const dlg = qs("#screenViewerDialog");
      if (!dlg || !dlg.open) return;
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); stepViewer(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); stepViewer(1); }
      else if (e.key === "h" || e.key === "H") { qs("#toggleHotspotsBtn")?.click(); }
    });
  }

  // Expose safe public API for app.js dashboard, export/import, and sandbox back-links
  window.SalrynVisualReview = {
    openScreen: openScreenViewer,
    getManifest: () => manifest,
    getAllReviews: () => JSON.parse(JSON.stringify(state.reviews)),
    getSummary: () => {
      const captured = allScreens.filter((s) => s.image !== null);
      const missing = allScreens.filter((s) => s.image === null);
      let pass = 0, fail = 0, blocked = 0, notRun = 0, unreviewed = 0;
      const issues = [];
      for (const s of captured) {
        const v = getEffectiveVerdict(s.id);
        if (v === "PASS") pass++;
        else if (v === "FAIL") fail++;
        else if (v === "BLOCKED") blocked++;
        else if (v === "NOT RUN") notRun++;
        else unreviewed++;
      }
      for (const [sid, arr] of Object.entries(state.reviews)) {
        if (!Array.isArray(arr)) continue;
        for (const r of arr) {
          if (r.verdict === "FAIL" || r.verdict === "BLOCKED" || (r.category && r.category !== "None")) {
            issues.push({ screenId: sid, ...r });
          }
        }
      }
      const moduleCoverage = CATEGORY_LABELS.filter(([c]) => c !== "ALL" && c !== "MISSING-OR-HUMAN").map(([cat, label]) => {
        const group = captured.filter((s) => s.category === cat);
        const rev = group.filter((s) => {
          const v = getEffectiveVerdict(s.id);
          return v === "PASS" || v === "FAIL" || v === "BLOCKED";
        }).length;
        return { category: cat, label, total: group.length, reviewed: rev };
      });
      return { totalCaptured: captured.length, missingCount: missing.length, pass, fail, blocked, notRun, unreviewed, issues, moduleCoverage };
    },
    importReviews: (incomingReviews) => {
      if (!incomingReviews || typeof incomingReviews !== "object") return 0;
      let merged = 0;
      for (const [sid, list] of Object.entries(incomingReviews)) {
        if (sid === "__proto__" || sid === "constructor" || sid === "prototype") continue;
        if (!allScreens.some((s) => s.id === sid) || !Array.isArray(list)) continue;
        const cur = Array.isArray(state.reviews[sid]) ? [...state.reviews[sid]] : [];
        for (const item of list) {
          if (!item || typeof item !== "object") continue;
          const alias = String(item.reviewerAlias || "Imported Reviewer").slice(0, 80);
          const clean = {
            screenId: sid,
            reviewerAlias: alias,
            verdict: ["PASS", "FAIL", "BLOCKED", "NOT RUN"].includes(item.verdict) ? item.verdict : "NOT RUN",
            severity: ["P0", "P1", "P2", "P3"].includes(item.severity) ? item.severity : "P2",
            category: String(item.category || "None").slice(0, 60),
            source: ["REAL_SCREENSHOT", "SIMULATED_SANDBOX", "REAL_BUILD"].includes(item.source) ? item.source : "REAL_SCREENSHOT",
            device: String(item.device || "").slice(0, 100),
            notes: String(item.notes || "").slice(0, 2000),
            updatedAtUtc: String(item.updatedAtUtc || new Date().toISOString()).slice(0, 40)
          };
          const idx = cur.findIndex((x) => (x.reviewerAlias || "").toLowerCase() === alias.toLowerCase());
          if (idx >= 0) cur[idx] = clean;
          else cur.push(clean);
          merged++;
        }
        state.reviews[sid] = cur;
      }
      saveVisualState();
      renderGallery();
      return merged;
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    loadVisualState();
    renderDefectsPanel();
    renderCategoryPills();
    renderGallery();
    bindEvents();
  });
})();

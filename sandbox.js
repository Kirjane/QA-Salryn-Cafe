"use strict";

/* Kirjane Labs — Salryn Cafe Interactive Frontend Sandbox
   STRICTLY DEMO / SYNTHETIC DATA / ZERO BACKEND.
   Zero fetch(), zero real API calls, zero real payments/sync/hardware authority. */

(function () {
  const SB_STORE = "kirjane.salryn.cafe.sandbox.v1";
  const qs = (s, root = document) => root.querySelector(s);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const php = (cents) => "₱" + (Number(cents || 0) / 100).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const MENU_SEED = [
    {
      id: "spanish-latte", category: "Espresso Bar", name: "Spanish Latte", priceCents: 16500, unavailable: false,
      variants: [
        { id: "hot12", label: "Hot · 12oz", priceCents: 16500 },
        { id: "iced16", label: "Iced · 16oz", priceCents: 18000 }
      ],
      modifiers: [
        { group: "Milk Choice", required: true, min: 1, max: 1, options: [{ id: "whole", label: "Whole Fresh Milk", delta: 0 }, { id: "oat", label: "Barista Oat Milk", delta: 3500 }] },
        { group: "Espresso Boost", required: false, min: 0, max: 2, options: [{ id: "extra", label: "Extra Espresso Shot", delta: 4000 }, { id: "decaf", label: "Sub Decaf Roast", delta: 1500 }] }
      ]
    },
    { id: "matcha-latte", category: "Cold Brew & Matcha", name: "Ceremonial Matcha Latte", priceCents: 18500, unavailable: false, variants: [{ id: "iced16", label: "Iced · 16oz", priceCents: 18500 }], modifiers: [] },
    { id: "cold-brew", category: "Cold Brew & Matcha", name: "Yza Signature Cold Brew", priceCents: 15000, unavailable: false, variants: [{ id: "bottle12", label: "12oz Bottle", priceCents: 15000 }], modifiers: [] },
    { id: "ensaymada", category: "Pastries & Bakery", name: "Ensaymada Brioche", priceCents: 9500, unavailable: false, variants: [{ id: "whole", label: "Whole Brioche", priceCents: 9500 }], modifiers: [] },
    { id: "croissant", category: "Pastries & Bakery", name: "French Butter Croissant", priceCents: 11000, unavailable: false, variants: [{ id: "classic", label: "Classic Fold", priceCents: 11000 }], modifiers: [] },
    { id: "mango-tart", category: "Pastries & Bakery", name: "Seasonal Guimaras Mango Tart", priceCents: 14500, unavailable: true, variants: [{ id: "slice", label: "Tart Slice", priceCents: 14500 }], modifiers: [] }
  ];

  function createSeedState(preset = "happy") {
    const empty = preset === "empty";
    const errMode = preset === "error";
    const offline = preset === "offline";
    const denied = preset === "permission-denied";
    return {
      surface: "win-cashier",
      boArea: "area-a",
      role: denied ? "restricted-cashier" : "admin",
      preset,
      viewport: "desktop",
      fromScreenId: null,
      shiftOpen: !empty,
      openingCashCents: empty ? 0 : 150000,
      expectedCashCents: empty ? 0 : 196000,
      lastVariance: null,
      categoryFilter: "All",
      menuSearch: "",
      serviceMode: "Dine-In",
      tableRef: "Table 04",
      cart: empty ? [] : [
        { lineId: "L1", productId: "spanish-latte", name: "Spanish Latte (Hot · 12oz)", mods: "Barista Oat Milk, Extra Espresso Shot", note: "Less ice, light condensed", qty: 2, unitCents: 24000 }
      ],
      activeOrderId: null,
      orderFilterChannel: "ALL",
      orderFilterState: "ALL",
      kdsFilter: "ALL",
      checkoutTender: "Cash",
      checkoutCustomerId: "cust-1",
      checkoutDiscountPhp: "20.00",
      checkoutDiscountReason: "Barista Loyalty Promo",
      checkoutCashPhp: "460.00",
      checkoutArPhp: "0.00",
      lastReceipt: null,
      pendingIntent: errMode ? { opId: "80481522-5843-4dac-87e2-07592b4f0181", endpoint: "/api/cafe/orders/.../submit", reason: "Simulated version conflict (HTTP 409) — original operationId retained." } : null,
      toast: null,
      modal: null,
      orders: empty ? [] : [
        { id: "ORD-101", ref: "Table 04", mode: "Dine-In", state: "Ready", updated: "04:30 PM", totalCents: 48000, lines: ["2× Spanish Latte (Hot · 12oz) — Oat Milk, Extra Shot"] },
        { id: "ORD-102", ref: "Walk-In #08", mode: "Takeout", state: "Submitted", updated: "04:31 PM", totalCents: 28000, lines: ["1× Ceremonial Matcha Latte", "1× Ensaymada Brioche"] },
        { id: "ORD-103", ref: "Buzzer #12", mode: "Takeout", state: "Parked", updated: "04:32 PM", totalCents: 15000, lines: ["1× Yza Signature Cold Brew"] },
        { id: "ORD-100", ref: "Table 01", mode: "Dine-In", state: "Completed", receiptNo: "SLRN-DEMO-000037", updated: "04:15 PM", totalCents: 46000, cashCents: 46000, arCents: 0, lines: ["2× Spanish Latte (Hot · 12oz)"] }
      ],
      customers: [
        { id: "cust-1", name: "Atelier Coworking Corp.", balanceCents: empty ? 0 : 215000 },
        { id: "cust-2", name: "Bayanihan Study Lounge", balanceCents: empty ? 0 : 120000 },
        { id: "cust-3", name: "Clara Reyes (Synthetic Credit)", balanceCents: empty ? 0 : 81500 }
      ],
      ingredients: [
        { id: "ing-oat", name: "Barista Oat Milk", unit: "Milliliter", onHand: empty ? 8000 : 99300, reorder: 12000 },
        { id: "ing-beans", name: "Bukidnon Arabica Beans", unit: "Gram", onHand: 12532, reorder: 250 },
        { id: "ing-brioche", name: "Brioche Dough Ball", unit: "Piece", onHand: empty ? 12 : 129, reorder: 24 }
      ],
      cashLedger: empty ? [] : [
        { type: "SaleCashReceipt", deltaCents: 46000, reason: "POS checkout retained cash (SLRN-DEMO-000037)", at: "4:15 PM" },
        { type: "ReceivableCashCollection", deltaCents: 2500, reason: "AR Cash collection — Atelier Coworking", at: "4:20 PM" },
        { type: "OperationalExpense", deltaCents: -12000, reason: "Artisanal ice & paper cups", at: "4:25 PM" }
      ],
      refunds: empty ? [] : [
        { id: "REF-01", receiptNo: "SLRN-DEMO-000037", state: "Approved", totalCents: 15000, reason: "Customer requested hot drink instead of iced", disposition: "ServiceNoStock" }
      ],
      deliveries: empty ? [] : [
        { id: "DEL-19", ref: "Delivery #19 · Synthetic St.", state: "Pending", at: "4:27 PM" }
      ],
      bookings: empty ? [] : [
        { id: "BK-01", event: "Synthetic Coffee Cart Pop-Up (40 cups)", date: "2026-11-28", status: "Confirmed" }
      ],
      attendance: empty ? [] : [{ event: "ClockIn", actor: "Maria Santos (Manager)", at: "08:00 AM" }],
      incidents: [],
      audit: [
        { action: "USER_LOGIN", entity: "Maria Santos (Manager)", reason: "Simulated Host sign-in", at: "08:00 AM" },
        { action: "BACKUP_CREATED", entity: "backup-demo-20261122", reason: "Synthetic backup snapshot", at: "04:27 PM" }
      ],
      storeSettings: { storeName: "Cafe Yza (Synthetic Demo)", receiptHeader: "Salryn Cafe — Demo Store", receiptFooter: "Thank you for visiting! (PREVIEW ONLY)" },
      lanEnabled: false,
      lanJoinCode: null,
      centralJoinCode: "DEMO-8842",
      centralDevices: [
        { id: "dev-1", name: "Counter LAN Terminal 01", role: "LanThinTerminal", status: "Active", lastSeen: "Just now" },
        { id: "dev-2", name: "Patio Barista Kiosk", role: "OfflineAndroidCashier", status: "Pending", lastSeen: "Never" },
        { id: "dev-3", name: "Pop-Up Cart Tablet (Fenced)", role: "OfflineAndroidCashier", status: "Revoked", lastSeen: "Yesterday" }
      ],
      quarantine: empty ? [] : [
        { id: "Q-901", device: "Pop-Up Cart Tablet (Fenced)", opType: "SaleCommittedV1", amountCents: 16500, status: "AdminReviewRequired" }
      ],
      backups: [
        { id: "backup-demo-20261122-01", size: "4336.0 KB", created: "Today, 4:27 PM", verified: true }
      ],
      android: {
        screen: offline ? "cashier" : "cashier",
        signedIn: !denied,
        paired: true,
        offline,
        shiftOpen: !empty,
        stuckIntentBug: errMode,
        serviceMode: "Dine-In",
        tableRef: "Table 7",
        cart: empty ? [] : [{ name: "Spanish Latte (Hot · 12oz)", qty: 1, unitCents: 16500 }],
        savedOrderState: null, // Open -> Submitted -> Preparing -> Ready -> Completed
        outboxQueue: offline ? [{ id: "OP-OFF-01", type: "CafeShiftOpenedV1", status: "PendingUpload" }] : [],
        statusMsg: errMode
          ? "Action outcome is unconfirmed. Saved requests are preserved (reproducing 3d23ef4b AndroidKeyStoreSecretStore.WriteAsync([]) ArgumentException)."
          : offline
            ? "Offline Mode active — operations queue locally in Android SQLite outbox until Reconnect & Sync."
            : "Signed in on synthetic Android Cashier browser replica."
      },
      nextReceiptSeq: 40
    };
  }

  let sb = createSeedState("happy");

  function loadSb() {
    try {
      const saved = JSON.parse(localStorage.getItem(SB_STORE) || "null");
      if (saved && typeof saved === "object" && Array.isArray(saved.orders)) {
        sb = { ...createSeedState(saved.preset || "happy"), ...saved };
      }
    } catch { /* ignore */ }
  }
  function saveSb() {
    try { localStorage.setItem(SB_STORE, JSON.stringify(sb)); } catch { /* ignore */ }
  }

  const SURFACE_SHOTS = {
    "win-cashier": ["WIN-CASH-02", "WIN-CASH-04", "WIN-CASH-07", "WIN-CASH-08", "WIN-CASH-11", "WIN-CASH-13"],
    "win-orders": ["WIN-ORD-01", "WIN-ORD-02", "WIN-ORD-03", "DLG-04"],
    "win-kitchen": ["WIN-KDS-01", "WIN-KDS-02", "RESP-05"],
    "win-backoffice": ["WIN-BO-A", "WIN-BO-B", "WIN-BO-C", "WIN-BO-D", "WIN-BO-E", "WIN-BO-F", "WIN-BO-G", "WIN-BO-H"],
    "central": ["CEN-01", "CEN-02", "CEN-04", "CEN-05", "DLG-07"],
    "android": ["AND-01", "AND-04", "AND-06", "AND-07", "AND-09", "AND-10", "ERR-14"]
  };

  function setToast(kind, text) {
    sb.toast = { kind, text };
    saveSb();
    renderSandbox();
  }

  function renderContextStrip() {
    const strip = qs("#sbContextStrip");
    if (!strip) return;
    const shots = SURFACE_SHOTS[sb.surface] || [];
    const backBtn = sb.fromScreenId
      ? `<button type="button" class="sb-shot-chip" style="background:#174735;border-color:#abdfc4" data-open-screen="${esc(sb.fromScreenId)}">← Back to ${esc(sb.fromScreenId)}</button>`
      : "";
    const scopeNote = sb.surface === "android"
      ? "Browser visual replica of MainActivity.cs (NOT native APK logic). Real APK testing required for Keystore, TLS, and Bluetooth."
      : "Interactive UI workflow simulation (local browser state only). Real build required for SQLite durability, payments, and printing.";
    strip.innerHTML = `
      <div><strong>Simulation Scope:</strong> ${esc(scopeNote)}</div>
      <div class="sb-shot-links">
        ${backBtn}
        <span style="font-size:11px;color:#d6b99c">Real screenshots:</span>
        ${shots.map((sid) => `<button type="button" class="sb-shot-chip" data-open-screen="${esc(sid)}">${esc(sid)} ↗</button>`).join("")}
      </div>`;
  }

  function syncToolbarControls() {
    document.querySelectorAll("[data-surface]").forEach((btn) => {
      const act = btn.dataset.surface === sb.surface;
      btn.classList.toggle("active", act);
      btn.setAttribute("aria-selected", String(act));
    });
    const r = qs("#sbRoleSelect"); if (r) r.value = sb.role;
    const p = qs("#sbPresetSelect"); if (p) p.value = sb.preset;
    const v = qs("#sbViewportSelect"); if (v) v.value = sb.viewport;
  }

  function renderTopBar(subtitle, liveBadge) {
    const roleLabel = sb.role === "admin" ? "Maria Santos (Manager · Admin)"
      : sb.role === "restricted-cashier" ? "Leo Cruz (Cashier · Restricted)"
      : sb.role === "central-owner" ? "Cafe Yza Owner (Central Admin)"
      : "Signed Out";
    return `
      <div class="cafe-topbar">
        <div class="cafe-topbar-brand">
          <div class="cafe-mark-sm">S</div>
          <div><strong>Salryn Cafe</strong><br><small style="color:#e9d5bb">${esc(subtitle)}</small></div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <span class="cafe-pill sim">DEMO / SYNTHETIC / ZERO BACKEND</span>
          <span class="cafe-pill ${sb.preset === "offline" ? "warn" : ""}">${esc(liveBadge)}</span>
          <span style="font-size:11.5px;color:#fff4e1">${esc(roleLabel)}</span>
          ${sb.role !== "signed-out" ? `<button type="button" class="cafe-btn outline" style="padding:4px 9px;font-size:11px" data-sb-act="signout">Sign out</button>` : ""}
        </div>
      </div>`;
  }

  function renderSignedOutGate(surfaceTitle) {
    return `
      <div style="padding:36px 20px;display:flex;justify-content:center">
        <div class="cafe-card" style="max-width:410px;width:100%">
          <div style="font-size:10.5px;font-weight:800;color:#735447;letter-spacing:.08em">SALRYN CAFE · SYNTHETIC DEMO</div>
          <h4 style="font-size:20px;margin:4px 0 8px">${esc(surfaceTitle)}</h4>
          <p style="font-size:12.5px;color:#735447;margin:0 0 12px">Choose a simulated operator role below (no real password required — zero backend).</p>
          ${sb.preset === "error" ? `<div class="cafe-alert" style="margin-bottom:10px">Simulated HTTP 401: Invalid username or password. Switch preset or pick a valid demo role.</div>` : ""}
          <div style="display:flex;flex-direction:column;gap:8px">
            <button type="button" class="cafe-btn" data-sb-act="signin-role" data-val="admin">Sign in as Maria Santos (Admin / Manager)</button>
            <button type="button" class="cafe-btn outline" data-sb-act="signin-role" data-val="restricted-cashier">Sign in as Leo Cruz (Restricted Cashier — Cash Only)</button>
            <button type="button" class="cafe-btn outline" data-sb-act="signin-role" data-val="central-owner">Sign in as Cafe Yza Owner (Central Portal)</button>
          </div>
        </div>
      </div>`;
  }

  function renderModalOverlay() {
    if (!sb.modal) return "";
    if (sb.modal.type === "customize") {
      const item = MENU_SEED.find((m) => m.id === sb.modal.productId) || MENU_SEED[0];
      return `
        <div class="cafe-modal-inline" style="margin-bottom:12px">
          <div class="cafe-modal-head"><span>Configure ${esc(item.name)} (Demo Customization)</span><button type="button" class="cafe-btn outline" style="padding:3px 8px" data-sb-act="close-modal">✕</button></div>
          <form class="cafe-modal-body" data-sb-form="add-custom-item" data-product="${esc(item.id)}">
            <label><strong>Variant</strong>
              <select name="variant" class="cafe-input">${item.variants.map((v) => `<option value="${esc(v.id)}">${esc(v.label)} (${php(v.priceCents)})</option>`).join("")}</select>
            </label>
            ${item.modifiers.map((g) => `
              <fieldset style="border:1px solid #e9d5bb;border-radius:6px;padding:8px 10px">
                <legend style="font-size:11.5px;font-weight:700">${esc(g.group)} · choose ${g.min}–${g.max}</legend>
                ${g.options.map((o, idx) => `<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="${g.max === 1 ? "radio" : "checkbox"}" name="mod_${esc(g.group)}" value="${esc(o.id)}" ${g.required && idx === 0 ? "checked" : ""}> ${esc(o.label)} ${o.delta ? `(+${php(o.delta)})` : ""}</label>`).join("")}
              </fieldset>`).join("")}
            <label><strong>Barista / Kitchen Note</strong><input name="note" class="cafe-input" placeholder="e.g. Less ice, light condensed"></label>
            <div style="display:flex;gap:8px;justify-content:flex-end">
              <button type="button" class="cafe-btn outline" data-sb-act="close-modal">Cancel</button>
              <button type="submit" class="cafe-btn">Add to Ticket</button>
            </div>
          </form>
        </div>`;
    }
    if (sb.modal.type === "open-shift") {
      return `
        <div class="cafe-modal-inline" style="margin-bottom:12px">
          <div class="cafe-modal-head"><span>Open Cashier Shift (Simulated)</span><button type="button" class="cafe-btn outline" style="padding:3px 8px" data-sb-act="close-modal">✕</button></div>
          <form class="cafe-modal-body" data-sb-form="open-shift">
            <label><strong>Opening Cash Float (PHP) *</strong><input name="openingCash" class="cafe-input" value="1500.00" required></label>
            <div style="display:flex;gap:8px;justify-content:flex-end">
              <button type="button" class="cafe-btn outline" data-sb-act="close-modal">Cancel</button>
              <button type="submit" class="cafe-btn">Open Shift</button>
            </div>
          </form>
        </div>`;
    }
    if (sb.modal.type === "blind-close") {
      return `
        <div class="cafe-modal-inline" style="margin-bottom:12px">
          <div class="cafe-modal-head"><span>Blind Shift Close (Expected Cash Hidden)</span><button type="button" class="cafe-btn outline" style="padding:3px 8px" data-sb-act="close-modal">✕</button></div>
          <form class="cafe-modal-body" data-sb-form="blind-close">
            <p style="margin:0;color:#735447">Enter your physical drawer cash count. Expected totals are revealed <strong>only after submission</strong>.</p>
            ${sb.modal.err ? `<div class="cafe-alert">${esc(sb.modal.err)}</div>` : ""}
            <label><strong>Counted Drawer Cash (PHP) *</strong><input name="countedCash" class="cafe-input" value="${esc(sb.modal.val || "1650.00")}"></label>
            <small style="color:#735447">Expected cash is hidden until count submission.</small>
            <div style="display:flex;gap:8px;justify-content:flex-end">
              <button type="button" class="cafe-btn outline" data-sb-act="close-modal">Close</button>
              <button type="submit" class="cafe-btn">Submit Blind Count</button>
            </div>
          </form>
        </div>`;
    }
    if (sb.modal.type === "blind-close-result") {
      const v = sb.lastVariance || { countedCents: 165000, expectedCents: 196000, varianceCents: -31000 };
      return `
        <div class="cafe-modal-inline" style="margin-bottom:12px">
          <div class="cafe-modal-head"><span>Blind Shift Close — Simulated Variance Result</span><button type="button" class="cafe-btn outline" style="padding:3px 8px" data-sb-act="close-modal">✕</button></div>
          <div class="cafe-modal-body">
            <div class="cafe-alert warn"><strong>Shift Variance Computed (Simulation):</strong> Counted ${php(v.countedCents)} vs Expected ${php(v.expectedCents)}</div>
            <div style="font-size:15px;font-weight:800">Variance: ${v.varianceCents < 0 ? "-" : ""}${php(Math.abs(v.varianceCents))}</div>
            <div style="display:flex;justify-content:flex-end"><button type="button" class="cafe-btn outline" data-sb-act="close-modal">Close</button></div>
          </div>
        </div>`;
    }
    if (sb.modal.type === "cancel-order") {
      return `
        <div class="cafe-modal-inline" style="margin-bottom:12px">
          <div class="cafe-modal-head"><span>Cancel Order · ${esc(sb.modal.orderId)}</span><button type="button" class="cafe-btn outline" style="padding:3px 8px" data-sb-act="close-modal">✕</button></div>
          <form class="cafe-modal-body" data-sb-form="cancel-order" data-order="${esc(sb.modal.orderId)}">
            <label><strong>Mandatory Cancellation Reason *</strong><input name="reason" class="cafe-input" placeholder="e.g. Customer changed mind" required></label>
            <div style="display:flex;gap:8px;justify-content:flex-end">
              <button type="button" class="cafe-btn outline" data-sb-act="close-modal">Keep Order</button>
              <button type="submit" class="cafe-btn danger">Confirm Cancellation</button>
            </div>
          </form>
        </div>`;
    }
    if (sb.modal.type === "receipt-preview") {
      const r = sb.modal.receipt || sb.lastReceipt;
      return `
        <div class="cafe-modal-inline" style="margin-bottom:12px">
          <div class="cafe-modal-head"><span>Receipt Preview — PREVIEW ONLY (NOT A REAL PRINTER OR FISCAL RECEIPT)</span><button type="button" class="cafe-btn outline" style="padding:3px 8px" data-sb-act="close-modal">✕</button></div>
          <div class="cafe-modal-body" style="font-family:ui-monospace,Consolas,monospace;background:#fffdf9">
            <div style="text-align:center;border-bottom:1px dashed #934719;padding-bottom:8px">
              <strong>${esc(sb.storeSettings.storeName)}</strong><br>
              ${esc(sb.storeSettings.receiptHeader)}<br>
              Receipt: ${esc(r.receiptNo)} · DEMO PREVIEW ONLY
            </div>
            <div>${(r.lines || []).map((l) => `<div>${esc(l)}</div>`).join("")}</div>
            <div style="border-top:1px dashed #934719;padding-top:8px">
              Discount: ${php(r.discountCents || 0)}<br>
              <strong>Net Total: ${php(r.totalCents)}</strong><br>
              Tender: ${esc(r.tender)} (Cash ${php(r.cashCents || 0)} / AR ${php(r.arCents || 0)})
            </div>
            <div style="text-align:center;font-size:11px;color:#735447">${esc(sb.storeSettings.receiptFooter)}</div>
          </div>
        </div>`;
    }
    if (sb.modal.type === "commit-refund") {
      const ref = sb.refunds.find((x) => x.id === sb.modal.refundId) || sb.refunds[0];
      return `
        <div class="cafe-modal-inline" style="margin-bottom:12px">
          <div class="cafe-modal-head"><span>Commit C5 Refund · ${esc(ref ? ref.receiptNo : "DEMO")}</span><button type="button" class="cafe-btn outline" style="padding:3px 8px" data-sb-act="close-modal">✕</button></div>
          <form class="cafe-modal-body" data-sb-form="commit-refund" data-refund="${esc(ref ? ref.id : "")}">
            <p style="margin:0;color:#735447">Only Cash and Accounts Receivable reversals are permitted. Requires an open cashier shift for Cash refunds.</p>
            ${sb.preset === "error" ? `<div class="cafe-alert">Simulated ERR_NETWORK_UNKNOWN: Original operationId retained for safe retry without double refund.</div>` : ""}
            <label><strong>Cash Refund Reversal (PHP)</strong><input name="cashPhp" class="cafe-input" value="50.00"></label>
            <label><strong>Accounts Receivable Credit Reversal (PHP)</strong><input name="arPhp" class="cafe-input" value="100.00"></label>
            <div style="display:flex;gap:8px;justify-content:flex-end">
              <button type="button" class="cafe-btn outline" data-sb-act="close-modal">Cancel</button>
              <button type="submit" class="cafe-btn">Confirm &amp; Commit Refund (Demo)</button>
            </div>
          </form>
        </div>`;
    }
    if (sb.modal.type === "restore-backup") {
      return `
        <div class="cafe-modal-inline" style="margin-bottom:12px">
          <div class="cafe-modal-head"><span>Restore Backup · ${esc(sb.modal.backupId)}</span><button type="button" class="cafe-btn outline" style="padding:3px 8px" data-sb-act="close-modal">✕</button></div>
          <form class="cafe-modal-body" data-sb-form="restore-backup">
            <p style="margin:0">Type <strong>RESTORE</strong> in uppercase to simulate replacing the local demo database.</p>
            <label><strong>Confirmation ("RESTORE") *</strong><input name="confirmText" class="cafe-input" placeholder="RESTORE" required></label>
            <div style="display:flex;gap:8px;justify-content:flex-end">
              <button type="button" class="cafe-btn outline" data-sb-act="close-modal">Cancel</button>
              <button type="submit" class="cafe-btn danger">Simulate Restore</button>
            </div>
          </form>
        </div>`;
    }
    if (sb.modal.type === "revoke-device") {
      return `
        <div class="cafe-modal-inline" style="margin-bottom:12px">
          <div class="cafe-modal-head"><span>Revoke ${esc(sb.modal.deviceName)}?</span><button type="button" class="cafe-btn outline" style="padding:3px 8px" data-sb-act="close-modal">✕</button></div>
          <div class="cafe-modal-body">
            <p style="margin:0">Immediately revokes synthetic sync credentials and fences offline outbox replay on reconnect.</p>
            <div style="display:flex;gap:8px;justify-content:flex-end">
              <button type="button" class="cafe-btn outline" data-sb-act="close-modal">Cancel</button>
              <button type="button" class="cafe-btn danger" data-sb-act="confirm-revoke" data-dev="${esc(sb.modal.deviceId)}">Revoke device</button>
            </div>
          </div>
        </div>`;
    }
    if (sb.modal.type === "bt-permission") {
      return `
        <div class="cafe-modal-inline" style="margin-bottom:12px">
          <div class="cafe-modal-head"><span>Android OS Runtime Permission Preview</span><button type="button" class="cafe-btn outline" style="padding:3px 8px" data-sb-act="close-modal">✕</button></div>
          <div class="cafe-modal-body">
            <p style="margin:0"><strong>Allow Salryn Cafe to find, connect to, and determine the relative position of nearby devices?</strong> (Separated from Central device trust keys per ADR-I4.)</p>
            <div style="display:flex;gap:8px;justify-content:flex-end">
              <button type="button" class="cafe-btn outline" data-sb-act="bt-choice" data-val="denied">Don't allow</button>
              <button type="button" class="cafe-btn" data-sb-act="bt-choice" data-val="allowed">Allow (Simulated)</button>
            </div>
          </div>
        </div>`;
    }
    return "";
  }

  function renderWindowsPosSidebar(active) {
    const activeOrdersCount = sb.orders.length;
    const kdsCount = sb.orders.filter((o) => o.state === "Submitted" || o.state === "Preparing").length;
    return `
      <aside class="cafe-sidebar" aria-label="Simulated Workstation Navigation">
        <button type="button" class="cafe-sidebar-btn ${active === "win-cashier" ? "active" : ""}" data-sb-nav="win-cashier"><span>Cafe Cashier</span></button>
        <button type="button" class="cafe-sidebar-btn ${active === "win-orders" ? "active" : ""}" data-sb-nav="win-orders"><span>Orders &amp; Lifecycle</span><span class="cafe-pill info">${activeOrdersCount}</span></button>
        <button type="button" class="cafe-sidebar-btn ${active === "win-kitchen" ? "active" : ""}" data-sb-nav="win-kitchen"><span>Kitchen &amp; Barista</span><span class="cafe-pill warn">${kdsCount}</span></button>
        <button type="button" class="cafe-sidebar-btn" data-sb-nav="win-backoffice"><span>Back Office &amp; Reports ↗</span></button>
      </aside>`;
  }

  function renderWinCashier() {
    if (sb.role === "signed-out") return renderTopBar("Local Host Workstation (Simulated)", "Signed Out") + renderSignedOutGate("Cafe Workstation Sign In");
    const restricted = sb.role === "restricted-cashier";
    const cats = ["All", "Espresso Bar", "Cold Brew & Matcha", "Pastries & Bakery"];
    const q = sb.menuSearch.toLowerCase().trim();
    const visibleMenu = MENU_SEED.filter((m) => (sb.categoryFilter === "All" || m.category === sb.categoryFilter) && (!q || m.name.toLowerCase().includes(q)));
    const cartSubtotal = sb.cart.reduce((s, l) => s + l.qty * l.unitCents, 0);
    const activeOrder = sb.orders.find((o) => o.id === sb.activeOrderId) || null;
    const isReadyForPay = activeOrder && activeOrder.state === "Ready";

    return renderTopBar("Local Host Workstation (Salryn.Cafe · Simulated)", sb.preset === "offline" ? "Host Disconnected (Sim)" : "Simulated Local State") + `
      <div class="cafe-layout">
        ${renderWindowsPosSidebar("win-cashier")}
        <div class="cafe-main">
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between">
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              <strong>Cafe workstation</strong>
              <span class="cafe-pill ${sb.shiftOpen ? "info" : "warn"}">${sb.shiftOpen ? "Shift Open" : "Shift Closed / Unopened"}</span>
              ${restricted ? `<span class="cafe-pill warn">Cashier RBAC: AR Disabled</span>` : ""}
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              ${sb.shiftOpen
                ? `<button type="button" class="cafe-btn outline" data-sb-act="open-modal" data-modal="blind-close">Blind Shift Close</button>`
                : `<button type="button" class="cafe-btn" data-sb-act="open-modal" data-modal="open-shift">Open Shift</button>`}
            </div>
          </div>

          ${sb.toast ? `<div class="cafe-alert ${sb.toast.kind === "ok" ? "ok" : sb.toast.kind === "warn" ? "warn" : ""}">${esc(sb.toast.text)}</div>` : ""}

          ${sb.pendingIntent ? `
            <div class="cafe-card" style="border-color:#dc2626;background:#fff8f8">
              <h4>Action needs confirmation (Retained OperationId)</h4>
              <div class="cafe-alert" style="margin-bottom:8px">${esc(sb.pendingIntent.reason)} · <code>${esc(sb.pendingIntent.opId)}</code></div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
                <button type="button" class="cafe-btn copper" data-sb-act="retry-pending">Retry retained request</button>
                <input id="sbArchiveReason" class="cafe-input" style="max-width:260px" placeholder="Reason to archive rejected request...">
                <button type="button" class="cafe-btn outline" data-sb-act="archive-pending">Archive rejected request</button>
              </div>
            </div>` : ""}

          ${renderModalOverlay()}

          <div class="cafe-pos-grid">
            <div class="cafe-card">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
                <h4 style="margin:0">Published Cafe Menu</h4>
                <span class="cafe-pill warn">Cash / AR / Partial Cash+AR</span>
              </div>
              <input class="cafe-input" style="margin-top:8px" data-sb-input="menuSearch" value="${esc(sb.menuSearch)}" placeholder="Search Cafe Menu (F2)...">
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
                ${cats.map((c) => `<button type="button" class="cafe-btn ${sb.categoryFilter === c ? "" : "outline"}" style="padding:5px 10px;font-size:11px" data-sb-act="set-cat" data-val="${esc(c)}">${esc(c)}</button>`).join("")}
              </div>
              <div class="cafe-menu-grid">
                ${visibleMenu.map((m) => `
                  <button type="button" class="cafe-menu-item" ${m.unavailable ? "disabled" : ""} data-sb-act="pick-item" data-val="${esc(m.id)}">
                    <strong>${esc(m.name)}</strong>
                    <span style="font-size:12px;color:#735447">${m.unavailable ? "86'd / Unavailable" : php(m.priceCents)}</span>
                  </button>`).join("")}
              </div>
            </div>

            <div class="cafe-card">
              ${isReadyForPay ? `
                <h4>Checkout · ${esc(activeOrder.ref)} (${esc(activeOrder.state)})</h4>
                <div style="margin-bottom:8px">${activeOrder.lines.map((l) => `<div style="font-size:12px">${esc(l)}</div>`).join("")}</div>
                <div style="background:#f7ece0;padding:8px 10px;border-radius:6px;font-weight:800;display:flex;justify-content:space-between;margin-bottom:10px">
                  <span>Confirmed order total</span><span>${php(activeOrder.totalCents)}</span>
                </div>
                <form data-sb-form="checkout" data-order="${esc(activeOrder.id)}" style="display:flex;flex-direction:column;gap:8px">
                  <label><strong>Tender (Locked Cafe Policy)</strong>
                    <select name="tender" class="cafe-input" data-sb-change="checkoutTender">
                      <option value="Cash" ${sb.checkoutTender === "Cash" ? "selected" : ""}>Cash</option>
                      <option value="AccountsReceivable" ${restricted ? "disabled" : ""} ${sb.checkoutTender === "AccountsReceivable" ? "selected" : ""}>Accounts Receivable ${restricted ? "(Requires Credit Permission)" : ""}</option>
                      <option value="PartialCashAr" ${restricted ? "disabled" : ""} ${sb.checkoutTender === "PartialCashAr" ? "selected" : ""}>Partial Cash + Accounts Receivable ${restricted ? "(Requires Credit Permission)" : ""}</option>
                    </select>
                  </label>
                  ${sb.checkoutTender !== "Cash" ? `
                    <label><strong>Credit Customer (Synthetic)</strong>
                      <select name="customerId" class="cafe-input">${sb.customers.map((c) => `<option value="${esc(c.id)}">${esc(c.name)} (Bal ${php(c.balanceCents)})</option>`).join("")}</select>
                    </label>` : ""}
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                    <label><strong>Order discount (PHP)</strong><input name="discount" class="cafe-input" value="${esc(sb.checkoutDiscountPhp)}"></label>
                    <label><strong>Discount reason</strong><input name="discountReason" class="cafe-input" value="${esc(sb.checkoutDiscountReason)}"></label>
                  </div>
                  ${sb.checkoutTender === "PartialCashAr" ? `
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                      <label><strong>Cash portion (PHP)</strong><input name="cashPhp" class="cafe-input" value="100.00"></label>
                      <label><strong>AR portion (PHP)</strong><input name="arPhp" class="cafe-input" value="${((activeOrder.totalCents - 10000) / 100).toFixed(2)}"></label>
                    </div>` : ""}
                  <div style="display:flex;gap:8px;flex-wrap:wrap">
                    <button type="submit" class="cafe-btn" ${!sb.shiftOpen ? "disabled" : ""}>Complete payment (Demo)</button>
                    <button type="button" class="cafe-btn outline" data-sb-act="clear-active-order">Back to Draft</button>
                  </div>
                </form>
              ` : sb.lastReceipt ? `
                <h4>Current order · Completed (Simulated)</h4>
                <div class="cafe-alert ok" style="margin-bottom:10px">
                  <strong>Payment confirmed · Receipt ${esc(sb.lastReceipt.receiptNo)}</strong><br>
                  Total ${php(sb.lastReceipt.totalCents)} · ${esc(sb.lastReceipt.tender)} (Synthetic Demo Only)
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <button type="button" class="cafe-btn outline" data-sb-act="print-receipt">Print Receipt (Preview)</button>
                  <button type="button" class="cafe-btn" data-sb-act="start-another">Start another order</button>
                </div>
              ` : `
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <h4 style="margin:0">New Order Ticket</h4>
                  <span class="cafe-pill info">${sb.cart.reduce((s, l) => s + l.qty, 0)} items</span>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0">
                  <label style="font-size:11px;font-weight:700">Service mode
                    <select class="cafe-input" data-sb-change="serviceMode">
                      <option value="Dine-In" ${sb.serviceMode === "Dine-In" ? "selected" : ""}>Dine-In</option>
                      <option value="Takeout" ${sb.serviceMode === "Takeout" ? "selected" : ""}>Takeout</option>
                    </select>
                  </label>
                  <label style="font-size:11px;font-weight:700">Table / reference
                    <input class="cafe-input" data-sb-input="tableRef" value="${esc(sb.tableRef)}">
                  </label>
                </div>
                ${sb.cart.length ? sb.cart.map((l) => `
                  <div style="background:#f8efe4;border-radius:6px;padding:8px 10px;margin-bottom:6px;font-size:12px;display:flex;justify-content:space-between;gap:8px">
                    <div><strong>${l.qty}× ${esc(l.name)}</strong>${l.mods ? `<br><small>${esc(l.mods)}</small>` : ""}${l.note ? `<br><small style="color:#934719">Note: ${esc(l.note)}</small>` : ""}</div>
                    <div style="text-align:right"><strong>${php(l.qty * l.unitCents)}</strong><br><button type="button" class="mini-link-btn" data-sb-act="remove-line" data-val="${esc(l.lineId)}">Remove</button></div>
                  </div>`).join("") : `<div style="border:1px dashed #cbb198;border-radius:6px;padding:18px;text-align:center;color:#735447;font-size:12px">Tap a menu item on the left to start an order.</div>`}
                <div style="display:flex;justify-content:space-between;font-weight:800;margin:10px 0"><span>Subtotal</span><span>${php(cartSubtotal)}</span></div>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <button type="button" class="cafe-btn" ${!sb.cart.length || sb.pendingIntent ? "disabled" : ""} data-sb-act="save-send-prep">Save &amp; Send to Kitchen</button>
                  <button type="button" class="cafe-btn outline" ${!sb.cart.length ? "disabled" : ""} data-sb-act="park-draft">Park Order</button>
                  <button type="button" class="cafe-btn outline" data-sb-act="clear-cart">Clear Draft</button>
                </div>
                ${sb.orders.some((o) => o.state === "Ready") ? `
                  <div style="margin-top:12px;padding-top:10px;border-top:1px solid #e9d5bb">
                    <div style="font-size:11px;font-weight:700;color:#735447;margin-bottom:6px">READY ORDERS WAITING FOR CHECKOUT:</div>
                    ${sb.orders.filter((o) => o.state === "Ready").map((o) => `<button type="button" class="cafe-btn copper" style="margin:0 6px 6px 0;font-size:11px" data-sb-act="load-checkout" data-val="${esc(o.id)}">Pay ${esc(o.ref)} (${php(o.totalCents)})</button>`).join("")}
                  </div>` : ""}
              `}
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderWinOrders() {
    if (sb.role === "signed-out") return renderTopBar("Orders & Lifecycle (Simulated)", "Signed Out") + renderSignedOutGate("Orders Board Sign In");
    const list = sb.orders.filter((o) =>
      (sb.orderFilterChannel === "ALL" || o.mode === sb.orderFilterChannel) &&
      (sb.orderFilterState === "ALL" || o.state === sb.orderFilterState)
    );
    return renderTopBar("Orders & Lifecycle Board (Simulated)", "Simulated SQLite Orders") + `
      <div class="cafe-layout">
        ${renderWindowsPosSidebar("win-orders")}
        <div class="cafe-main">
          ${sb.toast ? `<div class="cafe-alert ${sb.toast.kind === "ok" ? "ok" : ""}">${esc(sb.toast.text)}</div>` : ""}
          ${renderModalOverlay()}
          <div class="cafe-card">
            <h4>Cafe Orders &amp; Lifecycle</h4>
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px">
              <div style="display:flex;gap:5px;flex-wrap:wrap">
                ${["ALL", "Dine-In", "Takeout"].map((ch) => `<button type="button" class="cafe-btn ${sb.orderFilterChannel === ch ? "" : "outline"}" style="padding:5px 9px;font-size:11px" data-sb-act="ord-ch" data-val="${ch}">${ch === "ALL" ? "All Channels" : ch}</button>`).join("")}
              </div>
              <div style="display:flex;gap:5px;flex-wrap:wrap">
                ${["ALL", "Open", "Parked", "Submitted", "Preparing", "Ready", "Completed", "Cancelled"].map((st) => `<button type="button" class="cafe-btn ${sb.orderFilterState === st ? "" : "outline"}" style="padding:5px 9px;font-size:11px" data-sb-act="ord-st" data-val="${st}">${st}</button>`).join("")}
              </div>
            </div>
            ${list.length ? `
              <table class="cafe-table">
                <thead><tr><th>Ticket / Ref</th><th>Mode</th><th>State</th><th>Total</th><th>Actions</th></tr></thead>
                <tbody>
                  ${list.map((o) => `
                    <tr>
                      <td><strong>${esc(o.ref)}</strong><br><small>${esc(o.id)} · ${esc(o.updated)}</small></td>
                      <td>${esc(o.mode)}</td>
                      <td><span class="cafe-pill ${o.state === "Cancelled" ? "err" : o.state === "Parked" ? "warn" : o.state === "Ready" ? "" : "info"}">${esc(o.state)}</span></td>
                      <td>${php(o.totalCents)}</td>
                      <td style="display:flex;gap:6px;flex-wrap:wrap">
                        ${o.state === "Parked" ? `<button type="button" class="cafe-btn copper" style="padding:4px 8px;font-size:11px" data-sb-act="resume-order" data-val="${esc(o.id)}">Resume</button>` : ""}
                        ${o.state === "Ready" ? `<button type="button" class="cafe-btn" style="padding:4px 8px;font-size:11px" data-sb-act="load-checkout" data-val="${esc(o.id)}">Checkout</button>` : ""}
                        ${(o.state === "Open" || o.state === "Parked") ? `<button type="button" class="cafe-btn danger" style="padding:4px 8px;font-size:11px" data-sb-act="open-cancel" data-val="${esc(o.id)}">Cancel</button>` : ""}
                        ${o.state === "Completed" ? `<button type="button" class="cafe-btn outline" style="padding:4px 8px;font-size:11px" data-sb-act="reprint-order" data-val="${esc(o.id)}">Reprint</button>` : ""}
                      </td>
                    </tr>`).join("")}
                </tbody>
              </table>` : `<p style="color:#735447">No simulated orders match this filter.</p>`}
          </div>
        </div>
      </div>`;
  }

  function renderWinKitchen() {
    if (sb.role === "signed-out") return renderTopBar("Kitchen & Barista Display (Simulated)", "Signed Out") + renderSignedOutGate("Kitchen Display Sign In");
    const active = sb.orders.filter((o) => ["Submitted", "Preparing", "Ready"].includes(o.state) && (sb.kdsFilter === "ALL" || o.state === sb.kdsFilter));
    return renderTopBar("Kitchen & Barista Display (Simulated)", "Barista Kitchen KDS Printer (Preview Only)") + `
      <div class="cafe-layout">
        ${renderWindowsPosSidebar("win-kitchen")}
        <div class="cafe-main">
          ${sb.toast ? `<div class="cafe-alert ${sb.toast.kind === "ok" ? "ok" : ""}">${esc(sb.toast.text)}</div>` : ""}
          <div class="cafe-card">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px">
              <h4 style="margin:0">Kitchen &amp; Barista Ticket Queue</h4>
              <div style="display:flex;gap:5px;flex-wrap:wrap">
                ${["ALL", "Submitted", "Preparing", "Ready"].map((st) => `<button type="button" class="cafe-btn ${sb.kdsFilter === st ? "" : "outline"}" style="padding:5px 9px;font-size:11px" data-sb-act="kds-filter" data-val="${st}">${st === "ALL" ? "All Active Tickets" : st}</button>`).join("")}
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px">
              ${active.length ? active.map((o) => `
                <article class="cafe-card" style="background:#fff">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <strong>${esc(o.ref)}</strong>
                    <span class="cafe-pill ${o.state === "Ready" ? "" : o.state === "Preparing" ? "warn" : "info"}">${esc(o.state)}</span>
                  </div>
                  <small style="color:#735447">${esc(o.mode)} · ${esc(o.updated)}</small>
                  <div style="background:#f8efe4;padding:8px;border-radius:6px;margin:8px 0;font-size:12px">
                    ${o.lines.map((l) => `<div>${esc(l)}</div>`).join("")}
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap">
                    <button type="button" class="cafe-btn outline" style="font-size:11px;padding:5px 8px" data-sb-act="print-kitchen" data-val="${esc(o.id)}">Print Kitchen Ticket</button>
                    ${o.state === "Submitted" ? `<button type="button" class="cafe-btn copper" style="font-size:11px;padding:5px 9px" data-sb-act="kds-next" data-val="${esc(o.id)}">Start Prep</button>` : ""}
                    ${o.state === "Preparing" ? `<button type="button" class="cafe-btn" style="font-size:11px;padding:5px 9px" data-sb-act="kds-next" data-val="${esc(o.id)}">Mark Ready</button>` : ""}
                  </div>
                </article>`).join("") : `<p style="color:#735447">No active kitchen tickets in this stage.</p>`}
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderWinBackoffice() {
    if (sb.role === "signed-out") return renderTopBar("Windows Host Back-Office (Simulated)", "Signed Out") + renderSignedOutGate("Back-Office Console Sign In");
    if (sb.role === "restricted-cashier") {
      return renderTopBar("Windows Host Back-Office (Simulated)", "Access Denied") + `
        <div style="padding:28px"><div class="cafe-alert"><strong>Permission Denied (Simulated RBAC):</strong> Restricted Cashier (Leo Cruz) cannot access Back-Office Reports, Inventory, Refunds, or Host Backups. Switch Simulated Role to Admin / Manager to inspect Areas A–H.</div></div>`;
    }
    const areas = [
      ["area-a", "A · Owner Reports & COGS"],
      ["area-b", "B · Device Trust & Central"],
      ["area-c", "C · Menu, Recipes & BOM"],
      ["area-d", "D · Inventory & Waste"],
      ["area-e", "E · Cash, AR & C5 Refunds"],
      ["area-f", "F · Bookings, Delivery & Staff"],
      ["area-g", "G · Audit, Users & Settings"],
      ["area-h", "H · Host Backup & License"]
    ];
    const completed = sb.orders.filter((o) => o.state === "Completed");
    const totalSalesCents = completed.reduce((s, o) => s + o.totalCents, 0);
    const totalArCents = sb.customers.reduce((s, c) => s + c.balanceCents, 0);
    const lowStock = sb.ingredients.filter((i) => i.onHand <= i.reorder);

    let areaHtml = "";
    if (sb.boArea === "area-a") {
      areaHtml = `
        <div class="cafe-alert warn">Owner Reports are store operational reports only (Simulated Demo). Not an official/BIR/RMO report.</div>
        <div class="cafe-kpi-row">
          <div class="cafe-kpi"><span>Daily Sales (Demo)</span><strong>${php(totalSalesCents)}</strong><small>${completed.length} completed orders</small></div>
          <div class="cafe-kpi"><span>Est. Net Revenue</span><strong>${php(Math.round(totalSalesCents * 0.92))}</strong><small>Synthetic COGS</small></div>
          <div class="cafe-kpi"><span>Outstanding AR</span><strong>${php(totalArCents)}</strong><small>${sb.customers.length} synthetic accounts</small></div>
          <div class="cafe-kpi"><span>Low-Stock Alerts</span><strong>${lowStock.length}</strong><small>Items at/below reorder</small></div>
        </div>`;
    } else if (sb.boArea === "area-b") {
      areaHtml = `
        <div class="cafe-card">
          <h4>Windows Host LAN Thin-Client Pairing (HTTPS 5400 · Simulated)</h4>
          <p style="font-size:12px;color:#735447">Transport: <strong>${sb.lanEnabled ? "Active on HTTPS 5400 (Simulated)" : "Disabled · Remote POS Off"}</strong> · Active LAN Join Code: <code>${esc(sb.lanJoinCode || "None active")}</code></p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" class="cafe-btn outline" data-sb-act="toggle-lan">${sb.lanEnabled ? "Disable LAN HTTPS 5400" : "Enable LAN HTTPS 5400 (Demo)"}</button>
            <button type="button" class="cafe-btn" data-sb-act="rotate-lan">Rotate LAN Join Code</button>
          </div>
        </div>`;
    } else if (sb.boArea === "area-c") {
      areaHtml = `
        <div class="cafe-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
            <h4 style="margin:0">Menu, Ingredients &amp; Recipe BOM</h4>
            <button type="button" class="cafe-btn" data-sb-act="publish-menu">Publish Menu &amp; Recipes</button>
          </div>
          <table class="cafe-table" style="margin-top:8px">
            <thead><tr><th>Ingredient</th><th>Unit</th><th>On Hand</th><th>Reorder Level</th></tr></thead>
            <tbody>${sb.ingredients.map((i) => `<tr><td>${esc(i.name)}</td><td>${esc(i.unit)}</td><td>${i.onHand}</td><td>${i.reorder}</td></tr>`).join("")}</tbody>
          </table>
        </div>`;
    } else if (sb.boArea === "area-d") {
      areaHtml = `
        <div class="cafe-card">
          <h4>Receive Supplier Purchase (Demo)</h4>
          <form data-sb-form="receive-purchase" style="display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:end">
            <label style="font-size:11px;font-weight:700">Ingredient<select name="ingId" class="cafe-input">${sb.ingredients.map((i) => `<option value="${esc(i.id)}">${esc(i.name)}</option>`).join("")}</select></label>
            <label style="font-size:11px;font-weight:700">Quantity<input name="qty" type="number" class="cafe-input" value="5000" min="1"></label>
            <button type="submit" class="cafe-btn">Receive Purchase</button>
          </form>
        </div>
        <div class="cafe-card">
          <h4>Record Inventory Waste / Spoilage</h4>
          <form data-sb-form="record-waste" style="display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:end">
            <label style="font-size:11px;font-weight:700">Ingredient<select name="ingId" class="cafe-input">${sb.ingredients.map((i) => `<option value="${esc(i.id)}">${esc(i.name)}</option>`).join("")}</select></label>
            <label style="font-size:11px;font-weight:700">Waste Qty<input name="qty" type="number" class="cafe-input" value="500" min="1"></label>
            <button type="submit" class="cafe-btn outline">Record Waste</button>
          </form>
        </div>
        <div class="cafe-card">
          <h4>Low-Stock Alerts</h4>
          ${lowStock.length ? lowStock.map((i) => `<div class="cafe-alert warn" style="margin-bottom:6px">${esc(i.name)}: ${i.onHand} ${esc(i.unit)} (Reorder at ${i.reorder})</div>`).join("") : `<p style="font-size:12px;color:#14532d">Stock levels healthy — no ingredients below reorder threshold.</p>`}
        </div>`;
    } else if (sb.boArea === "area-e") {
      areaHtml = `
        <div class="cafe-card">
          <h4>Customer AR &amp; Cash Ledger (Append-Only Demo)</h4>
          <table class="cafe-table">
            <thead><tr><th>Type</th><th>Delta</th><th>Reason</th><th>Time</th></tr></thead>
            <tbody>${sb.cashLedger.map((r) => `<tr><td><span class="cafe-pill ${r.deltaCents < 0 ? "warn" : ""}">${esc(r.type)}</span></td><td>${r.deltaCents < 0 ? "-" : ""}${php(Math.abs(r.deltaCents))}</td><td>${esc(r.reason)}</td><td>${esc(r.at)}</td></tr>`).join("")}</tbody>
          </table>
        </div>
        <div class="cafe-card">
          <h4>C5 Audited Refunds &amp; Reversals (Cash / AR Only)</h4>
          <table class="cafe-table">
            <thead><tr><th>Receipt</th><th>State</th><th>Total</th><th>Reason</th><th>Action</th></tr></thead>
            <tbody>${sb.refunds.map((rf) => `
              <tr>
                <td><strong>${esc(rf.receiptNo)}</strong></td>
                <td><span class="cafe-pill ${rf.state === "Committed" ? "" : "info"}">${esc(rf.state)}</span></td>
                <td>${php(rf.totalCents)}</td>
                <td>${esc(rf.reason)}</td>
                <td>${rf.state === "Approved" ? `<button type="button" class="cafe-btn copper" style="padding:4px 8px;font-size:11px" data-sb-act="open-commit-refund" data-val="${esc(rf.id)}">Commit Settlement</button>` : "Settled"}</td>
              </tr>`).join("")}</tbody>
          </table>
        </div>`;
    } else if (sb.boArea === "area-f") {
      areaHtml = `
        <div class="cafe-card">
          <h4>Delivery Queue &amp; Coffee Cart Bookings</h4>
          ${sb.deliveries.map((d) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #e9d5bb"><span><strong>${esc(d.ref)}</strong> · <span class="cafe-pill info">${esc(d.state)}</span></span>${d.state === "Pending" ? `<button type="button" class="cafe-btn" style="padding:4px 9px;font-size:11px" data-sb-act="dispatch-del" data-val="${esc(d.id)}">Dispatch</button>` : ""}</div>`).join("")}
          <div style="margin-top:8px;font-size:12px"><strong>Bookings:</strong> ${sb.bookings.map((b) => `${esc(b.event)} (${esc(b.date)} · ${esc(b.status)})`).join(" | ") || "None"}</div>
        </div>
        <div class="cafe-card">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h4 style="margin:0">Staff Attendance &amp; Incident Log</h4>
            <div style="display:flex;gap:6px"><button type="button" class="cafe-btn" style="padding:5px 10px" data-sb-act="clock-in">Clock In</button><button type="button" class="cafe-btn outline" style="padding:5px 10px" data-sb-act="clock-out">Clock Out</button></div>
          </div>
          <div style="margin-top:8px;font-size:12px">${sb.attendance.slice(0, 4).map((a) => `<div>${esc(a.event)} · ${esc(a.actor)} · ${esc(a.at)}</div>`).join("")}</div>
        </div>`;
    } else if (sb.boArea === "area-g") {
      areaHtml = `
        ${sb.preset === "error"
          ? `<div class="cafe-alert"><strong>Simulated 3d23ef4b Finding (GET /api/settings/store -> 404):</strong> Store &amp; Receipt Settings endpoint returned 404 NotFound, so the settings form is omitted (see WIN-BO-G &amp; MISS-WIN-STORE-SETTINGS). Switch preset to 'Happy path' to preview the expected form.</div>`
          : `<div class="cafe-card">
              <h4>Cafe Store &amp; Receipt Settings (Expected Form Preview)</h4>
              <form data-sb-form="save-settings" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                <label style="font-size:11px;font-weight:700">Store Name<input name="storeName" class="cafe-input" value="${esc(sb.storeSettings.storeName)}"></label>
                <label style="font-size:11px;font-weight:700">Receipt Header<input name="receiptHeader" class="cafe-input" value="${esc(sb.storeSettings.receiptHeader)}"></label>
                <label style="font-size:11px;font-weight:700;grid-column:1/-1">Receipt Footer<input name="receiptFooter" class="cafe-input" value="${esc(sb.storeSettings.receiptFooter)}"></label>
                <div><button type="submit" class="cafe-btn">Save Synthetic Settings</button></div>
              </form>
            </div>`}
        <div class="cafe-card">
          <h4>Immutable Audit Trail (Demo)</h4>
          <table class="cafe-table"><thead><tr><th>Action</th><th>Entity</th><th>Reason</th><th>Time</th></tr></thead>
          <tbody>${sb.audit.slice(0, 6).map((a) => `<tr><td><strong>${esc(a.action)}</strong></td><td>${esc(a.entity)}</td><td>${esc(a.reason)}</td><td>${esc(a.at)}</td></tr>`).join("")}</tbody></table>
        </div>`;
    } else {
      areaHtml = `
        <div class="cafe-card">
          <h4>Salryn Cafe License Status (Simulated)</h4>
          <span class="cafe-pill warn">DEMO / SYNTHETIC LICENSE STATE</span>
          <p style="font-size:12px;color:#735447;margin:8px 0 0">Browser sandbox never inspects or bypasses real Windows licensing.</p>
        </div>
        <div class="cafe-card">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h4 style="margin:0">Host SQLite Backup &amp; Restore (Demo)</h4>
            <button type="button" class="cafe-btn" data-sb-act="create-backup">Create Verified Backup</button>
          </div>
          <table class="cafe-table" style="margin-top:8px">
            <thead><tr><th>Backup ID</th><th>Size</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>${sb.backups.map((b) => `<tr><td><strong>${esc(b.id)}</strong></td><td>${esc(b.size)}</td><td>${esc(b.created)}</td><td><button type="button" class="cafe-btn danger" style="padding:4px 9px;font-size:11px" data-sb-act="open-restore" data-val="${esc(b.id)}">Restore</button></td></tr>`).join("")}</tbody>
          </table>
        </div>`;
    }

    return renderTopBar("Local Windows Host Back-Office (127.0.0.1:5399 / LAN HTTPS 5400 · Simulated)", "Windows Host Console") + `
      <div class="cafe-layout">
        <aside class="cafe-sidebar" aria-label="Simulated Back-Office Areas">
          ${areas.map(([k, lbl]) => `<button type="button" class="cafe-sidebar-btn ${sb.boArea === k ? "active" : ""}" data-sb-act="set-bo" data-val="${k}"><span>${esc(lbl)}</span></button>`).join("")}
          <button type="button" class="cafe-sidebar-btn" data-sb-nav="win-cashier"><span>← Back to POS Cashier</span></button>
        </aside>
        <div class="cafe-main">
          ${sb.toast ? `<div class="cafe-alert ${sb.toast.kind === "ok" ? "ok" : ""}">${esc(sb.toast.text)}</div>` : ""}
          ${renderModalOverlay()}
          ${areaHtml}
        </div>
      </div>`;
  }

  function renderCentral() {
    if (sb.role === "signed-out") return renderTopBar("Central Owner & Admin Portal (Simulated)", "Disconnected") + renderSignedOutGate("Central Owner Admin Sign In");
    return renderTopBar("Central Owner & Admin Portal (Independent HTTPS Origin · Simulated)", "Central Epoch 1 (Sim)") + `
      <div class="cafe-layout">
        <aside class="cafe-sidebar">
          <button type="button" class="cafe-sidebar-btn active" data-sb-nav="central"><span>Device Trust &amp; Quarantine</span></button>
          <button type="button" class="cafe-sidebar-btn" data-sb-act="central-host-boundary"><span>Host Backup (Isolated)</span></button>
        </aside>
        <div class="cafe-main">
          ${sb.toast ? `<div class="cafe-alert ${sb.toast.kind === "ok" ? "ok" : sb.toast.kind === "warn" ? "warn" : ""}">${esc(sb.toast.text)}</div>` : ""}
          ${renderModalOverlay()}
          <div class="cafe-card">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
              <h4 style="margin:0">Central Device Enrollment, Approval &amp; Trust</h4>
              <button type="button" class="cafe-btn" data-sb-act="issue-central-code">Issue One-Time Join Code</button>
            </div>
            <div class="cafe-alert ok" style="margin:10px 0"><strong>Active Demo Join Code:</strong> <code>${esc(sb.centralJoinCode)}</code> (Synthetic only — never valid on any real server)</div>
            <table class="cafe-table">
              <thead><tr><th>Device</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>${sb.centralDevices.map((d) => `
                <tr>
                  <td><strong>${esc(d.name)}</strong></td>
                  <td>${esc(d.role)}</td>
                  <td><span class="cafe-pill ${d.status === "Active" ? "" : d.status === "Pending" ? "warn" : "err"}">${esc(d.status)}</span></td>
                  <td>
                    ${d.status === "Pending" ? `<button type="button" class="cafe-btn" style="padding:4px 9px;font-size:11px" data-sb-act="approve-dev" data-val="${esc(d.id)}">Approve</button>` : ""}
                    ${d.status === "Active" ? `<button type="button" class="cafe-btn danger" style="padding:4px 9px;font-size:11px" data-sb-act="open-revoke" data-val="${esc(d.id)}">Revoke</button>` : ""}
                    ${d.status === "Revoked" ? `<small style="color:#991b1b">Fenced</small>` : ""}
                  </td>
                </tr>`).join("")}</tbody>
            </table>
          </div>
          <div class="cafe-card">
            <h4>Quarantine Review Queue (Fenced Offline Operations)</h4>
            ${sb.quarantine.length ? sb.quarantine.map((q) => `
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #e9d5bb">
                <span><strong>${esc(q.id)}</strong> · ${esc(q.device)} · ${esc(q.opType)} (${php(q.amountCents)}) · <span class="cafe-pill warn">${esc(q.status)}</span></span>
                ${q.status === "AdminReviewRequired" ? `<button type="button" class="cafe-btn outline" style="padding:4px 9px;font-size:11px" data-sb-act="resolve-quarantine" data-val="${esc(q.id)}">Mark Reviewed</button>` : ""}
              </div>`).join("") : `<p style="font-size:12px;color:#14532d">No quarantined offline operations waiting.</p>`}
          </div>
          <div class="cafe-alert warn"><strong>Local Windows Host Isolation:</strong> SQLite backups, restore verification, and offline host licensing are strictly disabled on Central Owner Portal (see CEN-05).</div>
        </div>
      </div>`;
  }

  function renderAndroidReplica() {
    const a = sb.android;
    const total = a.cart.reduce((s, c) => s + c.qty * c.unitCents, 0);
    return `
      <div class="android-chrome">
        <span>Salryn Cafe (Browser Visual Replica — NOT Native APK)</span>
        <span>${a.offline ? "OFFLINE" : "TLS + SPKI (SIM)"}</span>
      </div>
      <div class="android-replica-body">
        <div class="cafe-alert warn" style="font-size:11.5px;padding:7px 10px">
          <strong>Visual Browser Replica:</strong> Mirrors <code>MainActivity.cs</code> layout &amp; states with synthetic browser state only. Does not run Android Keystore, real SQLite, or native Bluetooth.
        </div>
        ${renderModalOverlay()}
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button type="button" class="cafe-btn ${a.screen === "signin" ? "" : "outline"}" style="font-size:11px;padding:5px 8px" data-sb-act="and-screen" data-val="signin">Sign in</button>
          <button type="button" class="cafe-btn ${a.screen === "setup" ? "" : "outline"}" style="font-size:11px;padding:5px 8px" data-sb-act="and-screen" data-val="setup">Setup &amp; Sync</button>
          <button type="button" class="cafe-btn ${a.screen === "cashier" ? "" : "outline"}" style="font-size:11px;padding:5px 8px" data-sb-act="and-screen" data-val="cashier">Cashier</button>
          <button type="button" class="cafe-btn ${a.screen === "refunds" ? "" : "outline"}" style="font-size:11px;padding:5px 8px" data-sb-act="and-screen" data-val="refunds">Refunds (C5)</button>
        </div>
        <div class="cafe-card" style="padding:10px 12px;font-size:12px">
          <strong>Status:</strong> ${esc(a.statusMsg)}
        </div>
        ${a.screen === "signin" ? `
          <h4 style="margin:4px 0">Salryn Cafe · Operator sign in</h4>
          <input class="cafe-input" value="c4-proof (synthetic)" readonly>
          <input class="cafe-input" type="password" value="••••••••" readonly>
          <button type="button" class="android-btn" data-sb-act="and-signin">Sign in (Simulated)</button>
          <button type="button" class="android-btn outline" data-sb-act="and-screen" data-val="setup">Device setup and synchronization</button>
          <button type="button" class="android-btn outline" data-sb-act="open-modal" data-modal="bt-permission">Bluetooth printer permissions</button>
        ` : a.screen === "setup" ? `
          <h4 style="margin:4px 0">Device setup and synchronization</h4>
          <div style="font-size:12px">Origin: <code>https://synthetic-central.local:5445</code><br>Pending outbox operations: <strong>${a.outboxQueue.length}</strong></div>
          <button type="button" class="android-btn" data-sb-act="and-toggle-offline">${a.offline ? "Go Online (Simulated Network)" : "Go Offline (Test Queue)"}</button>
          <button type="button" class="android-btn" data-sb-act="and-reconnect">Reconnect and synchronize pending operations</button>
          <button type="button" class="android-btn outline" data-sb-act="and-screen" data-val="cashier">Back to Cashier</button>
        ` : a.screen === "refunds" ? `
          <h4 style="margin:4px 0">Salryn Cafe · Audited Refunds (C5)</h4>
          <p style="font-size:12px;margin:0">Refundable completed sales: ${sb.orders.filter((o) => o.state === "Completed").length}</p>
          <button type="button" class="android-btn" data-sb-act="and-req-refund">Simulate Request C5 Refund</button>
          <button type="button" class="android-btn outline" data-sb-act="and-screen" data-val="cashier">Back to Cashier</button>
        ` : `
          <h4 style="margin:4px 0">Salryn Cafe · Cashier</h4>
          ${a.stuckIntentBug ? `
            <div class="cafe-alert">
              <strong>Pending action: ShiftOpen · Op eb34d406-... (3d23ef4b Bug Repro)</strong><br>
              Reproduces <code>AndroidKeyStoreSecretStore.WriteAsync([])</code> ArgumentException stranding pending intent.
              <div style="margin-top:6px"><button type="button" class="cafe-btn outline" style="font-size:11px" data-sb-act="and-clear-bug">Switch out of Error Bug Repro</button></div>
            </div>` : ""}
          <button type="button" class="android-btn" data-sb-act="and-toggle-shift">${a.shiftOpen ? "Close my shift with physical count" : "Open / recover my shift"}</button>
          <strong style="font-size:13px">Published menu</strong>
          ${MENU_SEED.slice(0, 4).map((m) => `<button type="button" class="android-btn outline" style="text-align:left" data-sb-act="and-add" data-val="${esc(m.id)}">${esc(m.name)} · ${php(m.priceCents)}</button>`).join("")}
          <div class="cafe-card" style="padding:10px">
            <strong>New ${esc(a.serviceMode)} order (${esc(a.tableRef)})</strong>
            <div style="font-size:12px;margin:6px 0">${a.cart.map((c) => `${c.qty} × ${esc(c.name)} (${php(c.qty * c.unitCents)})`).join("<br>") || "Cart empty"}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <button type="button" class="cafe-btn outline" style="font-size:11px" data-sb-act="and-toggle-mode">Switch to ${a.serviceMode === "Dine-In" ? "Takeout" : "Dine-In"}</button>
              <button type="button" class="cafe-btn" style="font-size:11px" data-sb-act="and-save-order">Save Order (${php(total)})</button>
              ${a.savedOrderState ? `<button type="button" class="cafe-btn copper" style="font-size:11px" data-sb-act="and-advance-order">${a.savedOrderState === "Ready" ? "Checkout (Cash / AR Preview)" : "Advance (" + esc(a.savedOrderState) + " →)"}</button>` : ""}
            </div>
          </div>
          <button type="button" class="android-btn outline" data-sb-act="open-modal" data-modal="bt-permission">Bluetooth printer permissions</button>
        `}
      </div>`;
  }

  function renderSandbox() {
    syncToolbarControls();
    renderContextStrip();
    const frame = qs("#sbFrame");
    if (!frame) return;
    frame.className = "sb-frame" + (sb.surface === "android" ? " vp-android" : sb.viewport === "tablet" ? " vp-tablet" : sb.viewport === "mobile" ? " vp-mobile" : "");

    if (sb.surface === "win-cashier") frame.innerHTML = renderWinCashier();
    else if (sb.surface === "win-orders") frame.innerHTML = renderWinOrders();
    else if (sb.surface === "win-kitchen") frame.innerHTML = renderWinKitchen();
    else if (sb.surface === "win-backoffice") frame.innerHTML = renderWinBackoffice();
    else if (sb.surface === "central") frame.innerHTML = renderCentral();
    else frame.innerHTML = renderAndroidReplica();
  }

  function navigateRoute(routeStr, fromScreenId) {
    sb.fromScreenId = fromScreenId || null;
    sb.toast = null;
    sb.modal = null;
    const [base, queryPart] = String(routeStr || "win-cashier").split("?");
    const params = new URLSearchParams(queryPart || "");
    if (["win-cashier", "win-orders", "win-kitchen", "win-backoffice", "central", "android"].includes(base)) {
      sb.surface = base;
    }
    if (params.get("preset")) {
      const p = params.get("preset");
      if (["happy", "empty", "permission-denied", "offline", "error"].includes(p)) {
        const keepSurface = sb.surface;
        sb = createSeedState(p);
        sb.surface = keepSurface;
        sb.fromScreenId = fromScreenId || null;
      }
    }
    if (params.get("role")) sb.role = params.get("role");
    if (params.get("area")) sb.boArea = params.get("area");
    if (params.get("viewport")) sb.viewport = params.get("viewport") === "laptop" ? "desktop" : params.get("viewport");
    if (params.get("category")) sb.categoryFilter = params.get("category");
    if (params.get("state") && sb.surface === "win-orders") sb.orderFilterState = params.get("state");
    if (params.get("screen") && sb.surface === "android") sb.android.screen = params.get("screen");
    if (params.get("step") === "checkout" && sb.surface === "win-cashier") {
      const ready = sb.orders.find((o) => o.state === "Ready");
      if (ready) sb.activeOrderId = ready.id;
    }
    if (params.get("modal")) {
      const m = params.get("modal");
      if (m === "customize") sb.modal = { type: "customize", productId: "spanish-latte" };
      else if (m === "open-shift") sb.modal = { type: "open-shift" };
      else if (m === "blind-close") sb.modal = { type: "blind-close" };
      else if (m === "blind-close-result") sb.modal = { type: "blind-close-result" };
      else if (m === "cancel") sb.modal = { type: "cancel-order", orderId: sb.orders[0]?.id || "ORD-103" };
      else if (m === "commit-refund") sb.modal = { type: "commit-refund", refundId: sb.refunds[0]?.id };
      else if (m === "restore") sb.modal = { type: "restore-backup", backupId: sb.backups[0]?.id || "backup-demo" };
      else if (m === "revoke") sb.modal = { type: "revoke-device", deviceId: "dev-1", deviceName: "Counter LAN Terminal 01" };
      else if (m === "bluetooth") sb.modal = { type: "bt-permission" };
    }
    saveSb();
    renderSandbox();
  }

  function bindSandboxEvents() {
    qs("#sbSurfaceTabs")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-surface]");
      if (!b) return;
      sb.surface = b.dataset.surface;
      sb.modal = null;
      sb.toast = null;
      saveSb();
      renderSandbox();
    });
    qs("#sbRoleSelect")?.addEventListener("change", (e) => {
      sb.role = e.target.value;
      sb.toast = null;
      saveSb();
      renderSandbox();
    });
    qs("#sbPresetSelect")?.addEventListener("change", (e) => {
      const keepSurface = sb.surface;
      const keepVp = sb.viewport;
      sb = createSeedState(e.target.value);
      sb.surface = keepSurface;
      sb.viewport = keepVp;
      saveSb();
      renderSandbox();
    });
    qs("#sbViewportSelect")?.addEventListener("change", (e) => {
      sb.viewport = e.target.value;
      saveSb();
      renderSandbox();
    });
    qs("#sbResetBtn")?.addEventListener("click", () => {
      const keepSurface = sb.surface;
      sb = createSeedState("happy");
      sb.surface = keepSurface;
      sb.toast = { kind: "ok", text: "Demo data reset to clean synthetic seed." };
      saveSb();
      renderSandbox();
    });

    const frame = qs("#sbFrame");
    if (!frame) return;

    frame.addEventListener("click", (e) => {
      const nav = e.target.closest("[data-sb-nav]");
      if (nav) { sb.surface = nav.dataset.sbNav; sb.modal = null; sb.toast = null; saveSb(); renderSandbox(); return; }
      const act = e.target.closest("[data-sb-act]");
      if (!act) return;
      const a = act.dataset.sbAct;
      const val = act.dataset.val;

      if (a === "signout") { sb.role = "signed-out"; sb.modal = null; setToast("ok", "Signed out of simulated session."); }
      else if (a === "signin-role") { sb.role = val; setToast("ok", "Signed into simulated session as " + val + "."); }
      else if (a === "close-modal") { sb.modal = null; saveSb(); renderSandbox(); }
      else if (a === "open-modal") { sb.modal = { type: act.dataset.modal }; saveSb(); renderSandbox(); }
      else if (a === "set-cat") { sb.categoryFilter = val; saveSb(); renderSandbox(); }
      else if (a === "pick-item") { sb.modal = { type: "customize", productId: val }; saveSb(); renderSandbox(); }
      else if (a === "remove-line") { sb.cart = sb.cart.filter((l) => l.lineId !== val); saveSb(); renderSandbox(); }
      else if (a === "clear-cart") { sb.cart = []; saveSb(); renderSandbox(); }
      else if (a === "clear-active-order") { sb.activeOrderId = null; saveSb(); renderSandbox(); }
      else if (a === "start-another") { sb.lastReceipt = null; sb.activeOrderId = null; sb.cart = []; saveSb(); renderSandbox(); }
      else if (a === "save-send-prep") {
        const tot = sb.cart.reduce((s, l) => s + l.qty * l.unitCents, 0);
        const id = "ORD-" + (104 + sb.orders.length);
        sb.orders.unshift({ id, ref: sb.tableRef || "Walk-In", mode: sb.serviceMode, state: "Submitted", updated: "Just now", totalCents: tot, lines: sb.cart.map((l) => `${l.qty}× ${l.name}${l.mods ? " — " + l.mods : ""}`) });
        sb.cart = [];
        setToast("ok", `Simulated order ${id} sent to Kitchen Display queue.`);
      }
      else if (a === "park-draft") {
        const tot = sb.cart.reduce((s, l) => s + l.qty * l.unitCents, 0);
        const id = "ORD-" + (104 + sb.orders.length);
        sb.orders.unshift({ id, ref: sb.tableRef || "Parked Ticket", mode: sb.serviceMode, state: "Parked", updated: "Just now", totalCents: tot, lines: sb.cart.map((l) => `${l.qty}× ${l.name}`) });
        sb.cart = [];
        setToast("ok", `Order ${id} parked in Orders & Lifecycle.`);
      }
      else if (a === "load-checkout") { sb.surface = "win-cashier"; sb.activeOrderId = val; sb.lastReceipt = null; saveSb(); renderSandbox(); }
      else if (a === "print-receipt") {
        if (sb.preset === "error") setToast("err", "Receipt print failed (3d23ef4b defect repro): Sale has no persisted receipt snapshot.");
        else { sb.modal = { type: "receipt-preview", receipt: sb.lastReceipt }; saveSb(); renderSandbox(); }
      }
      else if (a === "retry-pending") { sb.pendingIntent = null; setToast("ok", "Retained operationId retried idempotently (no duplicate created)."); }
      else if (a === "archive-pending") {
        const r = (qs("#sbArchiveReason")?.value || "").trim();
        if (!r) { setToast("err", "Enter a reason before archiving a rejected request."); return; }
        sb.audit.unshift({ action: "INTENT_ARCHIVED", entity: sb.pendingIntent.opId.slice(0, 8), reason: r, at: "Just now" });
        sb.pendingIntent = null;
        setToast("ok", "Rejected request archived locally with audit reason.");
      }
      else if (a === "ord-ch") { sb.orderFilterChannel = val; saveSb(); renderSandbox(); }
      else if (a === "ord-st") { sb.orderFilterState = val; saveSb(); renderSandbox(); }
      else if (a === "resume-order") {
        const o = sb.orders.find((x) => x.id === val);
        if (o) o.state = "Open";
        setToast("ok", `Resumed ${val} back to Open state.`);
      }
      else if (a === "open-cancel") { sb.modal = { type: "cancel-order", orderId: val }; saveSb(); renderSandbox(); }
      else if (a === "reprint-order") {
        if (sb.preset === "error") setToast("err", "Reprint failed (3d23ef4b defect repro): Sale has no persisted receipt snapshot.");
        else {
          const o = sb.orders.find((x) => x.id === val);
          sb.modal = { type: "receipt-preview", receipt: { receiptNo: o.receiptNo || "SLRN-DEMO-REPRINT", lines: o.lines, totalCents: o.totalCents, tender: "Reprint Preview", cashCents: o.cashCents || o.totalCents, arCents: o.arCents || 0 } };
          saveSb(); renderSandbox();
        }
      }
      else if (a === "kds-filter") { sb.kdsFilter = val; saveSb(); renderSandbox(); }
      else if (a === "kds-next") {
        const o = sb.orders.find((x) => x.id === val);
        if (o) o.state = o.state === "Submitted" ? "Preparing" : "Ready";
        setToast("ok", `Order ${val} advanced to ${o ? o.state : "next stage"}.`);
      }
      else if (a === "print-kitchen") {
        if (sb.preset === "error") setToast("err", "Kitchen ticket failed (3d23ef4b defect repro): A valid client-supplied operationId (or Idempotency-Key header) is required.");
        else setToast("ok", `Simulated Kitchen Ticket preview queued for ${val} (No real printer called).`);
      }
      else if (a === "set-bo") { sb.boArea = val; sb.modal = null; sb.toast = null; saveSb(); renderSandbox(); }
      else if (a === "toggle-lan") { sb.lanEnabled = !sb.lanEnabled; setToast("ok", sb.lanEnabled ? "Simulated LAN HTTPS 5400 enabled." : "Simulated LAN HTTPS 5400 disabled."); }
      else if (a === "rotate-lan") { sb.lanJoinCode = "LAN-" + Math.floor(1000 + Math.random() * 8999); setToast("ok", "Rotated synthetic LAN join code: " + sb.lanJoinCode); }
      else if (a === "publish-menu") {
        if (sb.preset === "error") setToast("err", "Publish Failed (3d23ef4b defect repro): A valid client-supplied operationId (or Idempotency-Key header) is required.");
        else setToast("ok", "Simulated Menu & Recipe snapshot published to demo stations.");
      }
      else if (a === "open-commit-refund") { sb.modal = { type: "commit-refund", refundId: val }; saveSb(); renderSandbox(); }
      else if (a === "dispatch-del") {
        const d = sb.deliveries.find((x) => x.id === val);
        if (d) d.state = "Dispatched";
        setToast("ok", `Delivery ${val} marked Dispatched.`);
      }
      else if (a === "clock-in" || a === "clock-out") {
        sb.attendance.unshift({ event: a === "clock-in" ? "ClockIn" : "ClockOut", actor: "Maria Santos (Manager)", at: "Just now" });
        setToast("ok", a === "clock-in" ? "Clocked in (Simulated)." : "Clocked out (Simulated).");
      }
      else if (a === "create-backup") {
        const id = "backup-demo-" + Date.now().toString().slice(-6);
        sb.backups.unshift({ id, size: "4410.0 KB", created: "Just now", verified: true });
        sb.audit.unshift({ action: "BACKUP_CREATED", entity: id, reason: "Simulated backup created", at: "Just now" });
        setToast("ok", `Created synthetic backup archive ${id}.`);
      }
      else if (a === "open-restore") { sb.modal = { type: "restore-backup", backupId: val }; saveSb(); renderSandbox(); }
      else if (a === "issue-central-code") { sb.centralJoinCode = "DEMO-" + Math.floor(1000 + Math.random() * 8999); setToast("ok", "Issued synthetic join code: " + sb.centralJoinCode); }
      else if (a === "approve-dev") {
        const d = sb.centralDevices.find((x) => x.id === val);
        if (d) d.status = "Active";
        setToast("ok", `Approved synthetic device ${d ? d.name : val}.`);
      }
      else if (a === "open-revoke") {
        const d = sb.centralDevices.find((x) => x.id === val);
        sb.modal = { type: "revoke-device", deviceId: val, deviceName: d ? d.name : val };
        saveSb(); renderSandbox();
      }
      else if (a === "confirm-revoke") {
        const d = sb.centralDevices.find((x) => x.id === act.dataset.dev);
        if (d) d.status = "Revoked";
        sb.modal = null;
        setToast("ok", `Revoked & fenced synthetic device ${d ? d.name : ""}.`);
      }
      else if (a === "resolve-quarantine") {
        const q = sb.quarantine.find((x) => x.id === val);
        if (q) q.status = "Reviewed";
        setToast("ok", `Quarantined item ${val} marked Reviewed.`);
      }
      else if (a === "central-host-boundary") { setToast("warn", "Host Backup & License controls are strictly disabled on Central Owner Portal (see CEN-05)."); }
      else if (a === "bt-choice") {
        sb.modal = null;
        sb.android.statusMsg = val === "allowed" ? "Bluetooth permission allowed (simulated). Real thermal printing still requires physical hardware." : "Bluetooth permission denied; POS checkout continues unaffected.";
        saveSb(); renderSandbox();
      }
      else if (a === "and-screen") { sb.android.screen = val; saveSb(); renderSandbox(); }
      else if (a === "and-signin") { sb.android.signedIn = true; sb.android.screen = "cashier"; sb.android.statusMsg = "Signed in as synthetic operator Maria Santos."; saveSb(); renderSandbox(); }
      else if (a === "and-toggle-offline") { sb.android.offline = !sb.android.offline; sb.android.statusMsg = sb.android.offline ? "Device set to Offline (Simulated). New actions queue in outbox." : "Device back Online. Tap Reconnect to sync outbox."; saveSb(); renderSandbox(); }
      else if (a === "and-reconnect") {
        if (sb.android.offline) { sb.android.statusMsg = "Cannot reconnect while Offline simulation is active. Go Online first."; saveSb(); renderSandbox(); return; }
        const n = sb.android.outboxQueue.length;
        sb.android.outboxQueue = [];
        sb.android.statusMsg = `Connected and lease renewed (Simulated). Central applied ${n} operation(s). Pending operations: 0.`;
        saveSb(); renderSandbox();
      }
      else if (a === "and-toggle-shift") {
        if (sb.preset === "error" && !sb.android.shiftOpen) {
          sb.android.shiftOpen = true;
          sb.android.stuckIntentBug = true;
          sb.android.statusMsg = "Unconfirmed action: ArgumentException (reproducing 3d23ef4b ClearConfirmedAsync bug).";
        } else {
          sb.android.shiftOpen = !sb.android.shiftOpen;
          sb.android.outboxQueue.push({ id: "OP-" + Date.now().toString().slice(-4), type: sb.android.shiftOpen ? "CafeShiftOpenedV1" : "CafeShiftClosedV1", status: "PendingUpload" });
          sb.android.statusMsg = sb.android.shiftOpen ? "Shift opened locally (enqueued to demo outbox)." : "Shift closed with physical count (enqueued to demo outbox).";
        }
        saveSb(); renderSandbox();
      }
      else if (a === "and-clear-bug") { sb.android.stuckIntentBug = false; sb.preset = "happy"; sb.android.statusMsg = "Cleared Error preset — normal simulation resumed."; saveSb(); renderSandbox(); }
      else if (a === "and-add") {
        const m = MENU_SEED.find((x) => x.id === val);
        if (m) sb.android.cart.push({ name: m.name, qty: 1, unitCents: m.priceCents });
        saveSb(); renderSandbox();
      }
      else if (a === "and-toggle-mode") { sb.android.serviceMode = sb.android.serviceMode === "Dine-In" ? "Takeout" : "Dine-In"; saveSb(); renderSandbox(); }
      else if (a === "and-save-order") {
        if (sb.android.stuckIntentBug) { sb.android.statusMsg = "Blocked: An earlier cashier intent (ShiftOpen) is unresolved (reproducing ERR-14)."; saveSb(); renderSandbox(); return; }
        if (!sb.android.cart.length) { sb.android.statusMsg = "Add at least one item before saving order."; saveSb(); renderSandbox(); return; }
        sb.android.savedOrderState = "Submitted";
        sb.android.outboxQueue.push({ id: "OP-ORD-" + Date.now().toString().slice(-3), type: "CafeOrderSavedV1", status: "PendingUpload" });
        sb.android.statusMsg = "Order saved locally and queued in outbox (" + sb.android.outboxQueue.length + " pending).";
        saveSb(); renderSandbox();
      }
      else if (a === "and-advance-order") {
        if (sb.android.savedOrderState === "Submitted") sb.android.savedOrderState = "Preparing";
        else if (sb.android.savedOrderState === "Preparing") sb.android.savedOrderState = "Ready";
        else if (sb.android.savedOrderState === "Ready") {
          const total = sb.android.cart.reduce((s, c) => s + c.qty * c.unitCents, 0);
          sb.modal = { type: "receipt-preview", receipt: { receiptNo: "SLRN-AND-DEMO-" + (sb.nextReceiptSeq++), lines: sb.android.cart.map((c) => `${c.qty}× ${c.name}`), totalCents: total, tender: "Cash (Android Demo)", cashCents: total, arCents: 0 } };
          sb.android.outboxQueue.push({ id: "OP-SALE-" + Date.now().toString().slice(-3), type: "SaleCommittedV1", status: "PendingUpload" });
          sb.android.cart = [];
          sb.android.savedOrderState = null;
          sb.android.statusMsg = "Simulated Android sale committed to local outbox. Reconnect in Setup & Sync to push.";
        }
        saveSb(); renderSandbox();
      }
      else if (a === "and-req-refund") { sb.android.statusMsg = "Simulated C5 Refund requested on Android (queued in demo outbox)."; saveSb(); renderSandbox(); }
    });

    frame.addEventListener("input", (e) => {
      const inp = e.target.closest("[data-sb-input]");
      if (!inp) return;
      sb[inp.dataset.sbInput] = inp.value;
      saveSb();
      if (inp.dataset.sbInput === "menuSearch") renderSandbox();
    });

    frame.addEventListener("change", (e) => {
      const ch = e.target.closest("[data-sb-change]");
      if (!ch) return;
      sb[ch.dataset.sbChange] = ch.value;
      saveSb();
      renderSandbox();
    });

    frame.addEventListener("submit", (e) => {
      const form = e.target.closest("[data-sb-form]");
      if (!form) return;
      e.preventDefault();
      const kind = form.dataset.sbForm;
      const fd = new FormData(form);

      if (kind === "add-custom-item") {
        const item = MENU_SEED.find((m) => m.id === form.dataset.product) || MENU_SEED[0];
        const vObj = item.variants.find((v) => v.id === fd.get("variant")) || item.variants[0];
        let unit = vObj.priceCents;
        const modLabels = [];
        for (const g of item.modifiers) {
          const picked = fd.getAll("mod_" + g.group);
          for (const pid of picked) {
            const opt = g.options.find((o) => o.id === pid);
            if (opt) { unit += opt.delta; modLabels.push(opt.label); }
          }
        }
        sb.cart.push({ lineId: "L-" + Date.now(), productId: item.id, name: `${item.name} (${vObj.label})`, mods: modLabels.join(", "), note: String(fd.get("note") || "").trim(), qty: 1, unitCents: unit });
        sb.modal = null;
        setToast("ok", `Added ${item.name} (${php(unit)}) to simulated ticket.`);
      }
      else if (kind === "open-shift") {
        const amt = Math.round(parseFloat(String(fd.get("openingCash") || "0")) * 100);
        if (isNaN(amt) || amt < 0) { setToast("err", "Enter a valid non-negative PHP opening cash float."); return; }
        sb.shiftOpen = true;
        sb.openingCashCents = amt;
        sb.expectedCashCents = amt;
        sb.modal = null;
        setToast("ok", `Simulated cashier shift opened with ${php(amt)}.`);
      }
      else if (kind === "blind-close") {
        const raw = String(fd.get("countedCash") || "").trim();
        if (!/^\d+(\.\d{1,2})?$/.test(raw)) {
          sb.modal = { type: "blind-close", val: raw, err: "Enter a valid non-negative PHP amount with up to 2 decimal places." };
          renderSandbox(); return;
        }
        const counted = Math.round(parseFloat(raw) * 100);
        sb.lastVariance = { countedCents: counted, expectedCents: sb.expectedCashCents, varianceCents: counted - sb.expectedCashCents };
        sb.shiftOpen = false;
        sb.modal = { type: "blind-close-result" };
        saveSb(); renderSandbox();
      }
      else if (kind === "cancel-order") {
        const reason = String(fd.get("reason") || "").trim();
        if (!reason) return;
        const o = sb.orders.find((x) => x.id === form.dataset.order);
        if (o) o.state = "Cancelled";
        sb.audit.unshift({ action: "ORDER_CANCELLED", entity: form.dataset.order, reason, at: "Just now" });
        sb.modal = null;
        setToast("ok", `Order ${form.dataset.order} cancelled with audit reason.`);
      }
      else if (kind === "checkout") {
        const o = sb.orders.find((x) => x.id === form.dataset.order);
        if (!o) return;
        const discCents = Math.max(0, Math.round(parseFloat(String(fd.get("discount") || "0")) * 100) || 0);
        const discReason = String(fd.get("discountReason") || "").trim();
        if (discCents > 0 && !discReason) { setToast("err", "A discount reason is required when Order discount > 0."); return; }
        const netCents = Math.max(0, o.totalCents - discCents);
        const tender = String(fd.get("tender") || "Cash");
        let cashCents = tender === "Cash" ? netCents : tender === "PartialCashAr" ? Math.round(parseFloat(String(fd.get("cashPhp") || "0")) * 100) : 0;
        let arCents = netCents - cashCents;
        const receiptNo = "SLRN-DEMO-0000" + (sb.nextReceiptSeq++);
        o.state = "Completed";
        o.receiptNo = receiptNo;
        o.totalCents = netCents;
        o.cashCents = cashCents;
        o.arCents = arCents;
        if (cashCents > 0) {
          sb.expectedCashCents += cashCents;
          sb.cashLedger.unshift({ type: "SaleCashReceipt", deltaCents: cashCents, reason: "Simulated POS checkout " + receiptNo, at: "Just now" });
        }
        if (arCents > 0) {
          const c = sb.customers.find((x) => x.id === fd.get("customerId")) || sb.customers[0];
          if (c) c.balanceCents += arCents;
        }
        sb.lastReceipt = { receiptNo, lines: o.lines, discountCents: discCents, totalCents: netCents, tender, cashCents, arCents };
        sb.activeOrderId = null;
        setToast("ok", `Simulated payment confirmed · ${receiptNo} (${php(netCents)}).`);
      }
      else if (kind === "receive-purchase") {
        const ing = sb.ingredients.find((i) => i.id === fd.get("ingId"));
        const q = parseInt(String(fd.get("qty") || "0"), 10);
        if (ing && q > 0) ing.onHand += q;
        setToast("ok", `Received +${q} ${ing ? ing.unit + " " + ing.name : ""} (Demo stock ledger updated; POS cash drawer untouched).`);
      }
      else if (kind === "record-waste") {
        const ing = sb.ingredients.find((i) => i.id === fd.get("ingId"));
        const q = parseInt(String(fd.get("qty") || "0"), 10);
        if (ing && q > 0) ing.onHand = Math.max(0, ing.onHand - q);
        setToast("ok", `Recorded -${q} ${ing ? ing.unit + " " + ing.name : ""} spoilage in demo stock ledger.`);
      }
      else if (kind === "commit-refund") {
        if (sb.preset === "error") { setToast("err", "Simulated ERR_NETWORK_UNKNOWN — retained operationId preserved for safe retry."); return; }
        const rf = sb.refunds.find((x) => x.id === form.dataset.refund);
        if (rf) rf.state = "Committed";
        const cashCents = Math.round(parseFloat(String(fd.get("cashPhp") || "0")) * 100) || 0;
        if (cashCents > 0) sb.cashLedger.unshift({ type: "CashRefund", deltaCents: -cashCents, reason: "Simulated C5 refund " + (rf ? rf.receiptNo : ""), at: "Just now" });
        sb.modal = null;
        setToast("ok", `Simulated C5 refund ${rf ? rf.receiptNo : ""} committed.`);
      }
      else if (kind === "save-settings") {
        sb.storeSettings = {
          storeName: String(fd.get("storeName") || "").trim(),
          receiptHeader: String(fd.get("receiptHeader") || "").trim(),
          receiptFooter: String(fd.get("receiptFooter") || "").trim()
        };
        setToast("ok", "Saved synthetic store & receipt settings locally (preview only).");
      }
      else if (kind === "restore-backup") {
        if (String(fd.get("confirmText") || "") !== "RESTORE") {
          setToast("err", "Exact uppercase 'RESTORE' is required before simulating database restore.");
          return;
        }
        sb.modal = null;
        setToast("ok", "Simulated backup restore confirmed (zero real files touched).");
      }
    });
  }

  window.SalrynSandbox = {
    navigate: navigateRoute,
    reset: () => { sb = createSeedState("happy"); saveSb(); renderSandbox(); }
  };

  document.addEventListener("DOMContentLoaded", () => {
    loadSb();
    bindSandboxEvents();
    renderSandbox();
  });
})();

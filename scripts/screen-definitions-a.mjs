// Screen-specific WHAT / WHY / SHOULD definitions (Part A: Windows Cashier, Orders/Kitchen, Back-Office, Central Owner)
// Grounded strictly in observed PNGs from Kirjane/Dev-Salryn-Cafe @ 3d23ef4b9c4bca7b992f9e58d28c61e9e474ad23.

export const SCREENS_PART_A = [
  // === 01-WINDOWS-CASHIER (13) ===
  {
    id: "WIN-CASH-01",
    order: 1,
    originalFilename: "01-WINDOWS-CASHIER/01-operator-sign-in.png",
    image: "assets/screenshots/01-WINDOWS-CASHIER/01-operator-sign-in.png",
    platform: "Windows Host Web",
    category: "01-WINDOWS-CASHIER",
    module: "Cashier Workstation",
    workflow: "Authentication",
    role: "Unauthenticated Operator",
    state: "Initial Sign-In Gate",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Windows Cashier — Operator Sign In",
    sandboxRoute: "win-cashier?role=signed-out",
    testCaseIds: ["W03", "W05"],
    observed: "Centered warm cream (#FFF4E1) card on a full-bleed cream background displaying the square Salryn Cafe emblem, kicker 'SALRYN CAFE · LOCAL HOST', heading 'Cafe workstation', subtitle 'Sign in to the Salryn Cafe Local Host to begin.', and an 'Operator sign in' form with required 'Username *' and 'Password *' text inputs plus a full-width dark espresso (#3B1204) 'Sign in' button. No navigation sidebar or menu items are exposed before authentication.",
    purpose: "Entry authentication gate for counter staff and managers opening the local Windows Host POS (/cafe/). Ensures every order, cash movement, and shift action is attributed to an authenticated local operator before financial controls appear.",
    expected: "Must block access to menu, orders, and drawer controls until valid local credentials succeed against Local Host /api/auth/login. Password input must mask characters, required fields must validate before submit, invalid logins must display a clear error without leaking account existence details, and keyboard Tab/Enter submission must work smoothly. RECOMMENDATION / NOT ESTABLISHED REQUIREMENT: Consider adding a visible Caps Lock indicator on password focus.",
    expectedEvidence: "apps/cafe-web/src/cashier/WorkstationApp.tsx; Issue #7 & #11 auth boundary",
    controlContracts: [
      { num: 1, x: 50, y: 53, label: "Username *", target: "Text input (required)", expectedOutcome: "Accepts local operator username and advances focus via Tab.", failureOutcome: "Empty submit prevented by form validation.", rolePermission: "Public / Unauthenticated", evidenceScope: "Appearance & live login flow confirmed (see ERR-08 for 401 failure)" },
      { num: 2, x: 50, y: 61, label: "Password *", target: "Masked password input", expectedOutcome: "Masks typed characters and submits on Enter.", failureOutcome: "Wrong password triggers HTTP 401 error banner without clearing username.", rolePermission: "Public / Unauthenticated", evidenceScope: "Appearance & live login flow confirmed" },
      { num: 3, x: 50, y: 67, label: "Sign in", target: "Primary submit button", expectedOutcome: "Authenticates operator and loads Cashier workstation with role-appropriate controls.", failureOutcome: "Displays authentication failure message and stays on sign-in gate.", rolePermission: "Public / Unauthenticated", evidenceScope: "Appearance & live behavior confirmed" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Open the Windows Salryn Cafe app or /cafe/ URL before signing in.",
      "Verify that no menu tiles, orders, or cash totals are visible prior to login.",
      "Enter a valid synthetic QA username and password, then press Enter or click 'Sign in'.",
      "Confirm the screen transitions into the Cafe workstation showing the operator name and role."
    ],
    limitations: "Static screenshot confirms unauthenticated layout and masking only; server password hashing and session expiry require live build testing (W05)."
  },
  {
    id: "WIN-CASH-02",
    order: 2,
    originalFilename: "01-WINDOWS-CASHIER/02-cashier-main-idle.png",
    image: "assets/screenshots/01-WINDOWS-CASHIER/02-cashier-main-idle.png",
    platform: "Windows Host Web",
    category: "01-WINDOWS-CASHIER",
    module: "Cashier Workstation",
    workflow: "Order Entry",
    role: "Admin / Manager (Maria Santos)",
    state: "Idle Ready With Open Shift",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Cafe Cashier — Main Interface & Open Shift",
    sandboxRoute: "win-cashier?preset=happy",
    testCaseIds: ["W03", "W06", "F01"],
    observed: "Full 1920x1080 espresso-and-cream workstation layout. Top espresso bar shows Salryn Cafe mark ('Local Host Workstation (Salryn.Cafe)'), green 'Host Connected' pill, operator 'Maria Santos (Manager) · Admin', and 'Sign out'. Left sidebar lists FRONT COUNTER ('Cafe Cashier' active, 'Orders & Lifecycle' badge), PREPARATION ('Kitchen & Barista'), and STATION CONTROLS ('Shift & Central Sync'). Workspace header displays 'Host SQLite Live' and 'Shift Open' badges plus 'Back Office & Reports', 'Refresh from Host', and 'Blind Shift Close'. Left pane shows 'Published Cafe Menu' with 'Cash / AR / Partial Cash+AR' policy pill, 'Search Cafe Menu (F2)', category chips, and product cards including unavailable 'Seasonal Guimaras Mango Tart (86'd / Unavailable)'. Right pane shows empty 'New Order Ticket' with Service mode, Table/reference, ₱0.00 subtotal, and disabled 'Save order'.",
    purpose: "Primary high-speed counter screen for baristas and cashiers taking Dine-In and Takeout orders during an active shift.",
    expected: "Must display live published menu items with exact PHP prices, grey out 86'd/unavailable items so they cannot be ordered, display the locked tender policy clearly, show accurate shift status, support F2 search shortcut, and keep 'Save order' disabled while cart is empty.",
    expectedEvidence: "apps/cafe-web/src/cashier/CashierWorkstation.tsx; Issue #11 cashier contract",
    controlContracts: [
      { num: 1, x: 6, y: 17, label: "Cafe Cashier / Sidebar Nav", target: "Primary navigation rail", expectedOutcome: "Switches cleanly between Cashier, Orders & Lifecycle, Kitchen & Barista, and Shift & Central Sync.", failureOutcome: "Active work should not silently disappear on tab switch.", rolePermission: "Authenticated POS Operator", evidenceScope: "Appearance & navigation confirmed across WIN-ORD-01, WIN-KDS-01, WIN-CASH-12" },
      { num: 2, x: 32, y: 27, label: "Search Cafe Menu (F2)", target: "Search box", expectedOutcome: "Filters visible menu cards immediately by name or SKU.", failureOutcome: "Shows empty search state when no items match.", rolePermission: "Products.View", evidenceScope: "Appearance confirmed; interactive filter testable in Sandbox" },
      { num: 3, x: 20, y: 49, label: "86'd / Unavailable Menu Tile", target: "Disabled menu card (Mango Tart)", expectedOutcome: "Visually muted and prevents adding sold-out item to ticket.", failureOutcome: "Must not open customization dialog or enter cart.", rolePermission: "Products.View", evidenceScope: "Visual disabled state confirmed" },
      { num: 4, x: 94, y: 10, label: "Blind Shift Close", target: "Header action button", expectedOutcome: "Opens Blind Shift Close modal hiding expected drawer cash until count submission.", failureOutcome: "Disabled/hidden when no shift is open.", rolePermission: "Shift.OpenClose", evidenceScope: "Confirmed in DLG-02 and WIN-CASH-13" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Sign in as an authorized operator and open a shift.",
      "Verify the header shows both 'Host SQLite Live' and 'Shift Open' badges.",
      "Confirm 86'd items like 'Seasonal Guimaras Mango Tart' cannot be added to an order.",
      "Press F2 to verify focus jumps to the menu search input."
    ],
    limitations: "Screenshot confirms idle workstation layout; F2 keyboard shortcut and live Host polling require live build or interactive sandbox testing."
  },
  {
    id: "WIN-CASH-03",
    order: 3,
    originalFilename: "01-WINDOWS-CASHIER/03-category-filtered.png",
    image: "assets/screenshots/01-WINDOWS-CASHIER/03-category-filtered.png",
    platform: "Windows Host Web",
    category: "01-WINDOWS-CASHIER",
    module: "Cashier Workstation",
    workflow: "Menu Browsing",
    role: "Admin / Manager (Maria Santos)",
    state: "Espresso Bar Category Active",
    capturesStatus: "CAPTURED",
    priority: "P2",
    title: "Menu Category Filtered (Espresso Bar)",
    sandboxRoute: "win-cashier?category=Espresso+Bar",
    testCaseIds: ["W06"],
    observed: "Cashier workstation with the 'Espresso Bar' category chip highlighted in solid dark espresso (#3B1204) and white text. The menu grid narrows exclusively to Espresso Bar items ('Spanish Latte · ₱165.00'), while other categories ('All', 'Cold Brew & Matcha', 'General Merchandise', 'Pastries & Bakery', 'Uncategorized') remain available as secondary pills above the grid.",
    purpose: "Lets cashiers rapidly narrow a growing cafe menu by drink/pastry station during peak rushes without typing.",
    expected: "Selecting a category pill must highlight the active chip with accessible contrast, immediately filter menu cards to that category, and allow returning to 'All' in one click without clearing the active draft cart.",
    expectedEvidence: "apps/cafe-web/src/cashier/CashierWorkstation.tsx; Issue #11 menu filtering",
    controlContracts: [
      { num: 1, x: 29, y: 32, label: "Espresso Bar Category Pill", target: "Filter chip button", expectedOutcome: "Filters menu grid to Espresso Bar products only.", failureOutcome: "Clicking 'All' restores full published catalog.", rolePermission: "Products.View", evidenceScope: "Appearance & active filtering confirmed" },
      { num: 2, x: 20, y: 40, label: "Spanish Latte · ₱165.00", target: "Menu item card", expectedOutcome: "Opens variant & modifier customization modal for Spanish Latte.", failureOutcome: "Blocked only if item is 86'd/unavailable.", rolePermission: "Orders.Create", evidenceScope: "Confirmed in WIN-CASH-04" }
    ],
    discrepancies: [
      "Category chips include inherited 'General Merchandise' and 'Uncategorized' seed buckets alongside Cafe Yza categories; testers should verify whether non-cafe categories should be hidden when empty."
    ],
    issues: [],
    testSteps: [
      "Click each category pill ('All', 'Espresso Bar', 'Cold Brew & Matcha', 'Pastries & Bakery').",
      "Confirm only products belonging to that category appear.",
      "Verify switching categories does not erase items already in the right-hand ticket."
    ],
    limitations: "Confirms Espresso Bar filtering at 1920x1080; empty-category chip hiding is a catalog configuration check."
  },
  {
    id: "WIN-CASH-04",
    order: 4,
    originalFilename: "01-WINDOWS-CASHIER/04-variant-modifier-dialog.png",
    image: "assets/screenshots/01-WINDOWS-CASHIER/04-variant-modifier-dialog.png",
    platform: "Windows Host Web",
    category: "01-WINDOWS-CASHIER",
    module: "Cashier Workstation",
    workflow: "Item Customization",
    role: "Admin / Manager (Maria Santos)",
    state: "Variant & Modifier Modal Open",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Product Variant & Modifier Customization Dialog",
    sandboxRoute: "win-cashier?modal=customize",
    testCaseIds: ["W06", "F02"],
    observed: "Modal overlay titled 'Configure Spanish Latte' over dimmed cashier workspace. Contains a 'Variant' dropdown showing 'Hot · 12oz (₱165.00)', required group 'Milk Choice · choose 1–1' with checkboxes ('Whole Fresh Milk', checked 'Barista Oat Milk (+₱35.00)'), optional group 'Espresso Boost · choose 0–2' with checked 'Extra Espresso Shot (+₱40.00)' and unchecked 'Sub Decaf Roast (+₱15.00)', a 'Barista / Kitchen Note' text field with 'Less ice, light condensed', and bottom buttons 'Cancel' and espresso 'Add to Ticket'. A green toast 'Cashier shift opened' appears in the top-right.",
    purpose: "Captures cafe-specific beverage customizations (cup size/temperature, milk substitution upcharges, espresso shots, barista notes) before adding a line to the ticket.",
    expected: "Must enforce min/max modifier rules (e.g., Milk Choice requires exactly 1 selection, Espresso Boost allows 0–2), show accurate PHP price deltas, carry the barista note through to the Kitchen Display ticket, and close cleanly on Cancel or Esc without mutating the cart. RECOMMENDATION / NOT ESTABLISHED REQUIREMENT: Single-choice groups ('choose 1–1') could use radio buttons visually instead of checkboxes for clearer affordance.",
    expectedEvidence: "apps/cafe-web/src/cashier/CashierWorkstation.tsx; Cafe Yza C1 Menu/Modifiers spec",
    controlContracts: [
      { num: 1, x: 50, y: 39, label: "Variant Selector", target: "Select dropdown", expectedOutcome: "Switches base size/temperature and updates base price (Hot 12oz ₱165 vs Iced 16oz ₱180).", failureOutcome: "At least one active variant is always required.", rolePermission: "Orders.Create", evidenceScope: "Appearance & selection confirmed" },
      { num: 2, x: 46, y: 49, label: "Milk Choice (choose 1–1)", target: "Required modifier group", expectedOutcome: "Applies selected milk option and +₱35.00 upcharge for Barista Oat Milk.", failureOutcome: "Blocks Add to Ticket if min=1 constraint is unmet.", rolePermission: "Orders.Create", evidenceScope: "Appearance & selection confirmed" },
      { num: 3, x: 46, y: 59, label: "Espresso Boost (choose 0–2)", target: "Optional modifier group", expectedOutcome: "Adds up to 2 optional shot modifiers (+₱40.00 / +₱15.00).", failureOutcome: "Prevents selecting more than max=2.", rolePermission: "Orders.Create", evidenceScope: "Appearance & selection confirmed" },
      { num: 4, x: 59, y: 76, label: "Add to Ticket", target: "Primary modal confirm button", expectedOutcome: "Appends configured line with modifiers and note to active ticket.", failureOutcome: "Shows validation hint if required modifier is missing.", rolePermission: "Orders.Create", evidenceScope: "Confirmed in WIN-CASH-05 & WIN-KDS-01" }
    ],
    discrepancies: [
      "Required 1-of-1 modifier group ('Milk Choice · choose 1–1') renders checkbox controls rather than radio controls."
    ],
    issues: [],
    testSteps: [
      "Click 'Spanish Latte' on the menu grid.",
      "Choose a variant, select 'Barista Oat Milk (+₱35.00)' and 'Extra Espresso Shot (+₱40.00)', and enter a barista note.",
      "Click 'Add to Ticket' and verify the computed line total matches ₱165 + ₱35 + ₱40 = ₱240 per cup."
    ],
    limitations: "Static image confirms modal layout and selections; min/max enforcement requires interactive or live build testing."
  },
  {
    id: "WIN-CASH-05",
    order: 5,
    originalFilename: "01-WINDOWS-CASHIER/05-dine-in-cart-editing.png",
    image: "assets/screenshots/01-WINDOWS-CASHIER/05-dine-in-cart-editing.png",
    platform: "Windows Host Web",
    category: "01-WINDOWS-CASHIER",
    module: "Cashier Workstation",
    workflow: "Dine-In Order",
    role: "Admin / Manager (Maria Santos)",
    state: "Dine-In Draft Saved & Editable",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Dine-In Order Creation & Active Cart",
    sandboxRoute: "win-cashier?mode=dinein",
    testCaseIds: ["F02"],
    observed: "Cashier workstation with the right-hand ticket panel populated for a Dine-In order ('Table 04'), displaying '2× Spanish Latte (Hot · 12oz)' with 'Extra Espresso Shot, Barista Oat Milk', note 'Less ice, light condensed', quantity stepper controls, confirmed line total ₱480.00, and action buttons to save revisions, send to preparation, park, or cancel the order.",
    purpose: "Allows the counter operator to build, adjust quantities, assign a table number, and persist a Dine-In order revision to the Host before sending to the barista bar.",
    expected: "Must accurately compute line totals including variant + modifier upcharges × quantity, persist the order revision with client-supplied operationId, and transition cleanly to 'Send to preparation', 'Park order', or 'Cancel order'.",
    expectedEvidence: "apps/cafe-web/src/cashier/CashierWorkstation.tsx; Cafe Yza C4 Orders",
    controlContracts: [
      { num: 1, x: 66, y: 27, label: "Service mode (Dine-In)", target: "Mode selector", expectedOutcome: "Tags ticket as Dine-In and surfaces Table/reference input.", failureOutcome: "Locked once order leaves Open state.", rolePermission: "Orders.Create", evidenceScope: "Confirmed on live Host" },
      { num: 2, x: 84, y: 27, label: "Table / reference", target: "Text input ('Table 04')", expectedOutcome: "Attaches table label to Orders Board and Kitchen ticket.", failureOutcome: "Optional for walk-ins; preserved across revisions.", rolePermission: "Orders.Create", evidenceScope: "Confirmed in WIN-KDS-01" },
      { num: 3, x: 75, y: 58, label: "Order Lifecycle Actions", target: "Save / Send to Prep / Park / Cancel", expectedOutcome: "Persists revision or transitions order status atomically on Host SQLite.", failureOutcome: "Version conflicts retain pending intent safely.", rolePermission: "Orders.Create / Orders.Submit", evidenceScope: "Confirmed in WIN-ORD-01 and ERR-10" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Switch Service mode to Dine-In and enter 'Table 04'.",
      "Add 2 customized Spanish Lattes and verify total equals ₱480.00.",
      "Click 'Save order' and verify confirmation before sending to preparation."
    ],
    limitations: "Confirms Dine-In cart rendering and server-calculated ₱480.00 total."
  },
  {
    id: "WIN-CASH-06",
    order: 6,
    originalFilename: "01-WINDOWS-CASHIER/06-takeout-order.png",
    image: "assets/screenshots/01-WINDOWS-CASHIER/06-takeout-order.png",
    platform: "Windows Host Web",
    category: "01-WINDOWS-CASHIER",
    module: "Cashier Workstation",
    workflow: "Takeout Order",
    role: "Admin / Manager (Maria Santos)",
    state: "Takeout Ticket Saved",
    capturesStatus: "CAPTURED",
    priority: "P1",
    title: "Takeout Order Creation",
    sandboxRoute: "win-cashier?mode=takeout",
    testCaseIds: ["F02"],
    observed: "Right-hand order panel configured for 'Takeout' service mode with buzzer/walk-in label ('Walk-In #08' / 'Buzzer #12'), showing added cold brew/matcha/pastry line items, exact subtotal calculation, and lifecycle buttons ready to submit to the Kitchen queue or park.",
    purpose: "Supports quick grab-and-go / takeout counter tickets distinct from seated Dine-In tables so baristas pack items appropriately.",
    expected: "Must clearly label 'Takeout' on both the Orders Board and Kitchen Display cards, preserve buzzer/customer tag, and allow independent parallel tickets without overwriting earlier Dine-In drafts.",
    expectedEvidence: "apps/cafe-web/src/cashier/CashierWorkstation.tsx; Cafe Yza C4 service modes",
    controlContracts: [
      { num: 1, x: 66, y: 27, label: "Service mode: Takeout", target: "Service mode dropdown", expectedOutcome: "Marks ticket as Takeout for packaging & KDS badge.", failureOutcome: "Cannot silently switch mode after order is completed.", rolePermission: "Orders.Create", evidenceScope: "Confirmed in WIN-ORD-01 & WIN-KDS-01" },
      { num: 2, x: 92, y: 58, label: "Send to preparation / Park", target: "Workflow buttons", expectedOutcome: "Moves ticket to Kitchen queue or Parks it for later resume.", failureOutcome: "Requires saved revision first.", rolePermission: "Orders.Submit", evidenceScope: "Confirmed on live Host" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Click 'Start another order' and keep Service mode set to Takeout.",
      "Enter a tag such as 'Walk-In #08' or 'Buzzer #12', add items, and save.",
      "Confirm the ticket displays as Takeout in Orders & Lifecycle."
    ],
    limitations: "Confirms visual Takeout draft state; multi-station concurrency requires live Host + Android testing."
  },
  {
    id: "WIN-CASH-07",
    order: 7,
    originalFilename: "01-WINDOWS-CASHIER/07-discounts-and-totals.png",
    image: "assets/screenshots/01-WINDOWS-CASHIER/07-discounts-and-totals.png",
    platform: "Windows Host Web",
    category: "01-WINDOWS-CASHIER",
    module: "Cashier Workstation",
    workflow: "Checkout & Discounts",
    role: "Admin / Manager (Maria Santos)",
    state: "Ready Order Checkout With Discount",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Discounts, Reason & Checkout Totals",
    sandboxRoute: "win-cashier?step=checkout",
    testCaseIds: ["F02"],
    observed: "Right pane shows 'Current order · Ready' ('DineIn · Table 04 · v4') with 'Server Authoritative' pill, '2× Spanish Latte (Hot · 12oz) — ₱480.00', 'Confirmed order total ₱480.00', 'Tender' dropdown set to 'Cash', 'Order discount (PHP)' set to '20.00', 'Discount reason' set to 'Barista Loyalty Promo', 'Cash amount (PHP)' set to '460.00', and bottom buttons 'Complete payment' and 'Start another order'. A residual red error toast ('Kitchen ticket failed: A valid client-supplied operationId...') from the prior KDS capture remains visible in the top-right.",
    purpose: "Allows authorized staff to apply an audited order-level discount with mandatory reason and review final tender math before committing a sale.",
    expected: "Must require a non-empty discount reason when discount > 0, never permit negative net total, validate tender sum equals net total (₱480.00 - ₱20.00 = ₱460.00), restrict tenders strictly to Cash / AR / Partial Cash+AR, and prevent double-submission during checkout. RECOMMENDATION / NOT ESTABLISHED REQUIREMENT: Display an explicit computed 'Net Payable: ₱460.00' summary row between 'Order discount' and 'Cash amount' so cashiers do not have to subtract mentally.",
    expectedEvidence: "apps/cafe-web/src/cashier/CashierWorkstation.tsx; AGENTS.md locked tender policy",
    controlContracts: [
      { num: 1, x: 75, y: 42, label: "Tender Selector", target: "Dropdown (Cash / AR / Partial Cash+AR)", expectedOutcome: "Restricts options strictly to locked Cafe tender policy.", failureOutcome: "GCash/Maya/Card must never appear active.", rolePermission: "Sales.Create (AR requires Receivables.CreateCreditSale)", evidenceScope: "Confirmed across WIN-CASH-07..10 and ERR-09" },
      { num: 2, x: 67, y: 50, label: "Order discount (PHP) & Reason", target: "Decimal + text inputs", expectedOutcome: "Reduces net payable by ₱20.00 and logs 'Barista Loyalty Promo' in audit.", failureOutcome: "Rejects negative or >subtotal discounts.", rolePermission: "Discounts.Apply", evidenceScope: "Confirmed on live checkout in WIN-CASH-08" },
      { num: 3, x: 75, y: 58, label: "Cash amount (PHP)", target: "Decimal input ('460.00')", expectedOutcome: "Captures cash tendered matching discounted net total.", failureOutcome: "Rejects underpayment or invalid decimal.", rolePermission: "Sales.Create", evidenceScope: "Confirmed in WIN-CASH-08" },
      { num: 4, x: 84, y: 65, label: "Complete payment", target: "Primary commit button", expectedOutcome: "Commits sale once using durable operationId and displays receipt number.", failureOutcome: "Retains pending intent on network error without duplicate charge.", rolePermission: "Sales.Create", evidenceScope: "Confirmed in WIN-CASH-08" }
    ],
    discrepancies: [
      "Residual 'Kitchen ticket failed' toast from prior KDS screen overlaps header action buttons in top-right.",
      "No explicit live-calculated 'Net Payable after Discount' row is shown above the Cash amount input."
    ],
    issues: [],
    testSteps: [
      "Advance a saved order to Ready and open it in Cashier.",
      "Enter an Order discount (e.g. 20.00) and a clear Discount reason.",
      "Enter the discounted Cash amount and click 'Complete payment'.",
      "Verify only Cash, Accounts Receivable, and Partial Cash+AR appear in the Tender dropdown."
    ],
    limitations: "Static screenshot confirms form layout and entered values; exact server integer-cent rounding requires live build verification."
  },
  {
    id: "WIN-CASH-08",
    order: 8,
    originalFilename: "01-WINDOWS-CASHIER/08-cash-checkout-confirmed.png",
    image: "assets/screenshots/01-WINDOWS-CASHIER/08-cash-checkout-confirmed.png",
    platform: "Windows Host Web",
    category: "01-WINDOWS-CASHIER",
    module: "Cashier Workstation",
    workflow: "Cash Checkout",
    role: "Admin / Manager (Maria Santos)",
    state: "Sale Completed & Receipt Issued",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Cash Checkout Completed & Receipt Confirmation",
    sandboxRoute: "win-cashier?step=receipt",
    testCaseIds: ["F02"],
    observed: "Right pane shows 'Current order · Completed' ('DineIn · Table 04 · v5'), line summary '2× Spanish Latte (Hot · 12oz) · ₱480.00', green confirmation card 'Payment confirmed · Receipt SLRN-2026-000037' with Sale ID, and action buttons 'Print Receipt' and 'Start another order'. Header status reads 'Payment confirmed. Receipt SLRN-2026-000037.' and a green toast confirms the receipt number (below the un-dismissed red KDS toast).",
    purpose: "Gives the cashier unambiguous proof that the Host database committed the sale, shows the sequential receipt number, and offers immediate receipt printing or starting the next customer's order.",
    expected: "Must display server-issued receipt number and Sale ID, disable re-submitting payment on the completed order, credit the open cash shift ledger by the net cash collected, and provide a working 'Print Receipt' and 'Start another order' flow.",
    expectedEvidence: "apps/cafe-web/src/cashier/CashierWorkstation.tsx; Cafe Yza C5 Payments",
    controlContracts: [
      { num: 1, x: 75, y: 40, label: "Payment Confirmed Banner", target: "Status alert (SLRN-2026-000037)", expectedOutcome: "Confirms durable commit with receipt number and Sale ID.", failureOutcome: "Must never appear unless server returned HTTP 200/201.", rolePermission: "Sales.Create", evidenceScope: "Confirmed on live Host" },
      { num: 2, x: 85, y: 49, label: "Print Receipt", target: "Secondary button", expectedOutcome: "Queues and executes receipt print job for SLRN-2026-000037.", failureOutcome: "Currently fails at 3d23ef4b with 'Sale has no persisted receipt snapshot.' (see WIN-CASH-11).", rolePermission: "Print.Receipt", evidenceScope: "Failure observed in WIN-CASH-11" },
      { num: 3, x: 93, y: 49, label: "Start another order", target: "Reset button", expectedOutcome: "Clears completed ticket from workspace and opens fresh empty ticket.", failureOutcome: "Must not delete or alter the committed sale.", rolePermission: "Orders.Create", evidenceScope: "Confirmed on live Host" }
    ],
    discrepancies: [
      "Top-right toast stack overlaps 'Back Office & Reports', 'Refresh from Host', and 'Blind Shift Close' buttons until dismissed."
    ],
    issues: [],
    testSteps: [
      "Complete a Cash order and confirm a green receipt confirmation banner appears with a sequential SLRN-YYYY-###### number.",
      "Verify the payment form is replaced by 'Print Receipt' and 'Start another order' so accidental double-charge is impossible."
    ],
    limitations: "Confirms Cash checkout UI confirmation; ledger balance accuracy must be verified in Back-Office Area E and Shift Close."
  },
  {
    id: "WIN-CASH-09",
    order: 9,
    originalFilename: "01-WINDOWS-CASHIER/09-ar-checkout.png",
    image: "assets/screenshots/01-WINDOWS-CASHIER/09-ar-checkout.png",
    platform: "Windows Host Web",
    category: "01-WINDOWS-CASHIER",
    module: "Cashier Workstation",
    workflow: "Accounts Receivable Checkout",
    role: "Admin / Manager (Maria Santos)",
    state: "Full AR Credit Sale Confirmed",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Accounts Receivable Checkout Completed",
    sandboxRoute: "win-cashier?step=ar-checkout",
    testCaseIds: ["F03"],
    observed: "Cashier workstation showing a completed Accounts Receivable (full utang/credit) sale bound to a synthetic customer account ('Atelier Coworking Corp.'), with receipt number confirmation ('SLRN-2026-000038'), zero cash drawer tender, and green completion toast.",
    purpose: "Enables approved house-account / corporate credit sales without adding phantom cash to the physical cash drawer.",
    expected: "Must require selecting an active customer when AR > 0, enforce Receivables.CreateCreditSale permission (denied to restricted cashiers as proven in ERR-09), increase customer AR balance in Back-Office Area E, and keep physical cash drawer expected cash unchanged.",
    expectedEvidence: "apps/cafe-web/src/cashier/CashierWorkstation.tsx; AGENTS.md locked tender policy",
    controlContracts: [
      { num: 1, x: 75, y: 40, label: "AR Receipt Confirmation", target: "Completed sale card", expectedOutcome: "Confirms credit sale recorded against chosen customer ledger.", failureOutcome: "Rejects AR submit when no customer is selected or operator lacks permission.", rolePermission: "Receivables.CreateCreditSale", evidenceScope: "Confirmed on live Host; negative check in ERR-09" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Select Tender = 'Accounts Receivable' on a Ready order.",
      "Pick a synthetic credit customer (e.g. Atelier Coworking Corp.) and complete payment.",
      "Check Back-Office Area E to verify the customer's receivable balance increased by the exact order total."
    ],
    limitations: "Static screenshot confirms completion UI; AR ledger balance update requires inspecting Back-Office Area E in live build."
  },
  {
    id: "WIN-CASH-10",
    order: 10,
    originalFilename: "01-WINDOWS-CASHIER/10-partial-cash-ar-checkout.png",
    image: "assets/screenshots/01-WINDOWS-CASHIER/10-partial-cash-ar-checkout.png",
    platform: "Windows Host Web",
    category: "01-WINDOWS-CASHIER",
    module: "Cashier Workstation",
    workflow: "Partial Cash + AR Checkout",
    role: "Admin / Manager (Maria Santos)",
    state: "Split Cash + AR Sale Completed",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Partial Cash + Accounts Receivable Checkout Completed",
    sandboxRoute: "win-cashier?step=partial-checkout",
    testCaseIds: ["F04"],
    observed: "Right pane displays 'Current order · Completed' ('Takeout · Buzzer #12 · v7'), '1× Yza Signature Cold Brew — ₱150.00', 'Confirmed order total ₱150.00', green confirmation card 'Payment confirmed · Receipt SLRN-2026-000039' (Sale ID f64694bd-...), and 'Print Receipt' / 'Start another order'. Top-right toast stack displays green confirmations for SLRN-2026-000038 and SLRN-2026-000039 alongside a red 'Receipt print failed: Sale has no persisted receipt snapshot.' toast from an earlier print attempt.",
    purpose: "Supports the locked third allowed tender mode where a customer pays part in Cash (e.g. ₱50.00) and puts the remainder (₱100.00) on their approved Accounts Receivable balance.",
    expected: "Must enforce Cash + AR == exact net order total, require a selected customer, credit only the cash portion to the open cash drawer and only the AR portion to customer receivables, and prevent duplicate commits.",
    expectedEvidence: "apps/cafe-web/src/cashier/CashierWorkstation.tsx; AGENTS.md tender invariant",
    controlContracts: [
      { num: 1, x: 75, y: 38, label: "Split Payment Receipt Card", target: "Confirmation status panel", expectedOutcome: "Confirms single atomic sale splitting Cash and AR.", failureOutcome: "Must fail validation if Cash + AR != net total or customer is empty.", rolePermission: "Sales.Create + Receivables.CreateCreditSale", evidenceScope: "Confirmed on live Host; cash split verified in WIN-BO-E" }
    ],
    discrepancies: [
      "Top-right toast stack retains an earlier red 'Receipt print failed' toast overlapping workspace controls."
    ],
    issues: [],
    testSteps: [
      "Choose Tender = 'Partial Cash + Accounts Receivable' on a ₱150.00 order.",
      "Enter ₱50.00 Cash and ₱100.00 AR with a synthetic customer and complete payment.",
      "Verify Back-Office Area E shows +₱50.00 in cash ledger and +₱100.00 in customer AR."
    ],
    limitations: "Receipt card does not break down the Cash vs AR split inline on the confirmation banner; split ledger entries are verified in Area E."
  },
  {
    id: "WIN-CASH-11",
    order: 11,
    originalFilename: "01-WINDOWS-CASHIER/11-receipt-print-queued.png",
    image: "assets/screenshots/01-WINDOWS-CASHIER/11-receipt-print-queued.png",
    platform: "Windows Host Web",
    category: "01-WINDOWS-CASHIER",
    module: "Cashier Workstation",
    workflow: "Receipt Printing",
    role: "Admin / Manager (Maria Santos)",
    state: "Receipt Print Failed (Reported Defect)",
    capturesStatus: "DEFECT_OBSERVED",
    priority: "P0",
    title: "Receipt Print Attempt & Failure Toast (Reported Defect)",
    sandboxRoute: "win-cashier?preset=error&step=receipt",
    testCaseIds: ["H02"],
    observed: "Completed Dine-In order 'Table 04 · v5' ('SLRN-2026-000037', ₱480.00) immediately after clicking 'Print Receipt'. The top-right toast stack displays a red error toast: 'Receipt print failed — Sale has no persisted receipt snapshot.' (below the earlier 'Kitchen ticket failed' toast and green 'Payment confirmed · SLRN-2026-000037' toast).",
    purpose: "Triggers thermal customer receipt printing for a completed sale via Host /api/cafe/print/jobs/receipt using the configured CustomerReceipt print station.",
    expected: "Clicking 'Print Receipt' on a freshly completed sale should find the sale's persisted receipt snapshot, queue/execute a CustomerReceipt print job with a durable operationId, and report accurate print/spool status—never failing with 'Sale has no persisted receipt snapshot.' on a newly completed Cafe sale.",
    expectedEvidence: "Runtime finding observed at 3d23ef4b against LocalApiApplicationFactory; Cafe Yza C7 Print Domain",
    controlContracts: [
      { num: 1, x: 85, y: 49, label: "Print Receipt Button", target: "Action button", expectedOutcome: "Creates a receipt print job and sends bytes to configured station.", failureOutcome: "Observed failure at 3d23ef4b: 'Sale has no persisted receipt snapshot.'", rolePermission: "Print.Receipt", evidenceScope: "Live runtime failure observed & captured" },
      { num: 2, x: 88, y: 20, label: "Receipt Print Failed Toast", target: "Error notification", expectedOutcome: "Honestly notifies operator when printing fails (does not fake success).", failureOutcome: "Underlying defect prevents any receipt printout on completed Cafe orders.", rolePermission: "Visible to operator", evidenceScope: "Live runtime error text captured verbatim" }
    ],
    discrepancies: [
      "DEFECT (Runtime Finding at 3d23ef4b): Completing an order via /api/cafe/orders/{id}/complete does not persist a receipt snapshot required by /api/cafe/print/jobs/receipt, causing both original 'Print Receipt' and Orders Board 'Reprint' to fail."
    ],
    issues: [
      {
        id: "BUG-3D23-RECEIPT-SNAPSHOT",
        severity: "High",
        kind: "Runtime Finding (Dev-Salryn-Cafe @ 3d23ef4b)",
        summary: "Print Receipt fails with 'Sale has no persisted receipt snapshot.' on newly completed Cafe sales.",
        repro: "1. Complete any Cash, AR, or Partial Cash+AR order on /cafe/. 2. Click 'Print Receipt' (or 'Reprint' on /cafe/orders). 3. Observe error toast 'Sale has no persisted receipt snapshot.'."
      }
    ],
    testSteps: [
      "Complete a synthetic Cash sale on Windows /cafe/.",
      "Click 'Print Receipt' immediately after payment confirmation.",
      "Verify whether the print job succeeds or reproduces the reported 'Sale has no persisted receipt snapshot.' error."
    ],
    limitations: "Proves software-layer failure before any physical thermal printer is reached; actual paper output remains HUMAN_REQUIRED once fixed."
  },
  {
    id: "WIN-CASH-12",
    order: 12,
    originalFilename: "01-WINDOWS-CASHIER/12-shift-and-central-sync.png",
    image: "assets/screenshots/01-WINDOWS-CASHIER/12-shift-and-central-sync.png",
    platform: "Windows Host Web",
    category: "01-WINDOWS-CASHIER",
    module: "Shift & Central Sync",
    workflow: "Host-to-Central Pairing",
    role: "Admin / Manager (Maria Santos)",
    state: "Active Shift + Pairing Form Populated",
    capturesStatus: "CAPTURED",
    priority: "P1",
    title: "Shift Status & Central Host Pairing Form",
    sandboxRoute: "win-cashier?tab=shift-sync",
    testCaseIds: ["M03", "M04", "F09"],
    observed: "Left sidebar highlights 'Shift & Central Sync'. Top card 'Drawer & Physical Count' shows 'Active Shift 76b59a13' and espresso button 'Blind Shift Close'. Lower card 'Central Pairing & Synchronization' displays inputs for 'Approved Central HTTPS Origin' (lab loopback https://127.0.0.1:5445), 'Central Tenant ID', 'Central Store ID', 'Independent Server Signing Public Key' (ephemeral lab SPKI), 'One-Time Central Join Code' (expired disposable lab code CTQ4-9RJV), 'Request Windows Device Enrollment' button, 'Current operator password for Central' field, and disabled 'Connect and synchronize Windows operations' button. Top-right retains two earlier red receipt/reprint failure toasts.",
    purpose: "Provides station-level shift close access and allows an administrator to pair the Windows Store Host with the independent Central Sync server using an out-of-band HTTPS origin, pinned SPKI key, and one-time join code.",
    expected: "Must enforce HTTPS-only Central origin, require independent SPKI public key pinning, keep 'Connect and synchronize' disabled until enrolled and operator password is supplied, never store plaintext operator passwords, and separate device enrollment from operator login.",
    expectedEvidence: "apps/cafe-web/src/cashier/WorkstationApp.tsx; ADR-I4 & ADR-I6 device trust",
    controlContracts: [
      { num: 1, x: 19, y: 25, label: "Blind Shift Close", target: "Primary action button", expectedOutcome: "Opens Blind Shift Close modal for Active Shift 76b59a13.", failureOutcome: "Hidden/replaced by Open Shift when no shift is open.", rolePermission: "Shift.OpenClose", evidenceScope: "Confirmed in DLG-02" },
      { num: 2, x: 22, y: 49, label: "Request Windows Device Enrollment", target: "Enrollment submit button", expectedOutcome: "Submits asymmetric public key + one-time join code to Central for admin approval.", failureOutcome: "Rejects invalid/expired join code or untrusted HTTP origin.", rolePermission: "Devices.Manage", evidenceScope: "Appearance confirmed; enrollment endpoint verified via lab harness" },
      { num: 3, x: 66, y: 57, label: "Connect and synchronize Windows operations", target: "Sync trigger (disabled until ready)", expectedOutcome: "Authenticates device + operator and pushes/pulls canonical sync batches.", failureOutcome: "Stays disabled until enrollment + operator password exist.", rolePermission: "Sync.Execute", evidenceScope: "Disabled guard appearance confirmed" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Open 'Shift & Central Sync' from the left navigation rail.",
      "Verify the active shift ID matches the open shift and 'Blind Shift Close' is accessible.",
      "Confirm 'Connect and synchronize Windows operations' stays disabled when operator password is blank."
    ],
    limitations: "Displayed origin, IDs, SPKI, and join code are synthetic/disposable lab fixtures from a destroyed CaptureServer instance."
  },
  {
    id: "WIN-CASH-13",
    order: 13,
    originalFilename: "01-WINDOWS-CASHIER/13-blind-shift-close-variance.png",
    image: "assets/screenshots/01-WINDOWS-CASHIER/13-blind-shift-close-variance.png",
    platform: "Windows Host Web",
    category: "01-WINDOWS-CASHIER",
    module: "Cashier Workstation",
    workflow: "Blind Shift Close",
    role: "Admin / Manager (Maria Santos)",
    state: "Variance Result Revealed Post-Close",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Blind Shift Close — Server Variance Result",
    sandboxRoute: "win-cashier?modal=blind-close-result",
    testCaseIds: ["F10"],
    observed: "Modal 'Blind Shift Close' over dimmed workstation (whose header badge has already transitioned to tan 'Shift Closed / Unopened' with text 'Blind shift close committed.'). Inside the modal: 'Enter your physical drawer cash count. Expected totals are revealed only after server close.', amber callout box 'Shift Variance Computed by Server — Counted ₱1,650.00 vs Expected ₱2,035.00', bold line 'Variance: -₱385.00', and 'Close' button.",
    purpose: "Reveals the server-authoritative drawer variance ONLY after the cashier commits their physical count, preventing cashiers from adjusting their count to match an on-screen expected figure.",
    expected: "Expected cash must remain hidden prior to submit (confirmed in DLG-02), transition shift state to closed on Host SQLite, compute exact integer-cent variance (Counted - Expected = -₱385.00), flag non-zero variances for manager review, and replace 'Blind Shift Close' header button with 'Open Shift'.",
    expectedEvidence: "apps/cafe-web/src/cashier/WorkstationApp.tsx; AGENTS.md blind shift close invariant",
    controlContracts: [
      { num: 1, x: 50, y: 52, label: "Server Variance Summary", target: "Post-close alert box", expectedOutcome: "Displays Counted, Expected, and exact signed Variance after server commit.", failureOutcome: "Must never appear before server close succeeds.", rolePermission: "Shift.OpenClose", evidenceScope: "Live Host variance calculation confirmed" },
      { num: 2, x: 60, y: 63, label: "Close", target: "Dismiss modal button", expectedOutcome: "Closes dialog and leaves workstation cleanly in 'Shift Closed / Unopened' state.", failureOutcome: "Does not re-submit shift close.", rolePermission: "Shift.OpenClose", evidenceScope: "Confirmed on live Host" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Submit a physical counted cash amount in Blind Shift Close (see DLG-02).",
      "Verify expected cash and exact variance appear ONLY after submission.",
      "Click 'Close' and confirm the top badge changes from 'Shift Open' to 'Shift Closed / Unopened'."
    ],
    limitations: "Confirms UI reveal and exact arithmetic on Host; cross-device shift conflict requires a second approved device (H01)."
  },

  // === 02-ORDERS-KITCHEN (5) ===
  {
    id: "WIN-ORD-01",
    order: 14,
    originalFilename: "02-ORDERS-KITCHEN/01-orders-board-lifecycle.png",
    image: "assets/screenshots/02-ORDERS-KITCHEN/01-orders-board-lifecycle.png",
    platform: "Windows Host Web",
    category: "02-ORDERS-KITCHEN",
    module: "Orders & Lifecycle Board",
    workflow: "Order Management",
    role: "Admin / Manager (Maria Santos)",
    state: "All Channels & Lifecycle States Populated",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Orders & Lifecycle Board (All Channels & States)",
    sandboxRoute: "win-orders",
    testCaseIds: ["F02"],
    observed: "Left sidebar highlights 'Orders & Lifecycle' (badge 36). Card 'Cafe Orders & Lifecycle' displays channel filter pills ('All Channels' active, 'Dine-In', 'Takeout') on the left and status pills ('ALL' active, 'Open', 'Parked', 'Submitted', 'Preparing', 'Ready', 'Completed') on the right, plus 'Host SQLite Live' badge. Table lists Ticket/Ref, Service Mode, Updated time, color-coded State pills ('Cancelled', 'Parked', 'Submitted', 'Ready', 'Open', 'Completed'), and state-appropriate row actions ('Open', 'Resume', 'Send to Prep', 'Park', 'Cancel', 'Reprint').",
    purpose: "Central order-tracking table allowing counter staff and shift leads to monitor every ticket across Dine-In and Takeout, resume parked drafts, push open orders to prep, cancel with audit reason, or reprint completed sales.",
    expected: "Must only expose valid state-transition buttons per row (e.g., Parked -> Resume/Cancel; Open -> Send to Prep/Park/Cancel; Completed -> Open/Reprint; Cancelled -> Open read-only), support fast channel + state filtering, and reflect live Host SQLite revisions.",
    expectedEvidence: "apps/cafe-web/src/orders/OrdersBoard.tsx; Issue #11 orders lifecycle",
    controlContracts: [
      { num: 1, x: 22, y: 25, label: "Channel Filter Pills", target: "All Channels / Dine-In / Takeout", expectedOutcome: "Filters order rows by service mode.", failureOutcome: "Zero matching orders displays empty table message.", rolePermission: "Orders.View", evidenceScope: "Appearance & filtering confirmed" },
      { num: 2, x: 83, y: 25, label: "State Filter Pills", target: "ALL / Open / Parked / Submitted / Preparing / Ready / Completed", expectedOutcome: "Narrows table to chosen lifecycle state.", failureOutcome: "Confirmed for Parked (WIN-ORD-02) and Completed (WIN-ORD-03).", rolePermission: "Orders.View", evidenceScope: "Confirmed across WIN-ORD-02 & WIN-ORD-03" },
      { num: 3, x: 66, y: 42, label: "Contextual Row Actions", target: "Open / Resume / Send to Prep / Park / Cancel / Reprint", expectedOutcome: "Executes valid transition or opens ticket in Cashier pane.", failureOutcome: "Invalid transitions are omitted from row actions.", rolePermission: "Orders.View / Orders.Modify", evidenceScope: "Confirmed on live Host" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Navigate to 'Orders & Lifecycle' from the left sidebar.",
      "Verify each order status shows only valid action buttons (for example, Completed orders show Open and Reprint, not Cancel).",
      "Toggle Dine-In / Takeout and state pills to confirm filtering accuracy."
    ],
    limitations: "Confirms desktop 1920x1080 table rendering; tablet responsive behavior is captured separately in RESP-04."
  },
  {
    id: "WIN-ORD-02",
    order: 15,
    originalFilename: "02-ORDERS-KITCHEN/02-order-parked-resume.png",
    image: "assets/screenshots/02-ORDERS-KITCHEN/02-order-parked-resume.png",
    platform: "Windows Host Web",
    category: "02-ORDERS-KITCHEN",
    module: "Orders & Lifecycle Board",
    workflow: "Park & Resume Order",
    role: "Admin / Manager (Maria Santos)",
    state: "Filtered to Parked Orders",
    capturesStatus: "CAPTURED",
    priority: "P1",
    title: "Parked Order Filter & Resume Action",
    sandboxRoute: "win-orders?state=Parked",
    testCaseIds: ["F02"],
    observed: "Orders & Lifecycle table with the 'Parked' status filter active, isolating parked Takeout order 'Buzzer #12' with amber 'Parked' status badge and action buttons 'Open', 'Resume', and red 'Cancel'.",
    purpose: "Lets cashiers set aside an incomplete customer order (e.g., customer stepped away to decide) so the counter stays moving, then resume it cleanly later.",
    expected: "Filtering by 'Parked' must show only parked tickets; clicking 'Resume' must return the order to 'Open' state on the Host and reload its exact lines into Cashier without duplicating items; clicking 'Cancel' must require a cancellation reason modal (DLG-04).",
    expectedEvidence: "apps/cafe-web/src/orders/OrdersBoard.tsx; Cafe Yza C4 Park/Resume",
    controlContracts: [
      { num: 1, x: 77, y: 25, label: "Parked Filter Pill", target: "Status filter button", expectedOutcome: "Isolates Parked tickets only.", failureOutcome: "Shows empty state if no tickets are parked.", rolePermission: "Orders.View", evidenceScope: "Confirmed on live Host" },
      { num: 2, x: 66, y: 36, label: "Resume Button", target: "Row action button", expectedOutcome: "Transitions Parked order back to Open and restores draft in Cashier.", failureOutcome: "Version conflict prompts refresh rather than silent overwrite.", rolePermission: "Orders.Modify", evidenceScope: "Confirmed on live Host" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Park an Open order from Cashier or Orders Board.",
      "Click the 'Parked' filter pill and verify the order appears.",
      "Click 'Resume' and confirm it transitions back to Open with all items intact."
    ],
    limitations: "Static screenshot confirms filtered state and action controls."
  },
  {
    id: "WIN-ORD-03",
    order: 16,
    originalFilename: "02-ORDERS-KITCHEN/03-orders-reprint-completed.png",
    image: "assets/screenshots/02-ORDERS-KITCHEN/03-orders-reprint-completed.png",
    platform: "Windows Host Web",
    category: "02-ORDERS-KITCHEN",
    module: "Orders & Lifecycle Board",
    workflow: "Completed Orders & Reprint",
    role: "Admin / Manager (Maria Santos)",
    state: "Filtered to Completed Orders",
    capturesStatus: "CAPTURED",
    priority: "P1",
    title: "Completed Orders & Receipt Reprint Action",
    sandboxRoute: "win-orders?state=Completed",
    testCaseIds: ["F02", "H02"],
    observed: "Orders & Lifecycle table filtered to 'Completed', listing completed Dine-In and Takeout orders ('Buzzer #12', 'Walk-In #08', 'Table 04') with muted 'Completed' badges and only 'Open' and 'Reprint' buttons available per row.",
    purpose: "Provides quick historical lookup of finished tickets and audited receipt reprinting when a customer requests a duplicate copy.",
    expected: "Completed orders must be immutable (no Cancel/Park/Send to Prep buttons). Clicking 'Reprint' should queue a Reprint copy job with audit trail; note that at 3d23ef4b, Reprint hits the same 'Sale has no persisted receipt snapshot.' backend defect documented in WIN-CASH-11.",
    expectedEvidence: "apps/cafe-web/src/orders/OrdersBoard.tsx; Cafe Yza C7 Print Reprint",
    controlContracts: [
      { num: 1, x: 95, y: 25, label: "Completed Filter Pill", target: "Status filter button", expectedOutcome: "Shows only completed sales.", failureOutcome: "Empty state if none completed.", rolePermission: "Orders.View", evidenceScope: "Confirmed on live Host" },
      { num: 2, x: 66, y: 36, label: "Reprint Button", target: "Row action button", expectedOutcome: "Queues audited customer receipt reprint.", failureOutcome: "At 3d23ef4b surfaces 'Reprint failed: Sale has no persisted receipt snapshot.' (see WIN-CASH-12 toast).", rolePermission: "Print.Reprint", evidenceScope: "Appearance & runtime error confirmed" }
    ],
    discrepancies: [
      "Clicking 'Reprint' on completed Cafe orders triggers 'Reprint failed: Sale has no persisted receipt snapshot.' at 3d23ef4b (same root defect as WIN-CASH-11)."
    ],
    issues: [
      {
        id: "BUG-3D23-REPRINT-SNAPSHOT",
        severity: "High",
        kind: "Runtime Finding (Dev-Salryn-Cafe @ 3d23ef4b)",
        summary: "Reprint on /cafe/orders fails with 'Sale has no persisted receipt snapshot.'",
        repro: "Open /cafe/orders, filter to Completed, click 'Reprint' on a completed Cafe order."
      }
    ],
    testSteps: [
      "Filter Orders & Lifecycle to 'Completed'.",
      "Confirm editing/cancellation buttons are absent on completed orders.",
      "Click 'Reprint' and document whether a reprint job queues or reports the missing receipt snapshot error."
    ],
    limitations: "Does not verify physical thermal printer output (HUMAN_REQUIRED)."
  },
  {
    id: "WIN-KDS-01",
    order: 17,
    originalFilename: "02-ORDERS-KITCHEN/04-kitchen-display-queue.png",
    image: "assets/screenshots/02-ORDERS-KITCHEN/04-kitchen-display-queue.png",
    platform: "Windows Host Web",
    category: "02-ORDERS-KITCHEN",
    module: "Kitchen & Barista Display",
    workflow: "Barista Queue Monitoring",
    role: "Admin / Manager (Maria Santos)",
    state: "Active Submitted & Ready Tickets",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Kitchen & Barista Queue (Submitted Tickets)",
    sandboxRoute: "win-kitchen",
    testCaseIds: ["F02"],
    observed: "Left sidebar highlights 'Kitchen & Barista' (badge 3). Header displays 'Kitchen & Barista Ticket Queue', 'Host SQLite Live' green badge, and 'Kitchen Printer: Barista Kitchen KDS Printer' blue pill. Filter chips show 'All Active Tickets' (active), 'Submitted', 'Preparing', and 'Ready'. Card grid displays ticket cards for 'Buzzer #12' (Submitted, showing 'Loading preparation lines...'), 'Walk-In #08' (Submitted: 1× Ceremonial Matcha Latte, 1× Ensaymada Brioche), 'Table 04' (Submitted: 2× Spanish Latte Hot 12oz, Extra Espresso Shot · Barista Oat Milk, 'Note: Less ice, light condensed'), and several Ready takeout cards. Submitted cards show 'Print Kitchen Ticket' and copper 'Start Prep' buttons.",
    purpose: "Dedicated barista and kitchen preparation board displaying incoming drinks, modifiers, and customer notes without exposing cash or pricing distractions.",
    expected: "Must display every submitted ticket with complete variant, modifier, and barista note details, show elapsed/submission time, hide cash/price controls, and allow one-tap 'Start Prep' -> 'Mark Ready' progression.",
    expectedEvidence: "apps/cafe-web/src/kitchen/KitchenDisplay.tsx; Issue #11 KDS workflow",
    controlContracts: [
      { num: 1, x: 25, y: 25, label: "Queue Status Filters", target: "All Active / Submitted / Preparing / Ready", expectedOutcome: "Filters visible KDS cards by preparation stage.", failureOutcome: "Shows empty queue message when stage has 0 tickets.", rolePermission: "Kitchen.View", evidenceScope: "Appearance confirmed" },
      { num: 2, x: 61, y: 59, label: "Start Prep", target: "Copper primary ticket button", expectedOutcome: "Transitions ticket from Submitted to Preparing (see WIN-KDS-02).", failureOutcome: "Reports version conflict if updated elsewhere.", rolePermission: "Kitchen.Update", evidenceScope: "Live transition confirmed in WIN-KDS-02" },
      { num: 3, x: 54, y: 59, label: "Print Kitchen Ticket", target: "Secondary ticket button", expectedOutcome: "Sends kitchen chit to configured Barista Kitchen KDS Printer.", failureOutcome: "At 3d23ef4b fails due to missing client operationId (see WIN-KDS-02).", rolePermission: "Print.Kitchen", evidenceScope: "Failure captured in WIN-KDS-02" }
    ],
    discrepancies: [
      "Card 'Buzzer #12' briefly showed 'Loading preparation lines...' while hydrating line details asynchronously (resolved in WIN-KDS-02)."
    ],
    issues: [],
    testSteps: [
      "Submit a customized Dine-In order with modifiers and a barista note from Cashier.",
      "Open 'Kitchen & Barista' and confirm the modifiers and barista note render legibly on the ticket card.",
      "Click 'Start Prep' and verify the card advances to 'Preparing'."
    ],
    limitations: "Desktop 1920x1080 capture; mobile KDS layout is captured in RESP-05."
  },
  {
    id: "WIN-KDS-02",
    order: 18,
    originalFilename: "02-ORDERS-KITCHEN/05-kitchen-prep-and-ticket-print.png",
    image: "assets/screenshots/02-ORDERS-KITCHEN/05-kitchen-prep-and-ticket-print.png",
    platform: "Windows Host Web",
    category: "02-ORDERS-KITCHEN",
    module: "Kitchen & Barista Display",
    workflow: "Preparation & Kitchen Print",
    role: "Admin / Manager (Maria Santos)",
    state: "Preparing Tickets + Kitchen Print Error (Reported Defect)",
    capturesStatus: "DEFECT_OBSERVED",
    priority: "P0",
    title: "Kitchen Preparation Controls & Kitchen Ticket Print Defect",
    sandboxRoute: "win-kitchen?preset=error",
    testCaseIds: ["H02"],
    observed: "Kitchen & Barista queue after advancing 'Table 04', 'Walk-In #08', and 'Buzzer #12' into 'Preparing' state (tan cup badge 'Preparing', dark espresso 'Mark Ready' button). All preparation lines are hydrated ('1× Yza Signature Cold Brew' now visible on Buzzer #12). In the top-right, clicking 'Print Kitchen Ticket' surfaced red error toast: 'Kitchen ticket failed — A valid client-supplied operationId (or Idempotency-Key header) is required.'.",
    purpose: "Allows baristas to mark beverages as Preparing/Ready and optionally print physical kitchen chits for the espresso or pastry station.",
    expected: "Advancing to Preparing/Ready must persist cleanly (PASS). Clicking 'Print Kitchen Ticket' must send a valid client-supplied operationId / Idempotency-Key to the Host print attempt endpoint so kitchen tickets spool without 400 validation errors.",
    expectedEvidence: "apps/cafe-web/src/kitchen/KitchenDisplay.tsx & runtime error observed at 3d23ef4b",
    controlContracts: [
      { num: 1, x: 26, y: 64, label: "Mark Ready", target: "Espresso button on Preparing card", expectedOutcome: "Marks ticket Ready so Cashier can complete payment.", failureOutcome: "Blocked if order was cancelled concurrently.", rolePermission: "Kitchen.Update", evidenceScope: "Confirmed on live Host" },
      { num: 2, x: 25, y: 58, label: "Print Kitchen Ticket", target: "Secondary button", expectedOutcome: "Queues & executes kitchen chit with durable operationId.", failureOutcome: "Observed defect at 3d23ef4b: server rejects missing operationId/Idempotency-Key.", rolePermission: "Print.Kitchen", evidenceScope: "Live runtime defect captured verbatim" },
      { num: 3, x: 88, y: 6, label: "Kitchen Ticket Failed Toast", target: "Error notification", expectedOutcome: "Clearly reports print failure rather than falsely claiming print succeeded.", failureOutcome: "Indicates frontend print client bug on 3d23ef4b.", rolePermission: "Visible to operator", evidenceScope: "Exact error message captured" }
    ],
    discrepancies: [
      "DEFECT (Runtime Finding at 3d23ef4b): 'Print Kitchen Ticket' sends a request missing a valid client-supplied operationId / Idempotency-Key header, causing Host rejection."
    ],
    issues: [
      {
        id: "BUG-3D23-KITCHEN-OPID",
        severity: "High",
        kind: "Runtime Finding (Dev-Salryn-Cafe @ 3d23ef4b)",
        summary: "Print Kitchen Ticket fails with 'A valid client-supplied operationId (or Idempotency-Key header) is required.'",
        repro: "1. Open /cafe/kitchen with any Submitted or Preparing ticket. 2. Click 'Print Kitchen Ticket'. 3. Observe red failure toast."
      }
    ],
    testSteps: [
      "Advance a submitted ticket to Preparing and confirm its button updates to 'Mark Ready'.",
      "Click 'Print Kitchen Ticket' and record whether the job queues cleanly or fails with the reported operationId error."
    ],
    limitations: "Confirms KDS prep transitions work while kitchen print fails at the HTTP API contract layer before hardware printing."
  },

  // === 03-BACKOFFICE (9) ===
  {
    id: "WIN-BO-00",
    order: 19,
    originalFilename: "03-BACKOFFICE/00-backoffice-host-sign-in.png",
    image: "assets/screenshots/03-BACKOFFICE/00-backoffice-host-sign-in.png",
    platform: "Windows Host Web",
    category: "03-BACKOFFICE",
    module: "Back-Office Console",
    workflow: "Back-Office Authentication",
    role: "Unauthenticated Operator",
    state: "Back-Office Sign-In Gate",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Windows Back-Office — Operator Sign In",
    sandboxRoute: "win-backoffice?role=signed-out",
    testCaseIds: ["W05"],
    observed: "Clean centered sign-in card for the Salryn Cafe Back-Office console (/cafe/backoffice) with Username, masked Password, and dark espresso Sign in button, keeping all financial reports, inventory, user management, and backup controls hidden prior to authentication.",
    purpose: "Protects sensitive management reports, inventory adjustments, refunds, user provisioning, and SQLite backup/restore actions behind operator authentication.",
    expected: "Must block unauthenticated rendering of any back-office module, reject invalid credentials clearly, and verify manager/admin RBAC permissions upon sign-in.",
    expectedEvidence: "apps/cafe-web/src/backoffice/BackofficeConsoleApp.tsx; Issue #12",
    controlContracts: [
      { num: 1, x: 50, y: 53, label: "Username & Password", target: "Auth form inputs", expectedOutcome: "Authenticates Host operator for Back-Office session.", failureOutcome: "Rejects invalid credentials or unauthorized roles.", rolePermission: "Public / Unauthenticated", evidenceScope: "Confirmed on live Host" },
      { num: 2, x: 50, y: 67, label: "Sign in", target: "Submit button", expectedOutcome: "Opens Area A (Owner Reports & COGS) upon success.", failureOutcome: "Displays error alert and keeps console locked.", rolePermission: "Public / Unauthenticated", evidenceScope: "Confirmed on live Host" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Navigate directly to /cafe/backoffice while signed out.",
      "Confirm no financial metrics or admin menus are visible.",
      "Sign in with an authorized manager/admin QA account."
    ],
    limitations: "Confirms unauthenticated Back-Office gate appearance."
  },
  {
    id: "WIN-BO-A",
    order: 20,
    originalFilename: "03-BACKOFFICE/01-area-a-owner-reports-cogs.png",
    image: "assets/screenshots/03-BACKOFFICE/01-area-a-owner-reports-cogs.png",
    platform: "Windows Host Web",
    category: "03-BACKOFFICE",
    module: "Back-Office Area A",
    workflow: "Owner Reports & COGS",
    role: "Admin / Manager (Maria Santos)",
    state: "Live Operational KPIs Loaded",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Back-Office Area A — Owner Reports, Margins & COGS",
    sandboxRoute: "win-backoffice?area=area-a",
    testCaseIds: ["F10"],
    observed: "Espresso top bar ('Local Windows Host Back-Office (127.0.0.1:5399 / LAN HTTPS 5400)'), 'Host Live SQLite' pill, operator 'Maria Santos (Manager) · Admin'. Subheader badges: 'Surface: Windows Host Console' and amber disclaimer 'Owner Reports are store operational reports only. Not an official/BIR/RMO report.', plus 'POS Workstation', 'Refresh Live Data', 'Central Owner Portal', and 'Windows Host Console' switches. Four KPI cards show Daily Sales '₱11,570.00 (39 completed orders · Avg ₱296.66)', Monthly Net Revenue '₱10,670.00 (Historical COGS ₱577.20)', Operational Contribution '₱9,058.12 (Expenses ₱840.00 · Waste ₱194.68)', and Outstanding AR '₱4,165.00 (Collections ₱175.00)'. Lower card 'Cost Coverage & Recipe BOM Margin' states 'Cost state: Incomplete (26/39 complete)' with 'No records found'.",
    purpose: "Gives cafe owners and managers an honest operational snapshot of daily sales, net revenue, recipe COGS, waste, expenses, and outstanding AR without masquerading as an official BIR tax report.",
    expected: "Must display the explicit non-BIR/RMO operational disclaimer, accurately roll up completed sales/expenses/waste/AR from SQLite, honestly label incomplete cost coverage when some historical items lack BOM cost links, and allow jumping directly back to POS Workstation.",
    expectedEvidence: "apps/cafe-web/src/backoffice/BackofficeConsoleApp.tsx; Cafe Yza C11 COGS/Profitability",
    controlContracts: [
      { num: 1, x: 40, y: 10, label: "Non-BIR Operational Disclaimer", target: "Status badge", expectedOutcome: "Clearly communicates store operational scope (never an official BIR/RMO filing).", failureOutcome: "Must remain visible on reports view.", rolePermission: "Reports.View", evidenceScope: "Observed verbatim" },
      { num: 2, x: 68, y: 10, label: "POS Workstation", target: "Navigation button", expectedOutcome: "Returns to /cafe/ Cashier workstation.", failureOutcome: "Preserves authenticated session.", rolePermission: "Authenticated Operator", evidenceScope: "Appearance confirmed" },
      { num: 3, x: 50, y: 19, label: "KPI Summary Cards (4x)", target: "Read-only financial metrics", expectedOutcome: "Reflects real completed orders, COGS, waste, expenses, and AR.", failureOutcome: "Displays honest empty/zero state when store has no sales.", rolePermission: "Reports.View", evidenceScope: "Live SQLite figures observed" }
    ],
    discrepancies: [
      "'Cost Coverage & Recipe BOM Margin' header reports '26/39 complete' while the table below displays 'No records found'—worth checking during field QA whether item-level margin rows are expected here."
    ],
    issues: [],
    testSteps: [
      "Open Back-Office -> 'Owner Reports & COGS'.",
      "Verify the non-BIR operational report disclaimer is prominently displayed.",
      "Compare Daily Sales and Outstanding AR totals against completed QA sales and AR collections."
    ],
    limitations: "Confirms report aggregation rendering on synthetic lab data; tax/accounting compliance is explicitly out of scope per banner."
  },
  {
    id: "WIN-BO-B",
    order: 21,
    originalFilename: "03-BACKOFFICE/02-area-b-device-trust-central.png",
    image: "assets/screenshots/03-BACKOFFICE/02-area-b-device-trust-central.png",
    platform: "Windows Host Web",
    category: "03-BACKOFFICE",
    module: "Back-Office Area B",
    workflow: "Device Trust & Central",
    role: "Admin + Central Owner",
    state: "LAN Off + Central Live Connected",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Back-Office Area B — Device Trust, LAN Pairing & Central Devices",
    sandboxRoute: "win-backoffice?area=area-b",
    testCaseIds: ["M03", "M04"],
    observed: "Blue info banner 'Device Trust vs. Peripheral Separation (ADR-I4)' clarifying that local LAN Thin Terminals (HTTPS 5400) and synced Central device trust are separate from Bluetooth printers. First card 'Windows Host LAN Thin-Client Pairing (HTTPS 5400)' shows 'Transport: Disabled · Remote POS: Off · Not enabled', 'Active LAN Join Code: None active', and 'Rotate LAN Join Code'. Second card 'Central Server Connection & Admin Sign-In' shows green 'Central Salryn.Cafe · Epoch 1', server URL input, 'Check Central Health & Refresh', 'Signed in as Cafe Yza Owner (Owner)', and 'Sign Out of Central'. Third card 'Central Device Enrollment, Approval & Trust' displays 'Central Live', role dropdown ('Offline Android Cashier'), 'Issue Join Code', and device table showing 'Pop-Up Cart Tablet (Fenced)' (Revoked) and 'Patio Barista Kiosk' (Active, with red 'Revoke' button).",
    purpose: "Unified host-side control plane for rotating local LAN thin-client join codes (port 5400 HTTPS) and managing Central device approvals/revocations while enforcing ADR-I4 peripheral isolation.",
    expected: "Must honestly show LAN Transport Disabled when HTTPS 5400 is not active (R3A rule), never mix Bluetooth printer pairing with terminal trust keys, allow issuing time-limited join codes, and require confirmation before revoking an active device.",
    expectedEvidence: "apps/cafe-web/src/devices/DeviceManagementPanel.tsx; ADR-I4 & R3A LAN truth",
    controlContracts: [
      { num: 1, x: 93, y: 25, label: "Rotate LAN Join Code", target: "LAN pairing button", expectedOutcome: "Generates fresh time-limited join code for LAN HTTPS 5400 clients.", failureOutcome: "Honest warning when Remote POS HTTPS transport is disabled.", rolePermission: "Devices.Manage", evidenceScope: "Appearance & disabled transport status confirmed" },
      { num: 2, x: 76, y: 78, label: "Issue Join Code", target: "Central invite button", expectedOutcome: "Creates one-time Central enrollment code for chosen device role.", failureOutcome: "Requires Central Admin sign-in.", rolePermission: "Central Owner", evidenceScope: "Confirmed in CEN-02" },
      { num: 3, x: 88, y: 95, label: "Revoke", target: "Destructive red button", expectedOutcome: "Opens confirmation modal before revoking & fencing device (DLG-07).", failureOutcome: "Already-revoked devices do not show active Revoke button.", rolePermission: "Central Owner", evidenceScope: "Confirmed in DLG-07" }
    ],
    discrepancies: [
      "The 'Central HTTPS Server URL' input displays default placeholder/value 'http://127.0.0.1:5499' even while connected to Central Epoch 1 over lab HTTPS 5445—worth verifying URL persistence UX."
    ],
    issues: [],
    testSteps: [
      "Open Back-Office -> 'Device Trust & Central'.",
      "Verify LAN transport status accurately reflects whether HTTPS 5400 is enabled.",
      "Sign into Central Owner Authority, issue a join code, and inspect enrolled devices."
    ],
    limitations: "Uses synthetic lab devices and ephemeral local Central instance; physical LAN/TLS testing requires real QA devices (M03/M04)."
  },
  {
    id: "WIN-BO-C",
    order: 22,
    originalFilename: "03-BACKOFFICE/03-area-c-menu-recipes-bom.png",
    image: "assets/screenshots/03-BACKOFFICE/03-area-c-menu-recipes-bom.png",
    platform: "Windows Host Web",
    category: "03-BACKOFFICE",
    module: "Back-Office Area C",
    workflow: "Menu, Ingredients & Recipe BOM",
    role: "Admin / Manager (Maria Santos)",
    state: "Draft Snapshot Loaded + Publish Error (Reported Defect)",
    capturesStatus: "DEFECT_OBSERVED",
    priority: "P0",
    title: "Back-Office Area C — Menu, Ingredients, Recipe BOM & Publish Defect",
    sandboxRoute: "win-backoffice?area=area-c&preset=error",
    testCaseIds: ["W06"],
    observed: "Card 'Menu, Ingredients & Recipe BOM' with top-right espresso button 'Publish Menu & Recipes'. Above the card sits a red error banner: 'Publish Failed — A valid client-supplied operationId (or Idempotency-Key header) is required.'. Ingredients table lists Barista Oat Milk (99300 Milliliter, reorder 12000), Brioche Dough Ball (12987 Piece, reorder 24), Bukidnon Arabica Beans (12532 Gram, reorder 250), and three C4 test ingredients. Recipe table lists 'Ensaymada Brioche Unit' (Yield 1, 1 BOM line, Active) and 'Spanish Latte Standard' (Yield 1, 1 BOM line, Active).",
    purpose: "Lets store managers inspect ingredient stock units, reorder thresholds, and recipe bills-of-materials (BOM), then publish menu/recipe snapshots to Cashier and Kitchen stations.",
    expected: "Must display current ingredients, units, on-hand quantities, reorder thresholds, and active recipes accurately. Clicking 'Publish Menu & Recipes' must attach a valid client-supplied operationId / Idempotency-Key header and succeed cleanly rather than failing with a missing-operationId error.",
    expectedEvidence: "apps/cafe-web/src/backoffice/BackofficeConsoleApp.tsx; Cafe Yza C1/C2",
    controlContracts: [
      { num: 1, x: 93, y: 25, label: "Publish Menu & Recipes", target: "Primary espresso button", expectedOutcome: "Publishes new menu & recipe snapshot version to stations.", failureOutcome: "Observed defect at 3d23ef4b: fails with 'A valid client-supplied operationId (or Idempotency-Key header) is required.'", rolePermission: "Catalog.Publish", evidenceScope: "Live runtime defect captured" },
      { num: 2, x: 50, y: 17, label: "Publish Failed Alert", target: "Inline error banner", expectedOutcome: "Surfaces API validation rejection transparently.", failureOutcome: "Blocks publishing draft recipe changes from Back-Office UI at 3d23ef4b.", rolePermission: "Admin / Manager", evidenceScope: "Exact error message captured" }
    ],
    discrepancies: [
      "DEFECT (Runtime Finding at 3d23ef4b): Clicking 'Publish Menu & Recipes' triggers 'Publish Failed — A valid client-supplied operationId (or Idempotency-Key header) is required.'"
    ],
    issues: [
      {
        id: "BUG-3D23-PUBLISH-OPID",
        severity: "High",
        kind: "Runtime Finding (Dev-Salryn-Cafe @ 3d23ef4b)",
        summary: "Back-Office 'Publish Menu & Recipes' fails due to missing client-supplied operationId / Idempotency-Key.",
        repro: "1. Open /cafe/backoffice -> 'Menu, Recipes & BOM'. 2. Click 'Publish Menu & Recipes'. 3. Observe red 'Publish Failed' banner."
      }
    ],
    testSteps: [
      "Open 'Menu, Recipes & BOM' and confirm ingredients and recipe BOM rows match seeded catalog.",
      "Click 'Publish Menu & Recipes' and verify whether publication succeeds or reproduces the missing operationId error."
    ],
    limitations: "Confirms Area C read tables and publish failure at 3d23ef4b."
  },
  {
    id: "WIN-BO-D",
    order: 23,
    originalFilename: "03-BACKOFFICE/04-area-d-inventory-waste.png",
    image: "assets/screenshots/03-BACKOFFICE/04-area-d-inventory-waste.png",
    platform: "Windows Host Web",
    category: "03-BACKOFFICE",
    module: "Back-Office Area D",
    workflow: "Supplier Purchases & Waste",
    role: "Admin / Manager (Maria Santos)",
    state: "Purchase & Waste Posted",
    capturesStatus: "CAPTURED",
    priority: "P1",
    title: "Back-Office Area D — Supplier Purchases, Waste & Low-Stock Alerts",
    sandboxRoute: "win-backoffice?area=area-d",
    testCaseIds: ["F10"],
    observed: "Three stacked cards: (1) 'Receive Supplier Purchase' with Supplier ('Bukidnon Highland Roasters'), Ingredient ('Barista Oat Milk (Milliliter)'), Quantity ('5000'), Line Cost PHP ('1850.00'); (2) 'Record Inventory Waste / Spoilage' with Ingredient ('Barista Oat Milk'), Waste Quantity ('100'), Waste Reason ('Spoilage'), Notes, and 'Record Waste' button; (3) 'Low-Stock Alerts' showing empty-healthy state 'Stock levels healthy — No tracked ingredients or products are currently below reorder threshold.'. Green toasts confirm 'Purchase received — Cost ₱1,850.00 recorded in stock ledger.' and 'Waste recorded — Spoilage posted to stock ledger.'.",
    purpose: "Records inbound supplier stock deliveries (updating weighted-average cost without touching the POS cash drawer) and audited waste/spoilage deductions while flagging ingredients below reorder levels.",
    expected: "Receiving a purchase must increase on-hand stock and update weighted-average ingredient cost while keeping POS cash drawer untouched (supplier AP separation); recording waste must require an approved reason and append a negative stock ledger entry; low-stock alerts must appear whenever stock <= reorder threshold.",
    expectedEvidence: "apps/cafe-web/src/backoffice/BackofficeConsoleApp.tsx; Cafe Yza C3 Inventory/Waste",
    controlContracts: [
      { num: 1, x: 50, y: 27, label: "Receive Supplier Purchase Form", target: "Supplier/Ingredient/Qty/Cost form", expectedOutcome: "Posts purchase receipt to stock ledger and confirms cost toast.", failureOutcome: "Rejects zero/negative quantities or costs.", rolePermission: "Inventory.Receive", evidenceScope: "Live purchase commit confirmed via green toast" },
      { num: 2, x: 90, y: 46, label: "Record Waste", target: "Submit button", expectedOutcome: "Posts audited negative ledger movement with approved C2 waste reason.", failureOutcome: "Rejects missing reason or invalid quantity.", rolePermission: "Inventory.Adjust", evidenceScope: "Live waste commit confirmed via green toast" },
      { num: 3, x: 50, y: 69, label: "Low-Stock Alerts Card", target: "Alert list", expectedOutcome: "Lists below-threshold items or displays 'Stock levels healthy'.", failureOutcome: "Must not show fake low-stock warnings when stock is sufficient.", rolePermission: "Inventory.View", evidenceScope: "Healthy empty state confirmed" }
    ],
    discrepancies: [
      "Top-right toast stack partially covers the 'Receive Purchase' submit button while four toasts are simultaneously open."
    ],
    issues: [],
    testSteps: [
      "Receive a synthetic supplier delivery and verify the confirmation toast and updated on-hand balance in Area C.",
      "Record a small spoilage waste entry and verify it reflects in Owner Reports waste total."
    ],
    limitations: "Healthy low-stock empty state captured; populated low-stock alert list can be tested interactively in the Sandbox."
  },
  {
    id: "WIN-BO-E",
    order: 24,
    originalFilename: "03-BACKOFFICE/05-area-e-cash-ar-refunds.png",
    image: "assets/screenshots/03-BACKOFFICE/05-area-e-cash-ar-refunds.png",
    platform: "Windows Host Web",
    category: "03-BACKOFFICE",
    module: "Back-Office Area E",
    workflow: "Cash Ledger, AR & C5 Refunds",
    role: "Admin / Manager (Maria Santos)",
    state: "Cash Movements & Committed C5 Refund Visible",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Back-Office Area E — Cash Movements, Customer AR & C5 Audited Refunds",
    sandboxRoute: "win-backoffice?area=area-e",
    testCaseIds: ["F03", "F04", "F10"],
    observed: "Scrolled view of Area E showing (1) Cash Drawer & Operational Expense form ('Operational Expense', '120.00', Reason) above the immutable cash ledger listing SaleCashReceipt (+₱460.00, +₱50.00), ReceivableCashCollection (+₱25.00), OperationalExpense (-₱120.00 'Artisanal ice & paper cups'), and CashRefund (-₱50.00 'Cafe sale refund'); and (2) 'C5 Audited Refunds & Reversals' form (Completed Sale Receipt, Sale Line, Refund Qty, Stock Disposition 'Prepared Drink / No Stock Reversal', Refund Reason, 'Request Refund') above the refunds table showing 'SLRN-2026-000039' in green 'Committed' state for ₱150.00. Green toasts confirm OperationalExpense, Refund requested, Refund approved, and Refund committed.",
    purpose: "Central financial control console for recording petty-cash operational expenses, collecting Customer AR cash payments, and executing two-step manager-approved C5 refunds strictly via Cash and/or AR reversals.",
    expected: "Every cash movement must append immutably (no silent edits/deletes), refunds must enforce Request -> Manager Approval -> Cash/AR Commit with stock disposition choice (Restock / Damaged / ServiceNoStock), and AR collections must only accept approved Cash method.",
    expectedEvidence: "apps/cafe-web/src/backoffice/BackofficeConsoleApp.tsx; Cafe Yza C5 & C6 financial invariants",
    controlContracts: [
      { num: 1, x: 45, y: 18, label: "Cash Movement Ledger Table", target: "Append-only ledger view", expectedOutcome: "Lists signed deltas for Sales, AR Collections, Operational Expenses, and Cash Refunds.", failureOutcome: "No delete or inline-edit controls permitted.", rolePermission: "Cash.Manage", evidenceScope: "Live Host ledger entries confirmed" },
      { num: 2, x: 91, y: 55, label: "Request Refund", target: "C5 step-1 submit button", expectedOutcome: "Creates a Requested refund record awaiting manager approval.", failureOutcome: "Disabled/rejected without valid reason or remaining refundable quantity.", rolePermission: "Refunds.Request", evidenceScope: "Full Request -> Approve -> Commit flow confirmed" },
      { num: 3, x: 35, y: 65, label: "Committed C5 Refund Row", target: "Refund audit row (SLRN-2026-000039)", expectedOutcome: "Shows Committed badge, exact PHP total, and reason; Commit button removed once settled.", failureOutcome: "Cannot double-refund same line quantity.", rolePermission: "Refunds.Commit", evidenceScope: "Confirmed on live Host" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Post a synthetic Operational Expense and verify a negative delta row appears in the cash ledger.",
      "Collect a partial Cash AR payment for a synthetic customer and verify ReceivableCashCollection appears.",
      "Request, approve, and commit a C5 refund (Cash and/or AR) and verify the state transitions cleanly to Committed."
    ],
    limitations: "Screenshot scrolled to Cash Ledger & C5 Refunds; Customer AR summary table above is also included in the Interactive Sandbox."
  },
  {
    id: "WIN-BO-F",
    order: 25,
    originalFilename: "03-BACKOFFICE/06-area-f-bookings-delivery-staff.png",
    image: "assets/screenshots/03-BACKOFFICE/06-area-f-bookings-delivery-staff.png",
    platform: "Windows Host Web",
    category: "03-BACKOFFICE",
    module: "Back-Office Area F",
    workflow: "Bookings, Delivery & Staff",
    role: "Admin / Manager (Maria Santos)",
    state: "Deliveries, Clock-In & Incident Log Active",
    capturesStatus: "CAPTURED",
    priority: "P1",
    title: "Back-Office Area F — Bookings, Deliveries, Attendance & Incidents",
    sandboxRoute: "win-backoffice?area=area-f",
    testCaseIds: ["F10"],
    observed: "Upper scrolled table displays Delivery orders in 'Pending' state with dark espresso 'Dispatch' action buttons. Lower card 'Staff Attendance & Incident Log' includes top-right 'Clock In' and 'Clock Out' buttons, an incident form (Classification 'Operational', Severity 'Medium', Incident Title, Description, 'Log Incident'), and a chronological attendance table showing 'ClockIn' events with Operator ID and timestamps. Green toasts confirm 'Clocked in' and 'Incident logged'.",
    purpose: "Covers Cafe Yza's non-counter store operations: coffee cart/event bookings (C9), delivery dispatch tracking (C8), and operator clock-in/out & handover incident logs (C10).",
    expected: "Must allow advancing deliveries through Pending -> Dispatched -> Delivered/Failed, recording immutable Clock In / Clock Out timestamps per signed-in operator, and logging categorized handover incidents with severity.",
    expectedEvidence: "apps/cafe-web/src/backoffice/BackofficeConsoleApp.tsx; Cafe Yza C8/C9/C10",
    controlContracts: [
      { num: 1, x: 85, y: 26, label: "Dispatch Delivery Button", target: "Row action button", expectedOutcome: "Advances delivery ticket from Pending to Dispatched.", failureOutcome: "Requires valid delivery record.", rolePermission: "Deliveries.Manage", evidenceScope: "Appearance confirmed" },
      { num: 2, x: 93, y: 50, label: "Clock In / Clock Out", target: "Attendance buttons", expectedOutcome: "Appends timestamped operator attendance event.", failureOutcome: "Cannot forge another operator's clock event.", rolePermission: "Attendance.Self", evidenceScope: "Live Clock In confirmed via toast & table" },
      { num: 3, x: 89, y: 60, label: "Log Incident", target: "Incident submit button", expectedOutcome: "Saves handover incident to Host incident journal.", failureOutcome: "Disabled until Title & Description are filled.", rolePermission: "Incidents.Create", evidenceScope: "Live incident log confirmed via toast" }
    ],
    discrepancies: [
      "Top-right toast stack briefly overlaps the upper 'Dispatch' row buttons while notifications remain open."
    ],
    issues: [],
    testSteps: [
      "Open Back-Office -> 'Bookings, Delivery & Staff'.",
      "Click 'Clock In' and verify a new ClockIn event appears with the current timestamp.",
      "Fill Incident Title and Description and click 'Log Incident', then confirm it persists."
    ],
    limitations: "Scrolled view focuses on Deliveries and Attendance/Incidents; Bookings card sits above the fold and is interactive in the Sandbox."
  },
  {
    id: "WIN-BO-G",
    order: 26,
    originalFilename: "03-BACKOFFICE/07-area-g-audit-users-settings.png",
    image: "assets/screenshots/03-BACKOFFICE/07-area-g-audit-users-settings.png",
    platform: "Windows Host Web",
    category: "03-BACKOFFICE",
    module: "Back-Office Area G",
    workflow: "Users, Audit Trail & Store Settings",
    role: "Admin / Manager (Maria Santos)",
    state: "Users & Audit Visible; Store Settings Omitted (404)",
    capturesStatus: "PARTIAL_CAPTURE",
    priority: "P1",
    title: "Back-Office Area G — Operator Accounts, Audit Trail & Missing Store Settings",
    sandboxRoute: "win-backoffice?area=area-g&preset=error",
    testCaseIds: ["W05"],
    observed: "Displays red alert 'Admin Operation Failed — Password is required.' above two cards: (1) 'Operator Accounts & Role Management' with create-user form (Username 'kitchen-lead-9925', Display Name 'Elena Navarro (Barista Lead)', masked Temporary Password, Role 'Admin', 'Create User') and active users table ('barista-cashier · Leo Cruz (Cashier)', 'c4-proof · Maria Santos (Manager)'); (2) 'Immutable Audit Trail' listing AR_COLLECTION_RECORDED, USER_LOGIN, and BACKUP_CREATED entries with actor, reason, and timestamp. Noticeably absent: the Cafe Store & Receipt Settings card does not render at all.",
    purpose: "Lets store administrators provision operator accounts with explicit roles, audit security/financial activity immutably, and configure store receipt header/footer settings.",
    expected: "Must list active operators with roles, enforce strong temporary password validation on creation, preserve an append-only audit trail, AND render the Store & Receipt Settings card backed by GET/PUT /api/settings/store. At 3d23ef4b, GET /api/settings/store returns HTTP 404 NotFound, silently omitting the entire Store Settings card.",
    expectedEvidence: "apps/cafe-web/src/backoffice/BackofficeConsoleApp.tsx (line 1054 settingsDraft guard) + live 404 observed",
    controlContracts: [
      { num: 1, x: 89, y: 35, label: "Create User", target: "Primary form button", expectedOutcome: "Creates new operator account with hashed temporary password and selected role.", failureOutcome: "Validates required fields (shown in 'Password is required.' alert).", rolePermission: "Users.Manage", evidenceScope: "Appearance & validation banner confirmed" },
      { num: 2, x: 50, y: 74, label: "Immutable Audit Trail", target: "Read-only audit table", expectedOutcome: "Shows chronological logins, backups, and financial events without edit/delete controls.", failureOutcome: "Never allows deleting or editing audit rows.", rolePermission: "Audit.View", evidenceScope: "Live Host audit events confirmed" }
    ],
    discrepancies: [
      "DEFECT (Runtime Finding at 3d23ef4b): GET /api/settings/store returns HTTP 404 NotFound on Salryn.Api.Local, leaving settingsDraft === null so the Store & Receipt Settings card silently disappears instead of rendering or displaying an error."
    ],
    issues: [
      {
        id: "BUG-3D23-SETTINGS-404",
        severity: "Medium",
        kind: "Runtime Finding (Dev-Salryn-Cafe @ 3d23ef4b)",
        summary: "GET /api/settings/store returns 404 NotFound, causing Back-Office Area G Store & Receipt Settings card to be omitted.",
        repro: "1. Open /cafe/backoffice -> 'Audit, Users & Settings'. 2. Inspect network tab for GET /api/settings/store (404) and notice no Store Settings card renders."
      }
    ],
    testSteps: [
      "Open Back-Office -> 'Audit, Users & Settings'.",
      "Verify existing QA operators and recent login/backup audit events appear accurately.",
      "Check whether the Cafe Store & Receipt Settings card renders or remains missing due to the reported 404."
    ],
    limitations: "See MISS-WIN-STORE-SETTINGS for the unrendered Store Settings form."
  },
  {
    id: "WIN-BO-H",
    order: 27,
    originalFilename: "03-BACKOFFICE/08-area-h-host-backup-license.png",
    image: "assets/screenshots/03-BACKOFFICE/08-area-h-host-backup-license.png",
    platform: "Windows Host Web",
    category: "03-BACKOFFICE",
    module: "Back-Office Area H",
    workflow: "Host License & SQLite Backup",
    role: "Admin / Manager (Maria Santos)",
    state: "Development License + 5 Verified Backups",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Back-Office Area H — Host License Status & SQLite Backup Archives",
    sandboxRoute: "win-backoffice?area=area-h",
    testCaseIds: ["W07"],
    observed: "Card 1 'Salryn Cafe License Status' ('ProductId = Salryn.Cafe') shows amber 'Development' badge, 'Edition: Trial · Machine Matched: Yes', and honest notice 'Explicit local development licensing mode is active. This is not a production license.'. Card 2 'Host SQLite Backup & Restore' lists 5 verified backup packages (e.g., backup-20261122-082751-466a2e20, 4336.0 KB) with 'Create Verified Backup' button and per-row 'Verify' and red 'Restore' buttons. No raw OS file paths are leaked.",
    purpose: "Gives store managers local-first control over Windows Host license verification and verified SQLite backup creation/restoration strictly on the physical store machine.",
    expected: "Must remain Windows-Host-only (disabled on Central Owner Portal as confirmed in CEN-05), never silently bypass signed licensing in Release builds, verify backup archive integrity before restore, and gate Restore behind explicit uppercase RESTORE confirmation (DLG-06).",
    expectedEvidence: "apps/cafe-web/src/backoffice/BackofficeConsoleApp.tsx; AGENTS.md Release license rule",
    controlContracts: [
      { num: 1, x: 40, y: 25, label: "License Status Panel", target: "Read-only license posture", expectedOutcome: "Clearly discloses Development vs Signed Production license status and ProductId = Salryn.Cafe.", failureOutcome: "Release builds must never allow SALRYN_LICENSE_DEVELOPMENT_MODE.", rolePermission: "Host.Admin", evidenceScope: "Debug lab license disclosure confirmed" },
      { num: 2, x: 93, y: 35, label: "Create Verified Backup", target: "Primary backup action", expectedOutcome: "Creates a consistent SQLite backup package and logs BACKUP_CREATED in Audit Trail.", failureOutcome: "Reports disk/permission errors without corrupting live DB.", rolePermission: "Backup.Manage", evidenceScope: "Confirmed (5 real backups created + audited in WIN-BO-G)" },
      { num: 3, x: 84, y: 48, label: "Verify / Restore Row Actions", target: "Package integrity & restore buttons", expectedOutcome: "Verify checks archive integrity; Restore opens uppercase RESTORE guard modal (DLG-06).", failureOutcome: "Never restores without explicit confirmation.", rolePermission: "Backup.Manage", evidenceScope: "Modal confirmed in DLG-06" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Open Back-Office -> 'Host Backup & License' on the Windows Host.",
      "Click 'Create Verified Backup' and verify a new timestamped archive appears in the table.",
      "Click 'Restore' on a backup and confirm an explicit RESTORE confirmation modal appears before anything changes."
    ],
    limitations: "Captured under explicit DEBUG lab license flag; Release signed-license activation must be verified on a Release Windows build."
  },

  // === 04-CENTRAL-OWNER (5, with CEN-03 explicitly documented as duplicate of CEN-02) ===
  {
    id: "CEN-01",
    order: 28,
    originalFilename: "04-CENTRAL-OWNER/01-central-owner-sign-in.png",
    image: "assets/screenshots/04-CENTRAL-OWNER/01-central-owner-sign-in.png",
    platform: "Central Owner Web",
    category: "04-CENTRAL-OWNER",
    module: "Central Owner Portal",
    workflow: "Central Admin Sign-In",
    role: "Unauthenticated Central Owner",
    state: "Disconnected Central Sign-In Screen",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Central Owner Portal — Disconnected / Admin Sign-In Screen",
    sandboxRoute: "central?role=signed-out",
    testCaseIds: ["M04"],
    observed: "Espresso header branded 'Salryn Cafe — Central Owner & Admin Portal (Independent HTTPS Origin)', blue pill 'Surface: Central Owner Portal', ADR-I4 peripheral separation info banner, and 'Central Server Connection & Admin Sign-In' form with Central HTTPS Server URL, Central Admin Username, masked Password, and Sign In button — operating completely independently of any Windows local host session.",
    purpose: "Entry point for owners and store administrators managing cross-device enrollment, approvals, revocations, and quarantined offline records directly against the Central Sync server over HTTPS.",
    expected: "Must require explicit Central Owner authentication over HTTPS without depending on local Windows localhost sessions, reject invalid credentials cleanly, and display clear connection/health feedback.",
    expectedEvidence: "apps/cafe-web/src/api/centralOwnerClient.ts; Issue #13 Central portal",
    controlContracts: [
      { num: 1, x: 40, y: 35, label: "Central HTTPS Server URL", target: "URL input", expectedOutcome: "Targets configured Central Sync HTTPS endpoint.", failureOutcome: "Rejects unreachable or non-Salryn.Cafe servers.", rolePermission: "Central Owner", evidenceScope: "Appearance confirmed" },
      { num: 2, x: 45, y: 55, label: "Central Admin Credentials & Sign In", target: "Login form", expectedOutcome: "Acquires short-lived Central Admin bearer token in memory and loads device roster.", failureOutcome: "Shows 401 rejection on invalid credentials.", rolePermission: "Central Owner", evidenceScope: "Live login confirmed in CEN-02" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Open /cafe/central without signing into the Windows Host.",
      "Enter the authorized Central QA HTTPS URL and Central Owner credentials.",
      "Verify the header clearly reads 'Surface: Central Owner Portal'."
    ],
    limitations: "Captured against disposable local HTTPS Central lab server."
  },
  {
    id: "CEN-02",
    order: 29,
    originalFilename: "04-CENTRAL-OWNER/02-central-devices-and-quarantine.png",
    image: "assets/screenshots/04-CENTRAL-OWNER/02-central-devices-and-quarantine.png",
    platform: "Central Owner Web",
    category: "04-CENTRAL-OWNER",
    module: "Central Owner Portal",
    workflow: "Device Roster & Join Codes",
    role: "Central Owner (Cafe Yza Owner)",
    state: "Connected Epoch 1 + Active Join Code Issued",
    capturesStatus: "CAPTURED",
    priority: "P0",
    title: "Central Owner Portal — Connected Devices & Active Join Code",
    sandboxRoute: "central",
    testCaseIds: ["M04"],
    observed: "Signed in as 'Cafe Yza Owner (Owner) · Store 40000000' with green badges 'Central Salryn.Cafe · Epoch 1' and 'Central Live'. Displays issued one-time invite banner 'Active Join Code: RL89-3T28 · Role: OfflineAndroidCashier · Expires: 4:40:57 PM' (synthetic destroyed lab code) and device table listing 'Pop-Up Cart Tablet (Fenced)' (OfflineAndroidCashier, Revoked, Last Seen 11/22/2026), 'Patio Barista Kiosk' (OfflineAndroidCashier, Active, red Revoke button), and 'Counter LAN Terminal 01' (LanThinTerminal, Active, red Revoke button). Footer note confirms Bluetooth printers never share terminal trust keys.",
    purpose: "Gives store owners authoritative visibility over every paired terminal/tablet, lets them mint short-lived one-time join codes per device role, and enables immediate online revocation & outbox fencing.",
    expected: "Must display accurate trust status (Pending / Active / Revoked), show expiry times for one-time join codes, require confirmation before revoking an active device (DLG-07), and show quarantined offline operations below the roster when present.",
    expectedEvidence: "apps/cafe-web/src/devices/DeviceManagementPanel.tsx; ADR-I4 & Issue #13",
    controlContracts: [
      { num: 1, x: 76, y: 60, label: "Issue Join Code", target: "Espresso invite button", expectedOutcome: "Mints a single-use expiring join code bound to the selected device role.", failureOutcome: "Requires active Central Owner token.", rolePermission: "Central Owner", evidenceScope: "Live code issuance confirmed" },
      { num: 2, x: 88, y: 86, label: "Revoke Device", target: "Red row action button", expectedOutcome: "Opens Revoke confirmation modal (DLG-07) to revoke credentials and fence offline replay.", failureOutcome: "Absent on already-Revoked devices.", rolePermission: "Central Owner", evidenceScope: "Confirmed in DLG-07" }
    ],
    discrepancies: [
      "Central HTTPS Server URL input still displays 'http://127.0.0.1:5499' despite active connection to lab HTTPS Central Epoch 1."
    ],
    issues: [],
    testSteps: [
      "Sign into Central Owner Portal and select role 'Offline Android Cashier'.",
      "Click 'Issue Join Code' and verify a time-limited code banner appears.",
      "Verify Revoked devices cannot be revoked again and Active devices display the red 'Revoke' button."
    ],
    limitations: "Displayed join code RL89-3T28 is an expired synthetic value from a destroyed local CaptureServer."
  },
  {
    id: "CEN-03",
    order: 30,
    originalFilename: "04-CENTRAL-OWNER/03-central-device-approved-and-quarantine-reviewed.png",
    image: "assets/screenshots/04-CENTRAL-OWNER/02-central-devices-and-quarantine.png",
    duplicateOf: "CEN-02",
    platform: "Central Owner Web",
    category: "04-CENTRAL-OWNER",
    module: "Central Owner Portal",
    workflow: "Device Approval & Quarantine Review",
    role: "Central Owner (Cafe Yza Owner)",
    state: "Byte-Identical Duplicate of CEN-02 (Documented)",
    capturesStatus: "DUPLICATE_OF_CEN_02",
    priority: "P1",
    title: "Central Owner Portal — Post-Approval & Quarantine Capture (Exact Duplicate of CEN-02)",
    sandboxRoute: "central?tab=quarantine",
    testCaseIds: ["M04"],
    observed: "Byte-for-byte identical image to CEN-02 (SHA-256 e8056f4a4dfa8f0cc63eb0df8d2fbd39ba36e77fadec09422153ca66f9be6d70, 144,453 bytes). Shows 'Patio Barista Kiosk' already in 'Active' state because it had been approved earlier during the Back-Office Area B run, and the quarantined record panel sits below the fold / already reconciled, so no distinct DOM change occurred between CEN-02 and CEN-03.",
    purpose: "Intended to document the visual transition from Pending -> Active approval and the Quarantine Queue disposition confirmation on /cafe/central.",
    expected: "A distinct capture should show a Pending device before approval and the Quarantine Queue disposition row after review. Deduplicated deliberately in assets/screenshots/ to avoid storing duplicate binary bytes while preserving 1:1 capture ID accounting.",
    expectedEvidence: "Phase 0 SHA-256 audit of SALRYN-CAFE-FULL-SCREENSHOT-HANDOFF",
    controlContracts: [
      { num: 1, x: 58, y: 86, label: "Patio Barista Kiosk (Already Active)", target: "Device status badge", expectedOutcome: "Shows Active after approval.", failureOutcome: "Pending -> Active transition itself was not captured separately in CEN-03.", rolePermission: "Central Owner", evidenceScope: "Deduplicated binary identical to CEN-02; interactive approval & quarantine testable in Sandbox" }
    ],
    discrepancies: [
      "CAPTURE DUPLICATE: Exact SHA-256 match with CEN-02. Both IDs preserved 1:1 per Phase 0 deduplication policy; full Pending -> Approve and Quarantine disposition workflow is interactively demonstrable in the Sandbox."
    ],
    issues: [],
    testSteps: [
      "Note this capture duplicated CEN-02 during automated capture.",
      "Use the Interactive Sandbox (Central Owner Portal) to test Pending device approval and Quarantine queue review, then verify on a live QA build (M04)."
    ],
    limitations: "Duplicate static screenshot; does not independently prove Quarantine UI mutation visually."
  },
  {
    id: "CEN-04",
    order: 31,
    originalFilename: "04-CENTRAL-OWNER/04-central-reports-surface-boundary.png",
    image: "assets/screenshots/04-CENTRAL-OWNER/04-central-reports-surface-boundary.png",
    platform: "Central Owner Web",
    category: "04-CENTRAL-OWNER",
    module: "Central Owner Portal",
    workflow: "Surface Isolation Boundary",
    role: "Central Owner (Cafe Yza Owner)",
    state: "Empty Host-Bound Reports Boundary",
    capturesStatus: "BOUNDARY_VERIFIED",
    priority: "P1",
    title: "Central Owner Portal — Host-Bound Owner Reports Boundary",
    sandboxRoute: "central?area=area-a",
    testCaseIds: ["W04"],
    observed: "Central Owner Portal with 'Owner Reports & COGS' selected in the left sidebar. Instead of fabricating or mocking store-local SQLite reports, the main card displays an honest empty state: 'No owner report loaded — Sign in to Windows Host or connect to Central Owner Portal to view reports.'. Top badge reads 'Surface: Central Owner Portal'.",
    purpose: "Enforces strict honesty between hosted Central control-plane data and store-local Windows Host SQLite reporting so owners never mistake missing local data for ₱0.00 sales.",
    expected: "When viewing Owner Reports on the Central Owner Portal without a local Windows Host connection, the UI must display an explicit empty/boundary notice rather than showing zeroed KPI cards or mocked numbers.",
    expectedEvidence: "apps/cafe-web/src/backoffice/BackofficeConsoleApp.tsx; surface isolation rule",
    controlContracts: [
      { num: 1, x: 56, y: 20, label: "No Owner Report Loaded Card", target: "Empty boundary notice", expectedOutcome: "Clearly informs owner that local Host report data is not loaded on this surface.", failureOutcome: "Must never display fabricated ₱0.00 KPI cards as if the store made zero sales.", rolePermission: "Central Owner", evidenceScope: "Honest boundary confirmed" }
    ],
    discrepancies: [
      "Subtext says 'Sign in to Windows Host or connect to Central Owner Portal to view reports' even while already signed into Central Owner Portal—copy could clarify that store-local COGS reports require the Windows Host console."
    ],
    issues: [],
    testSteps: [
      "While signed into /cafe/central (without Host login), click 'Owner Reports & COGS'.",
      "Verify no fake ₱0.00 KPI cards render and the boundary notice appears cleanly."
    ],
    limitations: "Confirms honest UI boundary on Central surface."
  },
  {
    id: "CEN-05",
    order: 32,
    originalFilename: "04-CENTRAL-OWNER/05-central-host-only-isolated.png",
    image: "assets/screenshots/04-CENTRAL-OWNER/05-central-host-only-isolated.png",
    platform: "Central Owner Web",
    category: "04-CENTRAL-OWNER",
    module: "Central Owner Portal",
    workflow: "Host-Only Isolation",
    role: "Central Owner (Cafe Yza Owner)",
    state: "Windows Host Controls Strictly Disabled",
    capturesStatus: "BOUNDARY_VERIFIED",
    priority: "P0",
    title: "Central Owner Portal — Windows Host Controls Strictly Disabled",
    sandboxRoute: "central?area=area-h",
    testCaseIds: ["W04", "W07"],
    observed: "Central Owner Portal with 'Host Backup & License' selected under 'WINDOWS HOST ONLY' sidebar heading. Main panel reads 'Windows Host Controls Disabled on Central Owner Portal — Strict separation between hosted Central control plane and physical store SQLite host.' with an amber warning box 'Local Windows Host Only: Database backups, cryptographic restore verification, and offline host licensing execute exclusively on the local Windows Host console (http://127.0.0.1:5399/cafe/). Switch to Windows Host View on the physical host machine to run these controls.'. No Backup or Restore buttons are rendered.",
    purpose: "Prevents remote Central browsers from triggering destructive SQLite database restores or tampering with machine-bound offline licenses belonging to the physical store Host.",
    expected: "Must completely omit Create Backup, Verify, Restore, and license controls when running on the Central Owner surface and direct operators to the physical Windows Host machine.",
    expectedEvidence: "apps/cafe-web/src/backoffice/BackofficeConsoleApp.tsx; Issue #3 & #12 host-only boundary",
    controlContracts: [
      { num: 1, x: 56, y: 26, label: "Local Windows Host Only Guard", target: "Amber isolation callout", expectedOutcome: "Blocks all SQLite backup/restore and offline license actions on Central surface.", failureOutcome: "Backup/Restore buttons must NEVER render on /cafe/central.", rolePermission: "Central Owner", evidenceScope: "Strict isolation confirmed" }
    ],
    discrepancies: [],
    issues: [],
    testSteps: [
      "Open /cafe/central and click 'Host Backup & License'.",
      "Verify no Create Backup, Verify, or Restore buttons exist and the Local Windows Host Only explanation is shown."
    ],
    limitations: "Confirms UI isolation; backend endpoint isolation is tested separately in engineering suites."
  }
];

"use strict";
const release=window.SALRYN_QA_RELEASE||{};
const cases=[["A","Prepare","A01","Approved QA release","Receive a release identifier and matching Windows/Android build details from the QA maintainer.","The approved QA build and its source SHA are written down. Do not download arbitrary installers.","A screenshot or note showing the approved release ID."],["A","Prepare","A02","Correct test equipment","Confirm access to a Windows laptop/desktop and an approved Android phone/tablet with enough storage and charge.","Both devices are available, powered and usable.","Windows and Android models, OS versions."],["A","Prepare","A03","Safe synthetic environment","Use only the provided QA store, approved operator accounts, sample products and a test network.","No production data, personal customer records or real payments are involved.","Record the QA store label, not passwords."],["A","Prepare","A04","Installation files verified","Compare both app filenames, matching release IDs and approved file hashes when supplied.","Both packages are the matching approved QA build; otherwise stop.","Release version and hashes/confirmation."],["W","Windows setup","W01","Windows installer starts","Open the official Salryn Cafe Windows installer on the authorized test computer.","Installer starts without security bypasses or unexpected prompts.","Screenshot of installer screen or exact error."],["W","Windows setup","W02","Installation completes","Follow normal setup; accept only the approved Cafe installation destination.","Setup completes without an error and creates Salryn Cafe shortcuts.","Install result and screenshot."],["W","Windows setup","W03","Launches the actual Cafe","Open Salryn Cafe from Start Menu or desktop shortcut.","Cafe application opens with live screens; not a blank page, crash, or mock demonstration.","Screenshot of first screen."],["W","Windows setup","W04","Cafe-only data and isolation","Confirm Cafe opens without changing any separate Retail Salryn app on this test PC.","Cafe works separately; Retail app (if installed) remains unaffected.","Record both app states; no file deletion."],["W","Windows setup","W05","Authorized test login","Sign in with the approved synthetic QA account from the maintainer.","Correct store and operator are shown; wrong credentials are rejected.","Screenshot after login, without passwords."],["W","Windows setup","W06","Menu and pricing","Open the published sample menu, inspect products, prices and variants.","Sample menu is present with expected values and no unexplained duplicates.","Two sample product names and visible prices."],["W","Windows setup","W07","Host restart and persistence","Close and reopen Cafe; inspect previous sample data without resetting anything.","App restarts and previously saved QA records remain.","Screenshot showing records after restart."],["M","Android setup","M01","APK install","Open the approved Android QA APK and complete the system installation prompts.","App installs successfully on the approved Android device.","Device/OS and screenshot of app icon."],["M","Android setup","M02","Native screen opens","Launch Salryn Cafe Android and observe the actual start/sign-in or setup screen.","No immediate crash or unexpected unrelated app appears.","Screenshot of first screen."],["M","Android setup","M03","Approved server connection","Use the exact Central QA server/pairing address provided by the maintainer; do not guess a URL.","The device can reach the intended QA service securely.","Connection status screenshot, never tokens."],["M","Android setup","M04","Device pairing and approval","Follow the provided device enrollment flow and ask an authorized manager to approve this device.","Device approval is confirmed for the intended QA store; unapproved devices cannot transact.","Approved device label; redact secrets/join codes."],["M","Android setup","M05","Operator sign-in and permissions","Sign in with the authorized synthetic operator and try an invalid sign-in.","Authorized operator succeeds; invalid/revoked access is denied.","Observed messages and permission scope."],["M","Android setup","M06","Menu and account matching","Synchronize the menu and compare at least two products and prices with Windows.","Both applications show the same approved menu and relevant sample customer data.","Side-by-side notes/screenshots."],["F","Cashier workflows","F01","Open a fresh shift","As an approved operator, start a new test drawer/shift with the assigned sample opening cash.","A new shift opens with accurate operator and opening amount.","Shift ID or screenshot; sample opening amount."],["F","Cashier workflows","F02","Cash order","Create an order with two sample products and pay entirely in test Cash.","Exactly one completed sale; visible correct total, receipt and balance.","Order ID, expected vs actual total."],["F","Cashier workflows","F03","Accounts Receivable order","Use approved credit permissions and a synthetic customer to perform an AR sale.","Sale is recorded once and the synthetic customer's balance increases correctly.","Sample customer identifier and expected/actual balance."],["F","Cashier workflows","F04","Mixed Cash plus AR","Complete a sale with both synthetic Cash and AR portions.","Cash + AR equals order total; no extra tender amount or duplicate sale.","Order ID, split amounts and balance."],["F","Cashier workflows","F05","Denied credit operator","Try the equivalent AR flow with an account without credit-sale permission.","System refuses the transaction safely; no sale/stock/AR side effects occur.","Error message and absent transaction confirmation."],["F","Cashier workflows","F06","Rejected or interrupted payment","Attempt the maintainer-approved rejection/retry scenario; never make a real financial charge.","A rejected attempt is not presented as paid; safe retry creates only one sale.","Screenshot and exact reproduction steps."],["F","Cashier workflows","F07","Offline Android order","With an already authorized operator and approved open shift, disable connectivity and perform a permitted sample order.","Offline operation is saved or safely refused with a clear message, never silently lost.","Offline indicator, original order/operation ID."],["F","Cashier workflows","F08","Restart while offline","With a pending permitted transaction, fully close and reopen the Android app before reconnecting.","The pending intent is still present and no duplicate charge appears.","Screenshots before/after restart."],["F","Cashier workflows","F09","Reconnect and reconcile","Reconnect approved network and sync the original pending operation; compare with Windows/Central records.","Original operation is acknowledged once, one sale is present and totals match.","Operation ID and both devices' evidence."],["F","Cashier workflows","F10","Shift close and reports","Close the test drawer with counted sample cash and check the relevant reporting totals.","Cash reconciliation and reports match completed QA transactions; unexplained movements are flagged.","Expected/observed shift totals."],["H","Field and hardware","H01","Two-device shift conflict","On a second approved device, try to open another shift for an operator already owning an open drawer.","A conflicting drawer is prevented or safely flagged for reconciliation; no duplicate authoritative drawer.","Device identifiers and observed message."],["H","Field and hardware","H02","Receipt or kitchen print","If a supported thermal printer is available, request sample receipt and kitchen output.","Correct text/amounts appear on paper; errors do not falsely claim printing succeeded.","Photo of synthetic printout with private data removed."],["H","Field and hardware","H03","Network interruption experience","During a permitted QA operation, temporarily disconnect and reconnect the approved QA network.","App explains connection failures and recovers without silent data loss.","Message screenshots and recovery steps."],["H","Field and hardware","H04","Final QA report","Record every case as Pass, Fail, Blocked or Not run; export and hand over the report.","Export contains the release, tester, environment, evidence and unanswered blockers.","Exported report and links to redacted screenshots."]];
const guides={"prepare":{"kicker":"STAGE 01 / READY THE ENVIRONMENT","title":"Everything you need before you start.","lead":"Do this once, before installing any software.","steps":["Ask the QA maintainer for the approved release, test operator and synthetic QA store. Never reuse live credentials.","Prepare a Windows PC and an approved Android phone or tablet. Keep both charged and on the authorized QA network.","Check that both Windows and Android package links show the same release ID. If either link still says 'Not available yet', stop here.","Set aside a notebook or use this site's test-report fields to record what you observe. Take screenshots when a test fails.","Make sure your manager has approved the QA server and device pairing instructions. You should never need developer commands or database editing."],"note":"If you are missing an installer, test account, QA service or permission, mark the relevant test BLOCKED. That is a legitimate test result."},"windows":{"kicker":"STAGE 02 / DESKTOP HOST","title":"Install Salryn Cafe on Windows.","lead":"The Windows machine hosts the main Cafe application. Follow the installer, not the engineering repository.","steps":["Select 'Windows' in the Test Kit when the download is available and authorized. Save the setup file.","Verify the filename and release information provided by the QA maintainer. Do not turn off Windows protection to run it.","Double-click the installer, confirm its publisher/details as instructed, and follow the standard on-screen steps.","Keep the default Cafe installation location unless the QA maintainer explicitly provides another approved path.","Finish setup and open Salryn Cafe from the Start Menu or desktop shortcut.","Follow the supplied QA store setup; use only the authorized synthetic test account and approved license.","Open the menu and verify that example products display. Write down the sample prices for the mobile comparison.","Close and reopen the program once. Confirm it starts correctly and test data persists."],"note":"Do not copy files into Program Files, edit SQLite databases, change services/ports or use administrative PowerShell unless the maintainer specifically assists."},"android":{"kicker":"STAGE 03 / NATIVE MOBILE","title":"Install the Android cashier.","lead":"Use an approved physical Android device. The QA APK is test-signed; production devices are out of scope.","steps":["On the approved tablet/phone, open this portal and download the Android QA APK only when the release link is live.","Confirm the approved Android release matches the Windows release. If the device blocks an unfamiliar install, ask the QA maintainer rather than disabling general security protections.","Use the normal Android installation prompt, open Salryn Cafe and check that its initial screen is readable.","Do not try random server addresses, unofficial QR codes, unknown certificates or generic login credentials.","Follow the maintainer's release-specific pairing guide; enrollment details and approval may differ by build.","After device approval, sign in with the assigned QA operator account and allow the supported first synchronization.","Compare at least two product names, prices and modifier options with Windows.","Take a screenshot of the working Android cashier and mark any missing setup options as BLOCKED, not passed."],"note":"Never enable 'ignore certificate errors', install an unknown certificate, send a pairing code in a public report, or use a production customer account."},"pair":{"kicker":"STAGE 04 / CONNECT BOTH SYSTEMS","title":"Pair, then prove they're talking.","lead":"Pairing involves the approved Central QA service. Installing apps alone does not mean they are connected.","steps":["Verify Windows Salryn Cafe is running in the approved QA environment. Obtain the QA Central service address and pairing instructions from the maintainer.","On Android, open the device enrollment or connection flow documented for this release.","Follow the exact approved QR/code/manual address instructions. Never guess an IP, hostname, join code or security setting.","Have an authorized manager approve the device. Wait for the app to confirm the correct QA store and trust state.","Log in on Android with the assigned test operator and complete initial menu/data synchronization.","Create or inspect a permitted sample transaction, then compare its state on Windows and the designated Central record view.","For offline testing, only disconnect AFTER a valid paired device and operator session exist. Reconnect and check the original transaction once.","If pairing screens are missing or the Central QA service is unavailable, mark M03/M04 BLOCKED and report it—do not work around it."],"note":"Windows Local Host and Central Sync are separate technical components. The QA maintainer must supply a working topology; testers do not have to assemble servers themselves."},"tests":{"kicker":"STAGE 05 / EXECUTE & HAND OFF","title":"Record evidence that engineers can use.","lead":"The checklist below is the source of the QA verdict. You do not need GitHub or programming skills.","steps":["Start at A01 in the checklist and proceed in order. Open each row to see its exact instruction and expected result.","Mark Passed only if you actually performed the test and saw the expected result.","Mark Failed when you performed the test and saw something incorrect; write what happened.","Mark Blocked when you could not start because a package, account, license, approved server or hardware was unavailable.","Mark Not run if you intentionally skipped a case; never treat skipped tests as success.","Fill in your name, device/OS information, QA release ID and general observations.","Choose 'Export complete QA report' or 'Export spreadsheet CSV'. Save the file and share it with the QA maintainer using the approved team channel.","If you find duplicate money, disappearing sales, unsafe user access or wrong-store records, STOP further financial testing and escalate immediately."],"note":"This website does not send results anywhere. Your download is the deliverable. Do not include passwords, tokens, real customer details or raw production databases."}};
const STORE="kirjane.salryn.cafe.qa.v1";
const qs=(s,root=document)=>root.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let data={cases:{},meta:{}};
try{const v=JSON.parse(localStorage.getItem(STORE)||"{}");if(v&&typeof v==="object"){data.cases=v.cases||{};data.meta=v.meta||{}}}catch{}
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(data))}catch{};renderDashboard()};
const set=(id,v)=>{data.meta[id]=v;save()};
const setupRelease=()=>{
 const valid=u=>typeof u==="string"&&/^https:\/\//i.test(u);
 const win=release.windows||{},and=release.android||{};
 [["windowsLink",win],["androidLink",and]].forEach(([id,c])=>{const el=qs("#"+id);if(valid(c.url)){el.href=c.url;el.classList.remove("inactive");el.removeAttribute("aria-disabled");el.textContent="Download verified QA file ↗";el.target="_blank";el.rel="noopener noreferrer"}else{el.onclick=e=>e.preventDefault()}});
 qs("#windowsFile").textContent=(win.filename||"Salryn-Cafe-Setup.exe")+(valid(win.url)?" · Ready":" · Link pending");
 qs("#androidFile").textContent=(and.filename||"Salryn-Cafe-QA.apk")+(valid(and.url)?" · Ready":" · Link pending");
 qs("#releaseName").textContent=release.version||"TO BE ANNOUNCED";
 qs("#releaseSha").textContent=release.sourceSha||"PENDING";
 if(valid(release.pairingGuideUrl)){qs("#pairingGuide").innerHTML='<a href="'+esc(release.pairingGuideUrl)+'" target="_blank" rel="noopener noreferrer">OPEN VERIFIED GUIDE ↗</a>'}
 else qs("#pairingGuide").textContent="AWAITING RELEASE";
 if(valid(win.url)&&valid(and.url)&&release.sourceSha){qs("#releaseStatus").textContent="QA BUILD LINKS AVAILABLE";qs(".notice-band").style.display="none"}
};
const showGuide=id=>{
 const g=guides[id];if(!g)return;
 qs("#guidePanel").innerHTML='<span class="kicker">'+esc(g.kicker)+'</span><h3>'+esc(g.title)+'</h3><p class="lead">'+esc(g.lead)+'</p><ol class="guide-steps">'+g.steps.map((step,i)=>'<li><span>'+String(i+1).padStart(2,"0")+'</span><div>'+esc(step)+'</div></li>').join("")+'</ol><div class="guide-note"><strong>Remember:</strong> '+esc(g.note)+'</div>';
 document.querySelectorAll("[data-guide]").forEach(x=>{const active=x.dataset.guide===id;x.classList.toggle("selected",active);x.setAttribute("aria-pressed",String(active))});
};
let selected="ALL";
const groups=[["A","Before you begin"],["W","Windows installation"],["M","Android & pairing"],["F","Sales & offline recovery"],["H","Hardware & final handoff"]];

function screensForCase(caseCode){
 const manifest=window.SALRYN_SCREENS_MANIFEST||{screens:[]};
 return (manifest.screens||[]).filter(s=>Array.isArray(s.testCaseIds)&&s.testCaseIds.includes(caseCode));
}

function renderDashboard(){
 const dash=qs("#qaDashboard");
 if(!dash)return;
 const cPass=cases.filter(c=>data.cases[c[2]]?.status==="PASS").length;
 const cFail=cases.filter(c=>data.cases[c[2]]?.status==="FAIL").length;
 const cBlocked=cases.filter(c=>data.cases[c[2]]?.status==="BLOCKED").length;
 const cNotRun=cases.length-cPass-cFail-cBlocked;
 const vs=window.SalrynVisualReview?window.SalrynVisualReview.getSummary():{totalCaptured:74,missingCount:6,pass:0,fail:0,blocked:0,notRun:0,unreviewed:74,issues:[],moduleCoverage:[]};
 const visReviewed=vs.pass+vs.fail+vs.blocked;
 const modBars=(vs.moduleCoverage||[]).map(m=>{
  const pct=m.total?Math.round((m.reviewed/m.total)*100):0;
  return '<div class="qa-mod-row"><div style="display:flex;justify-content:space-between"><span>'+esc(m.label)+'</span><strong>'+m.reviewed+' / '+m.total+'</strong></div><div class="qa-mod-track"><div class="qa-mod-fill" style="width:'+pct+'%"></div></div></div>';
 }).join("");
 dash.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><strong style="font-size:13px;letter-spacing:.08em;color:#abdfc4;text-transform:uppercase">Unified QA Coverage Dashboard (On-Device Local State)</strong><span style="font-size:11.5px;color:#b8d5c3">Real-build cases &amp; visual reviews tracked separately · Missing captures shown honestly</span></div>'
  +'<div class="qa-dash-grid">'
  +'<div class="qa-dash-stat"><strong>'+cPass+' / '+cases.length+'</strong><span>31 Cases Passed</span></div>'
  +'<div class="qa-dash-stat"><strong>'+cFail+' / '+cBlocked+'</strong><span>Cases Failed / Blocked</span></div>'
  +'<div class="qa-dash-stat"><strong>'+cNotRun+'</strong><span>Cases Not Run</span></div>'
  +'<div class="qa-dash-stat"><strong>'+visReviewed+' / '+vs.totalCaptured+'</strong><span>Visual Screens Reviewed</span></div>'
  +'<div class="qa-dash-stat"><strong>'+vs.issues.length+'</strong><span>Visual Issues Logged</span></div>'
  +'<div class="qa-dash-stat"><strong>'+vs.missingCount+'</strong><span>Known Missing / Human</span></div>'
  +'</div>'
  +(modBars?'<div class="qa-module-bars">'+modBars+'</div>':'');
}

function render(){
 const openIds=new Set(Array.from(document.querySelectorAll("details.case[open]")).map(el=>el.id));
 const search=qs("#testSearch").value.toLowerCase().trim();
 const html=groups.filter(([id])=>selected==="ALL"||selected===id).map(([id,title])=>{
 const arr=cases.filter(c=>c[0]===id&&(!search||[c[2],c[3],c[4],c[5]].join(" ").toLowerCase().includes(search)));
 if(!arr.length)return"";
 return '<section class="test-group"><div class="test-group-head"><h3>'+esc(title)+'</h3><span>'+arr.length+' CHECKS</span></div>'+arr.map(c=>{
 const state=data.cases[c[2]]||{};const status=state.status||"NOT RUN";
 const related=screensForCase(c[2]);
 const firstSb=related.find(s=>s.sandboxRoute&&s.sandboxRoute!=="qa-portal-info")?.sandboxRoute||"";
 const crossHtml=related.length
  ?'<h4>LINKED REAL SCREENSHOTS &amp; SANDBOX</h4><div class="case-cross-links">'
   +related.slice(0,5).map(s=>'<button type="button" class="case-link-pill" data-open-screen="'+esc(s.id)+'">'+esc(s.id)+' ('+esc(s.capturesStatus)+') ↗</button>').join("")
   +(firstSb?'<button type="button" class="case-link-pill" data-jump-sandbox="'+esc(firstSb)+'">Try in Sandbox ↗</button>':'')
   +'</div>'
  :"";
 return '<details class="case" id="case-'+c[2]+'"'+(openIds.has("case-"+c[2])?" open":"")+'><summary><span class="case-code">'+c[2]+'</span><span class="case-title">'+esc(c[3])+'</span><span class="case-status '+esc(status)+'">'+(status==="PASS"?"PASSED":status==="FAIL"?"FAILED":status==="BLOCKED"?"BLOCKED":"NOT RUN")+'</span><span class="chev">›</span></summary><div class="case-body"><h4>WHAT TO DO</h4><p>'+esc(c[4])+'</p><h4>WHAT SUCCESS LOOKS LIKE</h4><p class="expect">'+esc(c[5])+'</p><h4>WHAT TO RECORD</h4><p>'+esc(c[6])+'</p>'+crossHtml+'<div class="result-row"><label>Test result<select data-case="'+c[2]+'"><option value="NOT RUN" '+(status==="NOT RUN"?"selected":"")+'>Not run</option><option value="PASS" '+(status==="PASS"?"selected":"")+'>Passed</option><option value="FAIL" '+(status==="FAIL"?"selected":"")+'>Failed</option><option value="BLOCKED" '+(status==="BLOCKED"?"selected":"")+'>Blocked</option></select></label><label>Your observation / screenshot filename<textarea data-note="'+c[2]+'" placeholder="What happened? Be specific.">'+esc(state.note||"")+'</textarea></label></div></div></details>';
 }).join("")+'</section>';
 }).join("");
 qs("#caseGroups").innerHTML=html||'<p class="empty-results">No tests match this search. Try another keyword.</p>';
 const done=cases.filter(c=>data.cases[c[2]]?.status&&data.cases[c[2]].status!=="NOT RUN").length;
 qs("#doneCount").textContent=done+" / "+cases.length;
 qs("#progressFill").style.width=(done/cases.length*100)+"%";
 renderDashboard();
}
function initChecklist(){
 const filters=[["ALL","All tests"],...groups.map(x=>[x[0],x[1]])];
 qs("#categoryFilters").innerHTML=filters.map(x=>'<button type="button" data-filter="'+x[0]+'" class="'+(x[0]===selected?"active":"")+'">'+esc(x[1])+'</button>').join("");
 qs("#categoryFilters").addEventListener("click",e=>{const b=e.target.closest("button[data-filter]");if(!b)return;selected=b.dataset.filter;qs("#categoryFilters").querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b));render()});
 qs("#testSearch").addEventListener("input",render);
 qs("#caseGroups").addEventListener("change",e=>{const c=e.target.closest("[data-case]");if(c){data.cases[c.dataset.case]={...(data.cases[c.dataset.case]||{}),status:c.value};save();render()}});
 qs("#caseGroups").addEventListener("input",e=>{const c=e.target.closest("[data-note]");if(c){data.cases[c.dataset.note]={...(data.cases[c.dataset.note]||{}),note:c.value};save()}});
 render()
}
function report(){
 const visualReviews=window.SalrynVisualReview?window.SalrynVisualReview.getAllReviews():{};
 const visualSummary=window.SalrynVisualReview?window.SalrynVisualReview.getSummary():{};
 const manifest=window.SALRYN_SCREENS_MANIFEST||{};
 return {
  reportType:"SALRYN_CAFE_HUMAN_QA",
  schemaVersion:"2.0",
  generatedAtUtc:new Date().toISOString(),
  privacyNotice:"Browser-local export only. No credentials, tokens, or real customer records permitted.",
  release:{version:release.version||"PENDING",sourceSha:release.sourceSha||"PENDING",visualEvidenceSha:manifest.sourceCommitSha||"3d23ef4b9c4bca7b992f9e58d28c61e9e474ad23",windowsFilename:release.windows?.filename||"PENDING",windowsSha256:release.windows?.sha256||"",androidFilename:release.android?.filename||"PENDING",androidSha256:release.android?.sha256||""},
  tester:Object.fromEntries(["qaTester","qaDate","qaWindows","qaAndroid","qaBuild","qaNotes"].map(k=>[k,qs("#"+k)?.value||""])),
  results:cases.map(c=>({code:c[2],category:c[1],test:c[3],status:data.cases[c[2]]?.status||"NOT RUN",observation:data.cases[c[2]]?.note||"",linkedScreenIds:screensForCase(c[2]).map(s=>s.id)})),
  visualReviews,
  visualSummary:{totalCaptured:visualSummary.totalCaptured||74,missingCount:visualSummary.missingCount||6,pass:visualSummary.pass||0,fail:visualSummary.fail||0,blocked:visualSummary.blocked||0,unreviewed:visualSummary.unreviewed||0,issuesCount:(visualSummary.issues||[]).length},
  summary:{passed:cases.filter(c=>data.cases[c[2]]?.status==="PASS").length,failed:cases.filter(c=>data.cases[c[2]]?.status==="FAIL").length,blocked:cases.filter(c=>data.cases[c[2]]?.status==="BLOCKED").length,notRun:cases.filter(c=>!data.cases[c[2]]?.status||data.cases[c[2]]?.status==="NOT RUN").length}
 };
}
function download(name,contents,type){const a=document.createElement("a");const blob=new Blob([contents],{type});const u=URL.createObjectURL(blob);a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
const csvcell=x=>'"'+String(x??"").replace(/"/g,'""')+'"';

function setImportStatus(msg,ok){
 const el=qs("#importStatus");
 if(!el)return;
 el.textContent=msg;
 el.className="import-status show "+(ok?"ok":"err");
}

function validateAndImportJson(rawText){
 if(rawText.length>2*1024*1024){setImportStatus("Import rejected: file exceeds 2 MB safety limit.",false);return false}
 let parsed;
 try{parsed=JSON.parse(rawText)}catch{setImportStatus("Import rejected: invalid JSON syntax.",false);return false}
 if(!parsed||typeof parsed!=="object"||parsed.reportType!=="SALRYN_CAFE_HUMAN_QA"){
  setImportStatus("Import rejected: reportType must be SALRYN_CAFE_HUMAN_QA.",false);return false
 }
 const validCodes=new Set(cases.map(c=>c[2]));
 let importedCases=0;
 if(Array.isArray(parsed.results)){
  for(const row of parsed.results){
   if(!row||typeof row!=="object"||!validCodes.has(row.code))continue;
   const status=["PASS","FAIL","BLOCKED","NOT RUN"].includes(row.status)?row.status:"NOT RUN";
   const note=String(row.observation||"").slice(0,2000);
   if(status!=="NOT RUN"||note){
    data.cases[row.code]={status,note};
    importedCases++;
   }
  }
 }
 if(parsed.tester&&typeof parsed.tester==="object"){
  for(const key of ["qaTester","qaDate","qaWindows","qaAndroid","qaBuild","qaNotes"]){
   if(typeof parsed.tester[key]==="string"&&parsed.tester[key].trim()){
    data.meta[key]=parsed.tester[key].slice(0,1000);
    const el=qs("#"+key);if(el)el.value=data.meta[key];
   }
  }
 }
 save();
 const importedVisual=window.SalrynVisualReview?window.SalrynVisualReview.importReviews(parsed.visualReviews):0;
 render();
 setImportStatus("Imported "+importedCases+" QA case record(s) and "+importedVisual+" visual screen review(s) locally.",true);
 return true;
}

function initReports(){
 for(const key of ["qaTester","qaDate","qaWindows","qaAndroid","qaBuild","qaNotes"]){const el=qs("#"+key);el.value=data.meta[key]||"";el.addEventListener("input",()=>set(key,el.value))}
 if(!qs("#qaDate").value){qs("#qaDate").value=new Date().toISOString().slice(0,10);set("qaDate",qs("#qaDate").value)}
 qs("#exportJson").addEventListener("click",()=>download("Salryn-Cafe-QA-Report-"+new Date().toISOString().slice(0,10)+".json",JSON.stringify(report(),null,2),"application/json"));
 qs("#exportCsv").addEventListener("click",()=>{
  const r=report();
  const header=["RecordType","CodeOrScreenId","Category","Title","Result","Observations","TesterOrReviewer","Date","Build","Source","Windows","Android"];
  const caseRows=r.results.map(x=>["QA_CASE",x.code,x.category,x.test,x.status,x.observation,r.tester.qaTester,r.tester.qaDate,r.tester.qaBuild,"REAL_BUILD",r.tester.qaWindows,r.tester.qaAndroid]);
  const visualRows=[];
  for(const [sid,arr] of Object.entries(r.visualReviews||{})){
   if(!Array.isArray(arr))continue;
   for(const v of arr){
    visualRows.push(["VISUAL_REVIEW",sid,v.category||"None",v.severity||"P2",v.verdict||"NOT RUN",v.notes||"",v.reviewerAlias||"",v.updatedAtUtc||"",r.release.visualEvidenceSha,v.source||"REAL_SCREENSHOT",v.device||"",""]);
   }
  }
  download("Salryn-Cafe-QA-Results.csv",[header,...caseRows,...visualRows].map(row=>row.map(csvcell).join(",")).join("\r\n"),"text/csv;charset=utf-8");
 });
 qs("#importJsonBtn")?.addEventListener("click",()=>qs("#importJsonFile")?.click());
 qs("#importJsonFile")?.addEventListener("change",e=>{
  const file=e.target.files&&e.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>validateAndImportJson(String(reader.result||""));
  reader.onerror=()=>setImportStatus("Import failed: could not read selected file.",false);
  reader.readAsText(file);
  e.target.value="";
 });
 qs("#printReport").addEventListener("click",()=>window.print());
 window.SalrynQaApp={getReport:report,importJsonText:validateAndImportJson};
}
document.addEventListener("DOMContentLoaded",()=>{
 setupRelease();initChecklist();initReports();
 document.querySelectorAll("[data-guide]").forEach(b=>b.addEventListener("click",()=>showGuide(b.dataset.guide)));showGuide("prepare");
 qs("#menuToggle").addEventListener("click",()=>{const n=qs(".nav");n.classList.toggle("open");qs("#menuToggle").setAttribute("aria-expanded",String(n.classList.contains("open")))});
 document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>{qs(".nav").classList.remove("open");qs("#menuToggle").setAttribute("aria-expanded","false")}));
 window.addEventListener("salryn:visual-updated",renderDashboard);
});

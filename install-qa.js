/* Install helper for the standalone, backend-free Kirjane Labs QA application. */
"use strict";
(() => {
  const button = document.getElementById("installQaApp");
  const message = document.getElementById("qaAppInstallState");
  if (!button || !message) return;
  let installPrompt = null;
  const info = value => { message.textContent = value; };
  if (!("serviceWorker" in navigator)) { info("This browser does not support offline installation."); button.disabled = true; return; }
  if (!window.isSecureContext) { info("Installation requires a secure HTTPS address or localhost."); button.disabled = true; return; }
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    button.disabled = false;
    info("Installable on this device; offline screenshots are prepared.");
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    info("QA app installed. Reports remain on this device until exported.");
    button.disabled = true;
  });
  button.addEventListener("click", async () => {
    if (!installPrompt) {
      info("Chrome/Edge: browser menu → Install app. iPhone Safari: Share → Add to Home Screen.");
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    info(choice.outcome === "accepted" ? "Install accepted. Open Salryn QA from Apps." : "Install canceled.");
    installPrompt = null;
  });
  navigator.serviceWorker.addEventListener("message", event => {
    if (event.data?.type === "QA_OFFLINE_STATUS") {
      info(event.data.ready
        ? "Offline ready: " + event.data.cachedScreenshots + " unique screenshots saved on this device."
        : "Offline image cache incomplete: " + (event.data.cachedScreenshots || 0) + "/" + (event.data.totalScreenshots || 73));
    }
  });
  info("Preparing offline QA application…");
  navigator.serviceWorker.register("./offline-worker.js", {scope:"./"})
    .then(async () => {
      await navigator.serviceWorker.ready;
      const worker = navigator.serviceWorker.controller || (await navigator.serviceWorker.getRegistration("./"))?.active;
      if (worker) worker.postMessage({type:"QA_OFFLINE_STATUS"});
      button.disabled = false;
    })
    .catch(err => { info("Offline installation unavailable: " + String(err.message || err)); button.disabled = true; });
})();
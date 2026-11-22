"use strict";
const {app, BrowserWindow, session} = require("electron");
const path = require("node:path");
const {fileURLToPath} = require("node:url");
const root = path.resolve(__dirname, "app");
function allowedLocal(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "blob:" || parsed.protocol === "data:") return true;
    if (parsed.protocol !== "file:") return false;
    const target = path.resolve(fileURLToPath(parsed));
    return target === root || target.startsWith(root + path.sep);
  } catch { return false; }
}
function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 820, minHeight: 580,
    title: "Kirjane Salryn Cafe QA — OFFLINE DEMO ONLY",
    backgroundColor: "#f5f4ee",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });
  win.setMenuBarVisibility(false);
  win.webContents.setWindowOpenHandler(() => ({action:"deny"}));
  win.webContents.on("will-navigate", (event, target) => {
    if (!allowedLocal(target)) event.preventDefault();
  });
  win.loadFile(path.join(root, "index.html"));
}
app.whenReady().then(() => {
  const s = session.defaultSession;
  s.setPermissionRequestHandler((_webContents, _permission, cb) => cb(false));
  s.webRequest.onBeforeRequest((details, cb) => {
    cb({cancel: !allowedLocal(details.url)});
  });
  s.on("will-download", (_event, item) => {
    if (![".json", ".csv"].includes(path.extname(item.getFilename()).toLowerCase())) {
      item.cancel();
    }
  });
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
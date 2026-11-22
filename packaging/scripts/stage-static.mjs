import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {fileURLToPath} from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const destination = path.join(root, "packaging", "app");
const files = [
  "index.html", "styles.css", "portal-modules.css",
  "qa-app.css", "config.js", "app.js", "visual-review.js",
  "sandbox.js", "install-qa.js", "offline-worker.js",
  "manifest.webmanifest"
];
const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/screens.json"), "utf8"));
const actual = manifest.screens.filter(s => s.image);
const unique = [...new Set(actual.map(s => s.image))];
if (actual.length !== 74 || unique.length !== 73 || manifest.screens.length !== 80) {
  throw new Error("QA screenshot inventory drift: expected 74/73/80");
}
for (const item of actual) {
  const filename = path.resolve(root, item.image);
  if (!filename.startsWith(root + path.sep) || !fs.existsSync(filename)) {
    throw new Error("Missing or invalid screenshot path: " + item.image);
  }
  const hash = crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex");
  if (hash !== item.hash) throw new Error("Screenshot hash mismatch: " + item.image);
}
fs.rmSync(destination, {recursive:true, force:true});
fs.mkdirSync(destination, {recursive:true});
for (const file of files) {
  const source = path.join(root, file);
  if (!fs.existsSync(source)) throw new Error("Missing app file: " + file);
  fs.copyFileSync(source, path.join(destination, file));
}
fs.cpSync(path.join(root, "data"), path.join(destination, "data"), {recursive:true});
fs.cpSync(path.join(root, "assets"), path.join(destination, "assets"), {recursive:true});
if (!fs.existsSync(path.join(destination, "assets/screenshots/01-WINDOWS-CASHIER/01-operator-sign-in.png"))) {
  throw new Error("Screenshot copy was incomplete");
}
console.log("OFFLINE QA APPLICATION STAGED: 74 screenshot entries, 73 unique images, 31 case checklist. NO LIVE POS.");

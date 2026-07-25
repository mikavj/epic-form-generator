#!/usr/bin/env node
// Assembles the self-contained form-builder index.html by base64-embedding
// the runtime template and the two QR libraries into the builder shell.
// Run:  node build/build-generator.js   (from the project root)

const fs = require("fs");
const path = require("path");

const dir = __dirname;
const root = path.resolve(dir, "..");

const runtime = fs.readFileSync(path.join(dir, "runtime-template.html"), "utf8");
const qrcode = fs.readFileSync(path.join(dir, "vendor", "qrcode.js"), "utf8");
const jsqr = fs.readFileSync(path.join(dir, "vendor", "jsQR.js"), "utf8"); // header retained in the vendored file
const shell = fs.readFileSync(path.join(dir, "generator-template.html"), "utf8");

// sanity: the runtime must still expose the three placeholders the builder fills in
["/*__QRLIB_JS__*/", "/*__SCHEMA__*/", "/*__PAGE__*/"].forEach(function (p) {
  if (runtime.indexOf(p) === -1) throw new Error("runtime-template.html is missing placeholder " + p);
});

const b64 = s => Buffer.from(s, "utf8").toString("base64");

const out = shell
  .replace("/*__RUNTIME_B64__*/", () => b64(runtime))
  .replace("/*__QRCODE_B64__*/", () => b64(qrcode))
  .replace("/*__JSQR_B64__*/", () => b64(jsqr));

if (/\/\*__(RUNTIME|QRCODE|JSQR)_B64__\*\//.test(out)) throw new Error("A base64 placeholder was not replaced.");

fs.writeFileSync(path.join(root, "index.html"), out);
console.log("index.html (form builder)", (out.length / 1024).toFixed(1) + " KB");
console.log("  embeds runtime", (runtime.length / 1024).toFixed(1) + " KB, qrcode", (qrcode.length / 1024).toFixed(1) + " KB, jsQR", (jsqr.length / 1024).toFixed(1) + " KB");

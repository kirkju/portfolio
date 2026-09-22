// Genera los PDF del CV (ES y EN) a partir de la página imprimible /[lang]/cv/,
// usando Edge o Chrome en modo headless. Sin dependencias extra.
//
// Uso: npm run cv:pdf   (hace el build y luego ejecuta este script)
// Requiere Node 22.18+ (lee src/data/cv.ts directamente) y Edge o Chrome instalado.
// Si el navegador está en otra ruta: CHROME_PATH="/ruta/al/navegador" npm run cv:pdf
import { execFile } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { cv } from "../src/data/cv.ts";
import { createStaticServer } from "./static-server.mjs";

const run = promisify(execFile);

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    // Windows
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    // macOS
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    // Linux
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/microsoft-edge",
  ];
  return candidates.find((candidate) => candidate && existsSync(candidate));
}

if (!existsSync("out/es/cv/index.html")) {
  console.error("No existe out/. Ejecuta `npm run cv:pdf` (incluye el build) en lugar de este script directamente.");
  process.exit(1);
}

const browser = findBrowser();
if (!browser) {
  console.error("No encontré Edge ni Chrome. Define CHROME_PATH con la ruta del navegador.");
  process.exit(1);
}

const server = createStaticServer("out");
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const profileDir = mkdtempSync(path.join(os.tmpdir(), "cv-pdf-"));

try {
  for (const [locale, publicPath] of Object.entries(cv.profile.cvPdf)) {
    const target = path.resolve("public", publicPath.replace(/^\//, ""));
    mkdirSync(path.dirname(target), { recursive: true });

    await run(browser, [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profileDir}`,
      "--no-pdf-header-footer",
      "--virtual-time-budget=10000",
      `--print-to-pdf=${target}`,
      `http://127.0.0.1:${port}/${locale}/cv/`,
    ]);

    if (!existsSync(target) || statSync(target).size === 0) {
      throw new Error(`El navegador no generó ${target}`);
    }

    // Copia también al export para que `npm run preview` sirva el PDF nuevo.
    const exported = path.resolve("out", publicPath.replace(/^\//, ""));
    mkdirSync(path.dirname(exported), { recursive: true });
    copyFileSync(target, exported);

    console.log(`✓ ${locale.toUpperCase()}: public${publicPath} (${Math.round(statSync(target).size / 1024)} KB)`);
  }
} finally {
  server.close();
  rmSync(profileDir, { recursive: true, force: true });
}

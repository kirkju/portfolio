// Servidor estático mínimo para `out/`, sin dependencias. Imita lo que hace IIS
// con public/web.config: `/` → `/es/`, barra final en carpetas, 404.html y gzip.
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { createGzip } from "node:zlib";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".pdf": "application/pdf",
};

const COMPRESSIBLE = new Set([".html", ".js", ".css", ".txt", ".xml", ".json", ".svg"]);

function isFile(file) {
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
}

function isDirectory(file) {
  try {
    return statSync(file).isDirectory();
  } catch {
    return false;
  }
}

export function createStaticServer(rootDir, { defaultPath = "/es/" } = {}) {
  const root = path.resolve(rootDir);

  return createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);

    if (pathname === "/") {
      res.writeHead(302, { Location: defaultPath });
      res.end();
      return;
    }

    let file = path.join(root, pathname);
    if (!file.startsWith(root)) {
      res.writeHead(403);
      res.end();
      return;
    }

    if (isDirectory(file)) {
      if (!pathname.endsWith("/")) {
        res.writeHead(301, { Location: `${pathname}/${url.search}` });
        res.end();
        return;
      }
      file = path.join(file, "index.html");
    }

    let status = 200;
    if (!isFile(file)) {
      status = 404;
      file = path.join(root, "404.html");
    }

    const ext = path.extname(file).toLowerCase();
    const headers = { "Content-Type": TYPES[ext] ?? "application/octet-stream" };
    const gzip = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
    if (gzip) headers["Content-Encoding"] = "gzip";
    if (pathname.startsWith("/_next/static/")) headers["Cache-Control"] = "public, max-age=31536000, immutable";

    res.writeHead(status, headers);
    const stream = createReadStream(file);
    (gzip ? stream.pipe(createGzip()) : stream).pipe(res);
  });
}

import { existsSync } from "node:fs";
import path from "node:path";

/** Indica si un archivo existe en /public. En un export estático se evalúa al hacer el build. */
export function publicFileExists(src: string): boolean {
  return existsSync(path.join(process.cwd(), "public", src));
}

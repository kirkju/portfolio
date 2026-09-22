// Sirve el export estático (`out/`) como lo haría IIS. Uso: npm run build && npm run preview
import { existsSync } from "node:fs";
import { createStaticServer } from "./static-server.mjs";

if (!existsSync("out/es/index.html")) {
  console.error("No existe out/. Ejecuta primero: npm run build");
  process.exit(1);
}

const port = Number(process.env.PORT ?? 4173);
createStaticServer("out").listen(port, () => {
  console.log(`Vista previa del export: http://localhost:${port}/es/  (Ctrl+C para salir)`);
});

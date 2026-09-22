import type { NextConfig } from "next";

// El sitio se publica como export estático (carpeta `out/`) en un App Service
// Windows, donde IIS sirve los archivos. Redirecciones, cabeceras y la página 404
// se configuran en `public/web.config`, porque un export no tiene servidor Node.
const nextConfig: NextConfig = {
  output: "export",
  // Genera `/es/index.html` y enlaces con barra final, que IIS resuelve sin reglas extra.
  trailingSlash: true,
  // Sin servidor no hay optimizador de imágenes: `next/image` sirve los archivos
  // tal cual, así que las capturas deben subirse ya optimizadas (WebP, ~1600 px).
  images: { unoptimized: true },
  experimental: {
    // 404 global: el layout raíz vive en `app/[lang]`, así que no hay un layout
    // único desde el que componer la página de "no encontrado".
    globalNotFound: true,
  },
};

export default nextConfig;

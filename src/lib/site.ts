/**
 * URL pública del sitio, usada en metadatos, Open Graph, sitemap y JSON-LD.
 * Si algún día conectas un dominio propio, cámbialo aquí (o define
 * NEXT_PUBLIC_SITE_URL al hacer el build).
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://aledev-hsd0hhbzf6cvhrax.eastus2-01.azurewebsites.net"
).replace(/\/+$/, "");

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

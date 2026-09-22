import type { Locale } from "@/lib/i18n";

/** Imagen Open Graph / Twitter generada con next/og en `app/[lang]/og.png/route.tsx`. */
export const ogImage = { width: 1200, height: 630, type: "image/png" } as const;

// Con extensión .png para que IIS la sirva con el tipo MIME correcto.
export function ogImagePath(locale: Locale): string {
  return `/${locale}/og.png`;
}

export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

/** Códigos de Open Graph (`og:locale`) por idioma. */
export const ogLocales: Record<Locale, string> = {
  es: "es_LA",
  en: "en_US",
};

/** Ruta de la portada de cada idioma (con barra final, como las genera el export). */
export function localePath(locale: Locale): `/${Locale}/` {
  return `/${locale}/`;
}

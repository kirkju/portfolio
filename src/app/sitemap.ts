import type { MetadataRoute } from "next";
import { localePath, locales } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = Object.fromEntries(locales.map((locale) => [locale, absoluteUrl(localePath(locale))]));

  return locales.map((locale) => ({
    url: absoluteUrl(localePath(locale)),
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "es" ? 1 : 0.9,
    alternates: { languages },
  }));
}

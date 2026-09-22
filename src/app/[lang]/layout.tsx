import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { HideDevOverlay } from "@/components/hide-dev-overlay";
import { cv } from "@/data/cv";
import { ui } from "@/data/ui";
import { fontVariables } from "@/lib/fonts";
import { isLocale, localePath, locales, ogLocales, otherLocale } from "@/lib/i18n";
import { ogImage, ogImagePath } from "@/lib/og";
import { siteUrl } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";

// Solo existen /es y /en; cualquier otro idioma es 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = ui[lang].meta;
  const [firstName, ...lastNames] = cv.profile.name.split(" ");
  const image = { url: ogImagePath(lang), width: ogImage.width, height: ogImage.height, type: ogImage.type, alt: t.ogAlt };

  return {
    metadataBase: new URL(siteUrl),
    title: t.title,
    description: t.description,
    applicationName: cv.profile.name,
    authors: [{ name: cv.profile.name, url: siteUrl }],
    creator: cv.profile.name,
    alternates: {
      canonical: localePath(lang),
      languages: {
        es: localePath("es"),
        en: localePath("en"),
        "x-default": localePath("es"),
      },
    },
    openGraph: {
      type: "profile",
      firstName,
      lastName: lastNames.join(" "),
      locale: ogLocales[lang],
      alternateLocale: ogLocales[otherLocale(lang)],
      url: localePath(lang),
      siteName: cv.profile.name,
      title: t.title,
      description: t.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: [image],
    },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050b18" },
    { media: "(prefers-color-scheme: light)", color: "#f7f9fc" },
  ],
  colorScheme: "dark light",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    // El HTML se genera en oscuro; el script ajusta el tema antes del primer pintado.
    <html lang={lang} data-theme="dark" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HideDevOverlay />
      </head>
      <body className="min-h-svh bg-bg font-sans text-fg antialiased">{children}</body>
    </html>
  );
}

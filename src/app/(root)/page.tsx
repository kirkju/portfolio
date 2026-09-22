import type { Metadata } from "next";
import { defaultLocale, localePath } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Alejandro Vargas",
  robots: { index: false },
  alternates: { canonical: localePath(defaultLocale) },
};

// Respaldo sin JavaScript para servidores sin la regla de web.config (y para `next dev`).
export default function RootPage() {
  const target = localePath(defaultLocale);
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <p style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <a href={target}>Alejandro Vargas — CV</a>
      </p>
    </>
  );
}

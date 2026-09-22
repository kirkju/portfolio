import type { Metadata } from "next";
import "./globals.css";
import { ArrowRightIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button-link";
import { fontVariables } from "@/lib/fonts";
import { localePath } from "@/lib/i18n";
import { themeInitScript } from "@/lib/theme";

export const metadata: Metadata = {
  title: "404 — Alejandro Vargas",
  description: "Página no encontrada · Page not found",
};

// No sabemos en qué idioma llegó el visitante, así que la página es bilingüe.
export default function GlobalNotFound() {
  return (
    <html lang="es" data-theme="dark" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-svh bg-bg font-sans text-fg antialiased">
        <main className="wrapper grid min-h-svh content-center gap-12 py-20">
          <p className="font-mono text-sm tracking-[0.2em] text-accent">404</p>
          <div className="grid gap-12 sm:grid-cols-2">
            <section>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Página no encontrada</h1>
              <p className="mt-4 text-muted">La página que buscas no existe o cambió de dirección.</p>
              <a href={localePath("es")} className={buttonClasses("primary", "md", "mt-8")}>
                Ir al inicio
                <ArrowRightIcon className="size-4" />
              </a>
            </section>
            <section lang="en">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Page not found</h2>
              <p className="mt-4 text-muted">The page you are looking for doesn&apos;t exist or has moved.</p>
              <a href={localePath("en")} className={buttonClasses("secondary", "md", "mt-8")}>
                Go to the homepage
                <ArrowRightIcon className="size-4" />
              </a>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}

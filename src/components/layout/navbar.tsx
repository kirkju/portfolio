import { DownloadIcon } from "@/components/icons";
import { Monogram } from "@/components/monogram";
import { buttonClasses } from "@/components/ui/button-link";
import { cv } from "@/data/cv";
import { ui, type SectionKey } from "@/data/ui";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitch } from "./language-switch";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

const sections: readonly SectionKey[] = [
  "about",
  "experience",
  "projects",
  "publications",
  "skills",
  "education",
  "contact",
];

export function Navbar({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const links = sections.map((key) => ({ href: `#${t.sectionIds[key]}`, label: t.nav[key] }));
  const cvHref = cv.profile.cvPdf[locale];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-bg/70 backdrop-blur-md">
      <div className="wrapper relative flex h-16 items-center justify-between gap-4">
        <a
          href={`#${t.sectionIds.home}`}
          className="group flex shrink-0 items-center gap-2.5 rounded-md font-mono text-sm font-semibold tracking-tight whitespace-nowrap text-heading"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-brand ring-1 ring-white/10 transition-shadow group-hover:ring-accent/60">
            <Monogram className="size-6" />
          </span>
          {/* Entre 1280 y 1535 px la barra muestra todos los enlaces: ahí basta el monograma. */}
          <span className="sr-only sm:not-sr-only xl:sr-only 2xl:not-sr-only">{cv.profile.name}</span>
        </a>

        <nav aria-label={t.nav.label} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm whitespace-nowrap text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitch locale={locale} className="hidden sm:flex" />
          <ThemeToggle labels={t.theme} />
          <a href={cvHref} download className={buttonClasses("primary", "sm", "hidden sm:inline-flex")}>
            <DownloadIcon className="size-4" />
            {t.actions.downloadCv}
          </a>
          <MobileMenu
            links={links}
            labels={{ open: t.nav.openMenu, close: t.nav.closeMenu, navLabel: t.nav.label }}
            footer={
              <>
                <LanguageSwitch locale={locale} className="sm:hidden" />
                <a href={cvHref} download className={buttonClasses("primary", "sm", "sm:hidden")}>
                  <DownloadIcon className="size-4" />
                  {t.actions.downloadCv}
                </a>
              </>
            }
          />
        </div>
      </div>
    </header>
  );
}

import { DownloadIcon } from "@/components/icons";
import { Monogram } from "@/components/monogram";
import { ScrollProgress } from "@/components/motion/deferred";
import { buttonClasses } from "@/components/ui/button-link";
import { cv } from "@/data/cv";
import { ui, type SectionKey } from "@/data/ui";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitch } from "./language-switch";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
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
    // La caja de la barra no cambia de tamaño: al hacer scroll se compacta moviendo solo
    // sus capas con transform (ver "Barra de navegación" en globals.css). Por eso los
    // clics se habilitan en la fila y no en toda la caja.
    <header className="site-header pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Fondo con blur, borde y sombra: capa aparte que aparece y se encoge al hacer scroll. */}
      <span aria-hidden="true" className="header-bg absolute inset-0 border-b border-border/70 bg-bg/85 backdrop-blur-md" />
      <ScrollProgress />
      <div className="header-row wrapper pointer-events-auto relative flex h-16 items-center justify-between gap-4">
        <a
          href={`#${t.sectionIds.home}`}
          className="group flex shrink-0 items-center gap-2.5 rounded-md font-mono text-sm font-semibold tracking-tight whitespace-nowrap text-heading"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-brand ring-1 ring-white/10 transition duration-ui ease-smooth group-hover:ring-accent/60 motion-safe:group-hover:-rotate-6 motion-safe:group-active:scale-90">
            <Monogram className="size-6" />
          </span>
          {/* Entre 1280 y 1535 px la barra muestra todos los enlaces: ahí basta el monograma. */}
          <span className="sr-only sm:not-sr-only xl:sr-only 2xl:not-sr-only">{cv.profile.name}</span>
        </a>

        <NavLinks links={links} label={t.nav.label} />

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitch locale={locale} className="hidden sm:flex" />
          <ThemeToggle labels={t.theme} />
          {/* `max-sm:hidden` y no `hidden sm:inline-flex`: el `inline-flex` del botón le ganaría a `hidden`. */}
          <a href={cvHref} download className={buttonClasses("primary", "sm", "max-sm:hidden")}>
            <DownloadIcon className="nudge-y size-4" />
            {t.actions.downloadCv}
          </a>
          <MobileMenu
            links={links}
            labels={{ open: t.nav.openMenu, close: t.nav.closeMenu, navLabel: t.nav.label }}
            footer={
              <>
                <LanguageSwitch locale={locale} className="sm:hidden" />
                <a href={cvHref} download className={buttonClasses("primary", "sm", "sm:hidden")}>
                  <DownloadIcon className="nudge-y size-4" />
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

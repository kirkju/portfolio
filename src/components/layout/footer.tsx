import { ArrowUpIcon } from "@/components/icons";
import { cv } from "@/data/cv";
import { ui } from "@/data/ui";
import type { Locale } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const t = ui[locale];
  // El sitio es estático: el año corresponde al último build.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="wrapper flex flex-col gap-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {cv.profile.name} · {cv.profile.location[locale]}
        </p>
        <div className="flex items-center gap-6">
          <p>{t.footer.builtWith}</p>
          <a href={`#${t.sectionIds.home}`} className="inline-flex items-center gap-1.5 rounded-md text-fg transition-colors hover:text-accent">
            {t.actions.backToTop}
            <ArrowUpIcon className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

import { locales, localePath, type Locale } from "@/lib/i18n";
import { ui } from "@/data/ui";
import { cn } from "@/lib/utils";

export function LanguageSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const t = ui[locale].language;
  return (
    <nav aria-label={t.groupLabel} className={cn("flex items-center rounded-full border border-border p-0.5", className)}>
      {locales.map((code) => {
        const active = code === locale;
        return (
          <a
            key={code}
            href={localePath(code)}
            hrefLang={code}
            lang={code}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-xs font-medium transition-colors",
              active ? "bg-surface-2 text-heading" : "text-muted hover:text-fg",
            )}
          >
            {code.toUpperCase()}
            <span className="sr-only"> — {t.names[code]}</span>
          </a>
        );
      })}
    </nav>
  );
}

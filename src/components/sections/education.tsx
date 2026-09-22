import { BadgeCheckIcon, GraduationIcon } from "@/components/icons";
import { Section } from "@/components/ui/section";
import { cv } from "@/data/cv";
import { ui } from "@/data/ui";
import type { Locale } from "@/lib/i18n";

export function Education({ locale }: { locale: Locale }) {
  const t = ui[locale];
  return (
    <Section id={t.sectionIds.education} index="06" title={t.education.title}>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="reveal rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <h3 className="flex items-center gap-3 text-base font-semibold tracking-tight">
            <span className="grid size-10 place-items-center rounded-xl border border-border bg-surface-2 text-accent">
              <GraduationIcon className="size-5" />
            </span>
            {t.education.education}
          </h3>
          <ol className="mt-7 space-y-6">
            {cv.education.map((item) => (
              <li key={item.institution} className="border-l border-border pl-5">
                <p className="font-mono text-xs text-accent">{item.period}</p>
                <p className="mt-1.5 text-lg leading-snug font-medium text-heading">{item.degree[locale]}</p>
                <p className="mt-1 text-sm text-muted">{item.institution}</p>
              </li>
            ))}
          </ol>
        </article>

        <article className="reveal rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <h3 className="flex items-center gap-3 text-base font-semibold tracking-tight">
            <span className="grid size-10 place-items-center rounded-xl border border-border bg-surface-2 text-accent">
              <BadgeCheckIcon className="size-5" />
            </span>
            {t.education.certifications}
          </h3>
          <ol className="mt-7 space-y-6">
            {cv.certifications.map((item) => (
              <li key={item.title.en} className="border-l border-border pl-5">
                <p className="font-mono text-xs text-accent">{item.year}</p>
                <p className="mt-1.5 text-lg leading-snug font-medium text-heading">{item.title[locale]}</p>
                {item.detail ? <p className="mt-1 text-sm text-muted">{item.detail[locale]}</p> : null}
              </li>
            ))}
          </ol>
        </article>
      </div>
    </Section>
  );
}

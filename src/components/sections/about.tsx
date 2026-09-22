import type { ReactNode } from "react";
import { Section } from "@/components/ui/section";
import { cv } from "@/data/cv";
import { ui } from "@/data/ui";
import type { Locale } from "@/lib/i18n";

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
      <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase sm:pt-0.5">{label}</dt>
      <dd className="text-sm text-fg">{children}</dd>
    </div>
  );
}

export function About({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const facts = t.about.facts;
  const current = cv.experience.find((job) => !job.end);
  const degree = cv.education[0];

  return (
    <Section id={t.sectionIds.about} index="01" title={t.about.title}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
        <div className="reveal space-y-5 text-lg leading-relaxed text-fg/90">
          {cv.about[locale].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <aside aria-label={facts.label} className="reveal rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-7">
          <dl className="divide-y divide-border">
            <Fact label={facts.location}>{cv.profile.location[locale]}</Fact>
            {current ? (
              <Fact label={facts.current}>
                {current.role[locale]} {t.about.roleAt} {current.company}
              </Fact>
            ) : null}
            <Fact label={facts.focus}>{facts.focusValue}</Fact>
            {degree ? (
              <Fact label={facts.education}>
                {degree.degree[locale]} · {degree.institution} ({degree.period})
              </Fact>
            ) : null}
            <Fact label={facts.research}>
              <a
                href={`#${t.sectionIds.publications}`}
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {facts.researchValue}
              </a>
            </Fact>
            <Fact label={facts.languages}>
              <ul>
                {cv.languages.map((language) => (
                  <li key={language.name.en}>
                    {language.name[locale]}
                    {language.level ? <span className="text-muted"> · {language.level[locale]}</span> : null}
                  </li>
                ))}
              </ul>
            </Fact>
          </dl>
        </aside>
      </div>
    </Section>
  );
}

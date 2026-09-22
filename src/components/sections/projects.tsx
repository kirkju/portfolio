import Image from "next/image";
import { CheckIcon, ExternalLinkIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button-link";
import { Section } from "@/components/ui/section";
import { StatusBadge, TagList } from "@/components/ui/tag";
import { cv } from "@/data/cv";
import type { Project, ProjectStatus } from "@/data/types";
import { ui } from "@/data/ui";
import type { Locale } from "@/lib/i18n";

const statusTone = {
  production: "success",
  active: "success",
  delivered: "accent",
  pilot: "warning",
  development: "muted",
} as const satisfies Record<ProjectStatus, "success" | "accent" | "warning" | "muted">;

const narrative = ["context", "solution", "result"] as const;

function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const t = ui[locale];
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition duration-300 hover:border-accent/50 motion-safe:hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-2">
        <Image
          src={project.image}
          alt={project.imageAlt[locale]}
          fill
          sizes="(min-width: 1152px) 544px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs text-muted">
            {project.client ? `${project.client[locale]} · ` : null}
            {project.year}
          </p>
          {project.status ? (
            <StatusBadge tone={statusTone[project.status]}>{t.projects.status[project.status]}</StatusBadge>
          ) : null}
        </div>

        <h3 className="mt-3 text-xl font-semibold tracking-tight">{project.title[locale]}</h3>

        <dl className="mt-5 space-y-4 text-sm leading-relaxed">
          {narrative.map((key) => (
            <div key={key}>
              <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent uppercase">{t.projects[key]}</dt>
              <dd className="mt-1.5 text-muted">{project[key][locale]}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <h4 className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">{t.projects.features}</h4>
          <ul className="mt-3 grid gap-2 text-sm text-fg sm:grid-cols-2">
            {project.features[locale].map((feature) => (
              <li key={feature} className="flex gap-2">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-col gap-5 pt-7">
          <TagList items={project.stack} label={t.projects.stack} />
          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary", "sm", "self-start")}>
              {t.projects.visit}
              <ExternalLinkIcon className="size-4" />
              <span className="sr-only">{t.actions.newTab}</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function Projects({ locale }: { locale: Locale }) {
  const t = ui[locale];
  return (
    <Section id={t.sectionIds.projects} index="03" title={t.projects.title} lead={t.projects.lead}>
      <ul className="grid gap-6 md:grid-cols-2">
        {cv.projects.map((project) => (
          <li key={project.id} className="reveal flex">
            <ProjectCard project={project} locale={locale} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

import { Fragment } from "react";
import { ChevronDownIcon, ExternalLinkIcon } from "@/components/icons";
import { Section } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/tag";
import { cv } from "@/data/cv";
import type { Publication } from "@/data/types";
import { ui } from "@/data/ui";
import type { Locale } from "@/lib/i18n";
import { byYearDesc } from "@/lib/utils";

function Authors({ authors, label }: { authors: readonly string[]; label: string }) {
  return (
    <p className="mt-3 text-sm text-muted">
      <span className="sr-only">{label}: </span>
      {authors.map((author, index) => (
        <Fragment key={author}>
          {index > 0 ? ", " : null}
          {cv.profile.authorNames.includes(author) ? (
            <strong className="font-semibold text-fg">{author}</strong>
          ) : (
            author
          )}
        </Fragment>
      ))}
    </p>
  );
}

function PublicationCard({ publication: p, locale }: { publication: Publication; locale: Locale }) {
  const t = ui[locale];
  const href = p.doi ? `https://doi.org/${p.doi}` : p.url;

  return (
    <article className="rounded-2xl border border-border bg-bg p-6 shadow-card transition-colors duration-300 hover:border-accent/40 sm:p-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <StatusBadge tone={p.status === "published" ? "success" : "warning"}>
          {t.publications.status[p.status]}
        </StatusBadge>
        <p className="font-mono text-xs text-muted">
          <span className="text-accent">{p.year}</span> · {p.location[locale]}
        </p>
      </div>

      <h3 lang="en" className="mt-4 text-lg leading-snug font-semibold tracking-tight sm:text-xl">
        {p.title}
      </h3>

      {p.authors?.length ? <Authors authors={p.authors} label={t.publications.authors} /> : null}

      {p.venueFull || p.publisher ? (
        <p className="mt-1.5 text-sm text-muted">
          {p.venueFull ? <span lang="en">{p.venueFull}</span> : null}
          {p.venueFull && p.publisher ? " · " : null}
          {p.publisher}
        </p>
      ) : null}

      {p.keywords ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">
          <span className="mr-2 font-mono text-[0.6875rem] tracking-[0.16em] text-fg uppercase">
            {t.publications.keywords}
          </span>
          {p.keywords[locale].join(" · ")}
        </p>
      ) : null}

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-fg shadow-card transition-colors hover:border-accent/60 hover:text-heading"
        >
          {p.doi ? (
            <>
              <span className="font-mono text-xs text-accent">DOI</span>
              <span className="font-mono text-xs break-all">{p.doi}</span>
            </>
          ) : (
            t.publications.link
          )}
          <ExternalLinkIcon className="size-4 shrink-0" />
          <span className="sr-only">{t.actions.newTab}</span>
        </a>
      ) : null}

      {p.abstract ? (
        <details className="group mt-5 rounded-xl border border-border bg-surface/60">
          <summary className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium text-fg transition-colors hover:text-accent">
            {t.publications.abstract}
            <ChevronDownIcon className="size-4 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="border-t border-border px-4 py-4 text-sm leading-relaxed text-muted">
            <p>{p.abstract[locale]}</p>
            {t.publications.abstractNote ? (
              <p className="mt-3 text-xs text-muted/90 italic">{t.publications.abstractNote}</p>
            ) : null}
          </div>
        </details>
      ) : null}
    </article>
  );
}

export function Publications({ locale }: { locale: Locale }) {
  const t = ui[locale];
  return (
    <Section
      id={t.sectionIds.publications}
      index="04"
      title={t.publications.title}
      lead={t.publications.lead}
      className="border-y border-border bg-surface/40"
    >
      <ol className="grid gap-5">
        {byYearDesc(cv.publications).map((publication) => (
          <li key={publication.id} className="reveal">
            <PublicationCard publication={publication} locale={locale} />
          </li>
        ))}
      </ol>

      <div className="reveal mt-14">
        <h3 className="font-mono text-xs tracking-[0.2em] text-muted uppercase">{t.publications.researchAreas}</h3>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {cv.researchAreas.map((area) => (
            <li
              key={area.en}
              className="rounded-full border border-border bg-bg px-4 py-2 text-sm text-fg shadow-card"
            >
              {area[locale]}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

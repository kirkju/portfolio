import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowRightIcon, DownloadIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button-link";
import { cv } from "@/data/cv";
import { ui } from "@/data/ui";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { cn, formatYearMonth, pick } from "@/lib/utils";

// Versión imprimible del CV. `npm run cv:pdf` la convierte en los PDF de /public/cv.

export async function generateMetadata({ params }: PageProps<"/[lang]/cv">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: ui[lang].meta.cvTitle,
    description: ui[lang].meta.cvDescription,
    robots: { index: false, follow: true },
    alternates: { canonical: `${localePath(lang)}cv/` },
  };
}

function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2.5 border-b border-[#dce3ee] pb-1 font-mono text-[7.5pt] font-medium tracking-[0.18em] text-[#0e7490] uppercase">
      {children}
    </h2>
  );
}

function Block({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("break-inside-avoid", className)}>{children}</section>;
}

const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Sheet({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const c = t.cvPage;
  const { profile } = cv;
  const statusLabel = t.projects.status;

  return (
    <article className="mx-auto w-[210mm] bg-white p-[13mm] text-[9pt] leading-[1.45] text-[#0b1b33] shadow-2xl print:w-auto print:p-0 print:shadow-none">
      <header className="rounded-xl bg-[#0b2a5e] px-[8mm] py-[6.5mm] text-white [print-color-adjust:exact]">
        <h1 className="text-[24pt] leading-none font-semibold tracking-tight text-white">{profile.name}</h1>
        <p className="mt-2 text-[11pt] text-[#a5f3fc]">{profile.title[locale]}</p>
        <ul className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1 text-[8pt] text-white/85">
          <li>{profile.location[locale]}</li>
          <li>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>
            <a href={profile.social.github}>{displayUrl(profile.social.github)}</a>
          </li>
          <li>
            <a href={profile.social.linkedin}>{displayUrl(profile.social.linkedin)}</a>
          </li>
        </ul>
      </header>

      <div className="mt-[6mm] grid grid-cols-[minmax(0,1fr)_56mm] gap-[7mm]">
        <div className="space-y-[5mm]">
          <Block>
            <Heading>{c.profile}</Heading>
            <div className="space-y-1.5 text-[#1e2d45]">
              {cv.about[locale].map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Block>

          <section>
            <Heading>{c.experience}</Heading>
            <ol className="space-y-3">
              {cv.experience.map((job) => (
                <li key={`${job.company}-${job.start}`} className="break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-[#0b2a5e]">
                      {job.role[locale]} · <span className="font-normal text-[#0b1b33]">{job.company}</span>
                    </p>
                    <p className="shrink-0 font-mono text-[7.5pt] text-[#4a5b73]">
                      {formatYearMonth(job.start)} — {job.end ? formatYearMonth(job.end) : t.experience.present}
                    </p>
                  </div>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[#1e2d45] marker:text-[#0e7490]">
                    {job.highlights[locale].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <Heading>{c.publications}</Heading>
            <ol className="space-y-2.5">
              {cv.publications.map((p) => (
                <li key={p.id} className="break-inside-avoid">
                  <p lang="en" className="font-medium text-[#0b2a5e]">
                    {p.title}
                  </p>
                  <p className="text-[8pt] text-[#4a5b73]">
                    {[p.venue, p.publisher, p.location[locale], p.year].filter(Boolean).join(" · ")} ·{" "}
                    <span className={p.status === "published" ? "text-[#047857]" : "text-[#b45309]"}>
                      {t.publications.status[p.status]}
                    </span>
                  </p>
                  {p.doi ? (
                    <p className="font-mono text-[7.5pt] text-[#0e7490]">
                      <a href={`https://doi.org/${p.doi}`}>doi.org/{p.doi}</a>
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>

          <section>
            <Heading>{c.projects}</Heading>
            <ol className="space-y-2.5">
              {cv.projects.map((project) => (
                <li key={project.id} className="break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-[#0b2a5e]">{project.title[locale]}</p>
                    <p className="shrink-0 font-mono text-[7.5pt] text-[#4a5b73]">
                      {project.year}
                      {project.status ? ` · ${statusLabel[project.status]}` : ""}
                    </p>
                  </div>
                  <p className="text-[#1e2d45]">{project.solution[locale]}</p>
                  <p className="mt-0.5 font-mono text-[7.5pt] text-[#4a5b73]">{project.stack.join(" · ")}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-[5mm]">
          <Block>
            <Heading>{c.skills}</Heading>
            <div className="space-y-2">
              {cv.skills.map((group) => (
                <div key={group.id}>
                  <p className="font-semibold text-[#0b2a5e]">{group.title[locale]}</p>
                  <p className="text-[#1e2d45]">{group.items.map((item) => pick(item, locale)).join(", ")}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block>
            <Heading>{c.education}</Heading>
            <ol className="space-y-2">
              {cv.education.map((item) => (
                <li key={item.institution}>
                  <p className="font-semibold text-[#0b2a5e]">{item.degree[locale]}</p>
                  <p className="text-[#1e2d45]">{item.institution}</p>
                  <p className="font-mono text-[7.5pt] text-[#4a5b73]">{item.period}</p>
                </li>
              ))}
            </ol>
          </Block>

          <Block>
            <Heading>{c.certifications}</Heading>
            <ol className="space-y-2">
              {cv.certifications.map((item) => (
                <li key={item.title.en}>
                  <p className="font-semibold text-[#0b2a5e]">{item.title[locale]}</p>
                  {item.detail ? <p className="text-[#1e2d45]">{item.detail[locale]}</p> : null}
                  <p className="font-mono text-[7.5pt] text-[#4a5b73]">{item.year}</p>
                </li>
              ))}
            </ol>
          </Block>

          <Block>
            <Heading>{c.languages}</Heading>
            <ul className="space-y-0.5">
              {cv.languages.map((language) => (
                <li key={language.name.en}>
                  {language.name[locale]}
                  {language.level ? <span className="text-[#4a5b73]"> · {language.level[locale]}</span> : null}
                </li>
              ))}
            </ul>
          </Block>

          <Block>
            <Heading>{t.publications.researchAreas}</Heading>
            <p className="text-[#1e2d45]">{cv.researchAreas.map((area) => area[locale]).join(", ")}</p>
          </Block>

          <Block>
            <p className="rounded-lg border border-dashed border-[#c8d2e0] px-3 py-2 text-[8pt] text-[#4a5b73]">
              {cv.references[locale]}
            </p>
          </Block>
        </aside>
      </div>
    </article>
  );
}

export default async function CvPage({ params }: PageProps<"/[lang]/cv">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = ui[lang].cvPage;

  return (
    <main className="min-h-svh py-10 print:py-0">
      <div className="mx-auto mb-6 flex w-[210mm] max-w-full flex-wrap items-center justify-between gap-3 px-4 print:hidden">
        <a href={localePath(lang)} className={buttonClasses("ghost", "sm")}>
          <ArrowRightIcon className="size-4 rotate-180" />
          {t.back}
        </a>
        <a href={cv.profile.cvPdf[lang]} download className={buttonClasses("primary", "sm")}>
          <DownloadIcon className="size-4" />
          {t.download}
        </a>
      </div>
      <div className="overflow-x-auto print:overflow-visible">
        <Sheet locale={lang} />
      </div>
    </main>
  );
}

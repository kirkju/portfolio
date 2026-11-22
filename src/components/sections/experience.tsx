import { TimelineFill } from "@/components/motion/deferred";
import { Reveal, Stagger } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { StatusBadge, TagList } from "@/components/ui/tag";
import { cv } from "@/data/cv";
import type { Experience as Job } from "@/data/types";
import { ui } from "@/data/ui";
import type { Locale } from "@/lib/i18n";
import { cn, formatYearMonth } from "@/lib/utils";

function Period({ job, present }: { job: Job; present: string }) {
  return (
    <>
      <time dateTime={job.start}>{formatYearMonth(job.start)}</time>
      {" — "}
      {job.end ? <time dateTime={job.end}>{formatYearMonth(job.end)}</time> : present}
    </>
  );
}

export function Experience({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const jobs = cv.experience;

  return (
    <Section id={t.sectionIds.experience} index="02" title={t.experience.title}>
      <div className="relative max-w-4xl">
        {/* Línea que se dibuja con el scroll y enciende cada nodo al alcanzarlo (solo con JS). */}
        <TimelineFill />
        <ol>
          {jobs.map((job, index) => {
            const isCurrent = !job.end;
            const isLast = index === jobs.length - 1;
            return (
              // Cada puesto entra en secuencia: fechas, cargo, logros uno a uno y tecnologías.
              <Reveal
                as="li"
                kind="group"
                key={`${job.company}-${job.start}`}
                className="md:grid md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10"
              >
                <Reveal as="p" kind="fade" className="hidden pt-1 text-right font-mono text-sm text-muted md:block">
                  <Period job={job} present={t.experience.present} />
                </Reveal>

                <div className={cn("relative border-l border-border pl-8 md:pl-10", !isLast && "pb-14")}>
                  {/* Nodo: anillo gris de base y, encima, su estado "encendido" (ver globals.css). */}
                  <span
                    aria-hidden="true"
                    data-timeline-node=""
                    className="timeline-node absolute top-1.5 -left-1.75 size-3.5 rounded-full border-2 border-border bg-bg"
                  >
                    <span
                      className={cn(
                        "timeline-node-core absolute -inset-0.5 grid place-items-center rounded-full border-2 border-accent",
                        isCurrent ? "bg-accent" : "bg-bg",
                      )}
                    >
                      {isCurrent ? (
                        <span className="ping-soft absolute inset-0 rounded-full bg-accent" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-accent" />
                      )}
                    </span>
                  </span>

                  <Reveal>
                    <p className="font-mono text-sm text-muted md:hidden">
                      <Period job={job} present={t.experience.present} />
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight md:mt-0">{job.role[locale]}</h3>
                    <p className="mt-1 flex flex-wrap items-center gap-3 text-base text-fg">
                      {job.company}
                      {isCurrent ? <StatusBadge tone="success">{t.experience.current}</StatusBadge> : null}
                    </p>
                  </Reveal>

                  {job.highlights[locale].length ? (
                    <Stagger as="ul" className="mt-5 space-y-3 text-muted">
                      {job.highlights[locale].map((item) => (
                        <li key={item} className="relative pl-5 leading-relaxed">
                          <span aria-hidden="true" className="absolute top-[0.7em] left-0 h-px w-2.5 bg-accent" />
                          {item}
                        </li>
                      ))}
                    </Stagger>
                  ) : null}

                  {job.tags?.length ? <TagList items={job.tags} label={t.projects.stack} className="mt-6" stagger /> : null}
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

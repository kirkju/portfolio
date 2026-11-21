import { ProjectGallery, type GalleryLabels, type GalleryProject } from "@/components/projects/project-gallery";
import { Section } from "@/components/ui/section";
import type { Tone } from "@/components/ui/tag";
import { cv } from "@/data/cv";
import type { ProjectStatus } from "@/data/types";
import { ui } from "@/data/ui";
import type { Locale } from "@/lib/i18n";

const statusTone = {
  production: "success",
  active: "success",
  delivered: "accent",
  pilot: "warning",
  development: "muted",
} as const satisfies Record<ProjectStatus, Tone>;

export function Projects({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const p = t.projects;

  // La galería es interactiva (cliente): recibe los textos ya resueltos al idioma.
  // Todo el detalle de cada proyecto se genera igual en el HTML estático.
  const projects: GalleryProject[] = cv.projects.map((project) => ({
    id: project.id,
    title: project.title[locale],
    client: project.client?.[locale],
    period: project.ongoing ? `${project.year} — ${t.experience.present}` : String(project.year),
    status: project.status,
    statusLabel: project.status ? p.status[project.status] : undefined,
    tone: project.status ? statusTone[project.status] : undefined,
    image: project.image,
    imageAlt: project.imageAlt[locale],
    context: project.context[locale],
    solution: project.solution[locale],
    result: project.result[locale],
    features: project.features[locale],
    stack: project.stack,
    url: project.url,
  }));

  const labels: GalleryLabels = {
    context: p.context,
    solution: p.solution,
    result: p.result,
    features: p.features,
    stack: p.stack,
    visit: p.visit,
    details: p.details,
    close: p.close,
    previous: p.previous,
    next: p.next,
    counter: p.counter,
    showing: p.showing,
    showingOne: p.showingOne,
    swipeHint: p.swipeHint,
    newTab: t.actions.newTab,
    filters: p.filters,
  };

  return (
    <Section id={t.sectionIds.projects} index="03" title={p.title} lead={p.lead}>
      <ProjectGallery projects={projects} labels={labels} />
    </Section>
  );
}

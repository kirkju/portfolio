import { ProjectGallery, type GalleryLabels } from "@/components/projects/project-gallery";
import { Section } from "@/components/ui/section";
import { ui } from "@/data/ui";
import type { Locale } from "@/lib/i18n";

export function Projects({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const p = t.projects;

  // La galería es interactiva (cliente). Recibe solo el idioma y los textos de la interfaz;
  // los proyectos los importa ella misma de cv.ts, así el HTML no los lleva dos veces.
  // Todo el detalle de cada proyecto se genera igual en el HTML estático.
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
    present: t.experience.present,
    filters: p.filters,
    status: p.status,
  };

  return (
    <Section id={t.sectionIds.projects} index="03" title={p.title} lead={p.lead}>
      <ProjectGallery locale={locale} labels={labels} />
    </Section>
  );
}

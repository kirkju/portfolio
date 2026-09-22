import type { ComponentType, SVGProps } from "react";
import { CloudIcon, CodeIcon, DatabaseIcon, LayersIcon, SparkIcon } from "@/components/icons";
import { Section } from "@/components/ui/section";
import { cv } from "@/data/cv";
import type { SkillGroup } from "@/data/types";
import { ui } from "@/data/ui";
import type { Locale } from "@/lib/i18n";
import { cn, pick } from "@/lib/utils";

const icons: Record<SkillGroup["id"], ComponentType<SVGProps<SVGSVGElement>>> = {
  languages: CodeIcon,
  ai: SparkIcon,
  databases: DatabaseIcon,
  cloud: CloudIcon,
  architecture: LayersIcon,
};

// Posición de cada tarjeta en el grid bento (6 columnas en escritorio).
const spans: Record<SkillGroup["id"], string> = {
  languages: "sm:col-span-2 lg:col-span-4",
  ai: "lg:col-span-2",
  databases: "lg:col-span-2",
  cloud: "lg:col-span-2",
  architecture: "lg:col-span-2",
};

export function Skills({ locale }: { locale: Locale }) {
  const t = ui[locale];
  return (
    <Section id={t.sectionIds.skills} index="05" title={t.skills.title} lead={t.skills.lead}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {cv.skills.map((group) => {
          const Icon = icons[group.id];
          const featured = group.id === "ai";
          return (
            <li key={group.id} className={cn("reveal flex", spans[group.id])}>
              <article
                className={cn(
                  "relative w-full overflow-hidden rounded-2xl border bg-surface p-6 shadow-card transition-colors duration-300 sm:p-7",
                  featured
                    ? "border-accent/40 bg-[radial-gradient(120%_120%_at_100%_0%,var(--glow-accent),transparent_60%)]"
                    : "border-border hover:border-accent/40",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl border border-border bg-surface-2 text-accent">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-base font-semibold tracking-tight">{group.title[locale]}</h3>
                </div>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const label = pick(item, locale);
                    return (
                      <li
                        key={label}
                        className="rounded-lg border border-border bg-bg/60 px-3 py-1.5 text-sm text-fg"
                      >
                        {label}
                      </li>
                    );
                  })}
                </ul>
              </article>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

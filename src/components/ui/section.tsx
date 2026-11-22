import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  /** Número de la sección, por ejemplo "01". */
  index: string;
  title: string;
  lead?: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, index, title, lead, className, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("scroll-mt-16 py-16 sm:py-24", className)}>
      <div className="wrapper">
        {/* La cabecera entra en secuencia: número, línea que se dibuja, título por palabras y entradilla. */}
        <Reveal as="header" kind="group" className="mb-10 max-w-2xl sm:mb-14">
          <Reveal
            as="p"
            kind="fade"
            className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-accent"
            aria-hidden="true"
          >
            <span>{index}</span>
            <Reveal as="span" kind="line" className="h-px w-10 bg-accent/50" />
          </Reveal>
          <TextReveal
            as="h2"
            by="words"
            text={title}
            id={headingId}
            className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
          />
          {lead ? (
            <Reveal as="p" className="mt-4 text-base text-muted sm:text-lg">
              {lead}
            </Reveal>
          ) : null}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

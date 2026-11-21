import { Fragment, type CSSProperties, type ReactNode } from "react";
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

/**
 * Título partido en palabras para que suban una tras otra al entrar con el scroll
 * (`.split-heading` en globals.css). El texto y los espacios no cambian para
 * lectores de pantalla ni al copiar.
 */
export function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span className="word-mask">
        <span className="word" style={{ "--i": i } as CSSProperties}>
          {word}
        </span>
      </span>
      {i < words.length - 1 ? " " : null}
    </Fragment>
  ));
}

export function Section({ id, index, title, lead, className, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("scroll-mt-16 py-16 sm:py-24", className)}>
      <div className="wrapper">
        <header className="reveal mb-10 max-w-2xl sm:mb-14">
          <p className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-accent" aria-hidden="true">
            <span>{index}</span>
            <span className="reveal-line h-px w-10 bg-accent/50" />
          </p>
          <h2 id={headingId} className="split-heading mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            <SplitWords text={title} />
          </h2>
          {lead ? <p className="mt-4 text-base text-muted sm:text-lg">{lead}</p> : null}
        </header>
        {children}
      </div>
    </section>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Etiqueta pequeña para tecnologías, palabras clave y áreas. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-surface-2/70 px-2.5 py-1 font-mono text-xs leading-none text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

type TagListProps = {
  items: readonly string[];
  label?: string;
  className?: string;
  /** Las etiquetas entran una tras otra, en cascada rápida, cuando la lista se revela. */
  stagger?: boolean;
};

/** Lista de etiquetas con semántica de lista. */
export function TagList({ items, label, className, stagger = false }: TagListProps) {
  return (
    <ul
      aria-label={label}
      className={cn("flex flex-wrap gap-2", className)}
      {...(stagger ? { "data-reveal": "stagger", "data-stagger": "fast" } : null)}
    >
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}

export type Tone = "success" | "accent" | "warning" | "muted";

const tones: Record<Tone, string> = {
  success: "bg-success",
  accent: "bg-accent",
  warning: "bg-warning",
  muted: "bg-muted",
};

/** Estado (En producción, Publicado, ...). El color es de apoyo; el texto siempre lo indica. */
export function StatusBadge({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[0.6875rem] leading-none tracking-wide text-fg uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", tones[tone])} />
      {children}
    </span>
  );
}

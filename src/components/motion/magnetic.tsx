import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Hace que su contenido (un botón o un enlace) siga levemente al cursor.
 *
 * Aquí solo se marca el HTML: el comportamiento lo pone `MagneticField`, un único
 * listener para toda la página que llega en diferido y solo actúa con ratón.
 */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span data-magnetic="" className={cn("inline-flex shrink-0", className)}>
      {children}
    </span>
  );
}

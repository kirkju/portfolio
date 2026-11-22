import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Hace que su contenido (un botón o un enlace) siga levemente al cursor.
 *
 * Aquí solo se marca el HTML: el comportamiento lo pone `MagneticField`, un único
 * listener para toda la página que llega en diferido y solo actúa con ratón.
 */
export function Magnetic({ children, className, style }: MagneticProps) {
  return (
    <span data-magnetic="" className={cn("inline-flex shrink-0", className)} style={style}>
      {children}
    </span>
  );
}

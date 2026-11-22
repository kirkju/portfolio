"use client";

import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { header, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

/**
 * Sección que cruza la línea de lectura (una horizontal a cierta altura de la ventana).
 * Un IntersectionObserver con la raíz reducida a esa línea: sin listeners de scroll.
 */
function useActiveSection(links: readonly NavLink[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const hrefs = links.map((link) => link.href);
    const crossing = new Set<string>();
    const top = Math.round(header.spyLine * 100);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const href = `#${entry.target.id}`;
          if (entry.isIntersecting) crossing.add(href);
          else crossing.delete(href);
        }
        // Si dos secciones tocan la línea a la vez, manda la que va más abajo.
        setActive(hrefs.findLast((href) => crossing.has(href)) ?? null);
      },
      { rootMargin: `-${top}% 0px -${100 - top}% 0px` },
    );
    for (const href of hrefs) {
      const section = document.getElementById(href.slice(1));
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [links]);

  return active;
}

/**
 * Enlaces de la barra en escritorio. La pastilla de la sección activa es un único
 * elemento compartido (`layoutId`): al cambiar de sección se desliza hasta el enlace nuevo.
 */
export function NavLinks({ links, label }: { links: readonly NavLink[]; label: string }) {
  const active = useActiveSection(links);

  return (
    <nav aria-label={label} className="hidden xl:block">
      {/* `layoutRoot`: la barra es fija, así que las posiciones se miden respecto a ella y no a la página. */}
      <m.ul layoutRoot className="flex items-center gap-1">
        {links.map((link) => {
          const isActive = link.href === active;
          return (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative block rounded-full px-3 py-2 text-sm whitespace-nowrap transition duration-micro ease-smooth hover:text-fg motion-safe:active:scale-95",
                  isActive ? "text-fg" : "text-muted",
                )}
              >
                {isActive ? (
                  <m.span
                    layoutId="nav-active"
                    aria-hidden="true"
                    transition={spring.soft}
                    className="absolute inset-0 rounded-full bg-surface-2"
                  />
                ) : null}
                <span className="relative">{link.label}</span>
              </a>
            </li>
          );
        })}
      </m.ul>
    </nav>
  );
}

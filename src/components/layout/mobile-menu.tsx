"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";

type MobileMenuProps = {
  links: ReadonlyArray<{ href: string; label: string }>;
  labels: { open: string; close: string; navLabel: string };
  /** Contenido extra al final del panel (idioma, descarga del CV). */
  footer: ReactNode;
};

export function MobileMenu({ links, labels, footer }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? labels.close : labels.open}
        onClick={() => setOpen((value) => !value)}
        className="group inline-flex size-9 items-center justify-center rounded-full text-fg transition duration-micro ease-smooth hover:bg-surface-2 motion-safe:active:scale-90"
      >
        {/* Los dos iconos se cruzan girando según aria-expanded. */}
        <span aria-hidden="true" className="relative size-5">
          <MenuIcon className="absolute inset-0 size-full transition duration-ui ease-smooth group-aria-expanded:opacity-0 motion-safe:group-aria-expanded:rotate-90" />
          <CloseIcon className="absolute inset-0 size-full opacity-0 transition duration-ui ease-smooth group-aria-expanded:opacity-100 motion-safe:-rotate-90 motion-safe:group-aria-expanded:rotate-0" />
        </span>
      </button>

      {/* El panel baja y sus enlaces entran escalonados; al cerrar se recoge (`.mobile-panel` en globals.css). */}
      <div
        id={panelId}
        hidden={!open}
        className="mobile-panel absolute inset-x-0 top-full border-b border-border bg-bg/95 shadow-card backdrop-blur-md"
      >
        <nav aria-label={labels.navLabel} className="wrapper py-4">
          <ul className="grid gap-1">
            {links.map((link, i) => (
              <li key={link.href} className="mobile-panel-item" style={{ "--i": i } as CSSProperties}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base text-fg transition duration-micro ease-smooth hover:bg-surface-2 motion-safe:hover:translate-x-1"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div
            className="mobile-panel-item mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4"
            style={{ "--i": links.length } as CSSProperties}
          >
            {footer}
          </div>
        </nav>
      </div>
    </div>
  );
}

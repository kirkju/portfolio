"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
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
        className="inline-flex size-9 items-center justify-center rounded-full text-fg transition-colors hover:bg-surface-2"
      >
        {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-bg/95 shadow-card backdrop-blur-md"
      >
        <nav aria-label={labels.navLabel} className="wrapper py-4">
          <ul className="grid gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base text-fg transition-colors hover:bg-surface-2"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">{footer}</div>
        </nav>
      </div>
    </div>
  );
}

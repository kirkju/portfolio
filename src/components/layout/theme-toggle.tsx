"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

// El HTML se genera en modo oscuro; el script de <head> ya aplicó el tema real.
function getServerTheme(): Theme {
  return "dark";
}

/**
 * Cambia el tema con un fundido de toda la página (View Transitions) en lugar
 * de un salto de colores. Sin soporte, o si se pidió reducir el movimiento,
 * el cambio es inmediato.
 */
function applyTheme(next: Theme) {
  const root = document.documentElement;
  const update = () => {
    root.dataset.theme = next;
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof document.startViewTransition !== "function" || reduceMotion) {
    update();
    return;
  }

  // Marca la transición para que globals.css use el fundido del tema, no el de navegación.
  root.dataset.themeSwitching = "";
  document
    .startViewTransition(update)
    .finished.catch(() => {})
    .finally(() => {
      delete root.dataset.themeSwitching;
    });
}

type ThemeToggleProps = {
  labels: { label: string; toLight: string; toDark: string };
  className?: string;
};

// Los dos iconos están siempre en el DOM y se cruzan girando; el tema activo decide cuál se ve.
const iconClasses = "absolute inset-0 size-full transition duration-enter ease-smooth";

export function ThemeToggle({ labels, className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const isDark = theme === "dark";

  function toggle() {
    const next: Theme = isDark ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Sin acceso a localStorage (modo privado estricto): el cambio dura la sesión.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={labels.label}
      title={isDark ? labels.toLight : labels.toDark}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full text-muted transition duration-micro ease-smooth hover:bg-surface-2 hover:text-fg motion-safe:active:scale-90",
        className,
      )}
    >
      <span aria-hidden="true" className="relative size-[1.125rem]">
        <SunIcon
          className={cn(
            iconClasses,
            "opacity-0 motion-safe:scale-50 motion-safe:rotate-90",
            "dark:opacity-100 motion-safe:dark:scale-100 motion-safe:dark:rotate-0",
          )}
        />
        <MoonIcon
          className={cn(
            iconClasses,
            "opacity-100 motion-safe:scale-100 motion-safe:rotate-0",
            "dark:opacity-0 motion-safe:dark:scale-50 motion-safe:dark:-rotate-90",
          )}
        />
      </span>
    </button>
  );
}

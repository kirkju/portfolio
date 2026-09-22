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

type ThemeToggleProps = {
  labels: { label: string; toLight: string; toDark: string };
  className?: string;
};

export function ThemeToggle({ labels, className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const isDark = theme === "dark";

  function toggle() {
    const next: Theme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
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
        "inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg",
        className,
      )}
    >
      <SunIcon className="hidden size-[1.125rem] dark:block" />
      <MoonIcon className="size-[1.125rem] dark:hidden" />
    </button>
  );
}

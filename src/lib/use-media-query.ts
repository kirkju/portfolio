"use client";

import { useSyncExternalStore } from "react";

/**
 * `true` cuando la media query coincide. En el servidor y durante la hidratación vale
 * `false`; después React la sincroniza sola con el navegador.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

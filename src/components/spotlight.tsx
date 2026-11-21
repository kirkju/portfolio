"use client";

import { useEffect } from "react";

/**
 * Brillo que sigue al cursor en las tarjetas con la clase `spotlight`.
 * Un solo listener para toda la página: guarda la posición del puntero en
 * `--mx` / `--my` de la tarjeta que está debajo, una vez por cuadro. El dibujo
 * lo hace globals.css. En pantallas táctiles no hace nada.
 */
export function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    let target: EventTarget | null = null;

    function paint() {
      frame = 0;
      const card = target instanceof Element ? target.closest<HTMLElement>(".spotlight") : null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${x - rect.left}px`);
      card.style.setProperty("--my", `${y - rect.top}px`);
    }

    function onPointerMove(event: PointerEvent) {
      x = event.clientX;
      y = event.clientY;
      target = event.target;
      if (!frame) frame = requestAnimationFrame(paint);
    }

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}

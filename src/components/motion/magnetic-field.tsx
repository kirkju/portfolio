"use client";

import { motionValue, springValue, type MotionValue } from "motion";
import { useEffect } from "react";
import { magnetic, spring } from "@/lib/motion";

type Pull = {
  /** Hacia dónde tira el cursor. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Desplazamiento que se ve ahora mismo (el spring que persigue a `x`/`y`). */
  offset: () => { x: number; y: number };
  stop: () => void;
};

const clamp = (value: number) => Math.max(-magnetic.max, Math.min(magnetic.max, value));

/**
 * Da vida a los `<Magnetic>`: el elemento bajo el cursor se desplaza hacia él con un
 * spring y vuelve a su sitio al salir. Solo `transform`, solo con puntero fino y nunca
 * con "reducir movimiento".
 */
export default function MagneticField() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pulls = new Map<HTMLElement, Pull>();
    let current: HTMLElement | null = null;

    function pullFor(el: HTMLElement): Pull {
      const existing = pulls.get(el);
      if (existing) return existing;

      const x = motionValue(0);
      const y = motionValue(0);
      const springX = springValue(x, spring.follow);
      const springY = springValue(y, spring.follow);
      const render = () => {
        el.style.transform = `translate3d(${springX.get()}px, ${springY.get()}px, 0)`;
      };
      const offX = springX.on("change", render);
      const offY = springY.on("change", render);
      const pull: Pull = {
        x,
        y,
        offset: () => ({ x: springX.get(), y: springY.get() }),
        stop() {
          offX();
          offY();
          springX.destroy();
          springY.destroy();
          el.style.removeProperty("transform");
        },
      };
      pulls.set(el, pull);
      return pull;
    }

    function release() {
      if (!current) return;
      const pull = pulls.get(current);
      pull?.x.set(0);
      pull?.y.set(0);
      current = null;
    }

    function onPointerMove(event: PointerEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-magnetic]") : null;
      if (target !== current) release();
      if (!target) return;
      current = target;

      const pull = pullFor(target);
      // La caja medida ya incluye el desplazamiento: se resta para obtener el centro en reposo.
      const rect = target.getBoundingClientRect();
      const offset = pull.offset();
      const restX = rect.left + rect.width / 2 - offset.x;
      const restY = rect.top + rect.height / 2 - offset.y;
      pull.x.set(clamp((event.clientX - restX) * magnetic.strength));
      pull.y.set(clamp((event.clientY - restY) * magnetic.strength));
    }

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", release);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", release);
      pulls.forEach((pull) => pull.stop());
    };
  }, []);

  return null;
}

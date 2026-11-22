"use client";

import { useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef } from "react";
import { spring } from "@/lib/motion";

/**
 * Profundidad del fondo del hero: un resplandor muy tenue que sigue al cursor y una
 * "lente" que aviva la cuadrícula justo debajo.
 *
 * Todo se mueve con transform: la lente se desplaza con el cursor y la cuadrícula que
 * lleva dentro se desplaza lo mismo en sentido contrario, así que queda clavada sobre
 * la cuadrícula de fondo y solo cambia qué parte se ve. Solo con ratón y nunca con
 * "reducir movimiento".
 */
export default function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const presence = useMotionValue(0);
  const x = useSpring(pointerX, spring.follow);
  const y = useSpring(pointerY, spring.follow);
  const opacity = useSpring(presence, spring.follow);
  const counterX = useTransform(x, (value) => -value);
  const counterY = useTransform(y, (value) => -value);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section || reduceMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !section) return;
      const rect = section.getBoundingClientRect();
      const nextX = event.clientX - rect.left;
      const nextY = event.clientY - rect.top;
      if (presence.get() === 0) {
        // Primera vez (o al volver a entrar): aparece bajo el cursor, no viaja desde una esquina.
        x.jump(nextX);
        y.jump(nextY);
      }
      pointerX.set(nextX);
      pointerY.set(nextY);
      presence.set(1);
    }

    function onPointerLeave() {
      presence.set(0);
    }

    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave);
    return () => {
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reduceMotion, pointerX, pointerY, presence, x, y]);

  return (
    <m.div ref={ref} className="absolute inset-0 overflow-hidden" style={{ opacity }}>
      <m.div className="hero-glow" style={{ x, y }} />
      <m.div className="hero-lens" style={{ x, y }}>
        <m.div className="hero-lens-grid" style={{ x: counterX, y: counterY }} />
      </m.div>
    </m.div>
  );
}

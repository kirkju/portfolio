"use client";

import { useReducedMotion, useScroll, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { spring } from "@/lib/motion";

/**
 * Barra fina de progreso de lectura bajo la navegación. Sigue al scroll a través de un
 * spring, así que avanza con suavidad aunque la rueda salte; con movimiento reducido va
 * pegada al scroll, sin suavizado.
 */
export default function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, spring.scroll);

  return (
    <span aria-hidden="true" className="header-progress pointer-events-none absolute inset-x-0 bottom-0 h-px">
      <m.span className="block h-full origin-left bg-accent/80" style={{ scaleX: reduceMotion ? scrollYProgress : smooth }} />
    </span>
  );
}

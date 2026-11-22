"use client";

import dynamic from "next/dynamic";
import { useMotionReady } from "./motion-provider";

/**
 * Piezas de movimiento que no aportan nada al HTML inicial (siguen al cursor o al scroll).
 * Su código no viaja en el bundle de la página: se pide, junto con el motor de Motion,
 * cuando el navegador ya terminó de pintar e hidratar.
 */

const HeroSpotlightImpl = dynamic(() => import("./hero-spotlight"), { ssr: false });
const MagneticFieldImpl = dynamic(() => import("./magnetic-field"), { ssr: false });
const ScrollProgressImpl = dynamic(() => import("./scroll-progress"), { ssr: false });

/** Luz que sigue al cursor sobre la cuadrícula del hero. */
export function HeroSpotlight() {
  return useMotionReady() ? <HeroSpotlightImpl /> : null;
}

/** Activa todos los `<Magnetic>` de la página. */
export function MagneticField() {
  return useMotionReady() ? <MagneticFieldImpl /> : null;
}

/** Barra de progreso de lectura de la navegación. */
export function ScrollProgress() {
  return useMotionReady() ? <ScrollProgressImpl /> : null;
}

"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useMotionReady } from "./motion-provider";

/**
 * Piezas de movimiento que no aportan nada al HTML inicial (siguen al cursor o al scroll).
 * Su código no viaja en el bundle de la página: se pide, junto con el motor de Motion,
 * cuando el navegador ya terminó de pintar e hidratar.
 */

const HeroSpotlightImpl = dynamic(() => import("./hero-spotlight"), { ssr: false });
const MagneticFieldImpl = dynamic(() => import("./magnetic-field"), { ssr: false });
const ScrollProgressImpl = dynamic(() => import("./scroll-progress"), { ssr: false });
const TimelineFillImpl = dynamic(() => import("./timeline-fill"), { ssr: false });

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

/**
 * Relleno de la línea de la trayectoria. Se coloca dentro del contenedor (relativo) de la
 * lista: ocupa toda su altura sobre la línea gris y es lo que el relleno usa para medir.
 */
export function TimelineFill() {
  const track = useRef<HTMLSpanElement>(null);
  const ready = useMotionReady();
  return (
    <span ref={track} aria-hidden="true" className="timeline-track pointer-events-none absolute inset-y-0 w-px">
      {ready ? <TimelineFillImpl track={track} /> : null}
    </span>
  );
}

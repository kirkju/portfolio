"use client";

import dynamic from "next/dynamic";
import { useMotionReady } from "./motion-provider";

/**
 * Piezas de movimiento que no aportan nada al HTML inicial (siguen al cursor o al scroll).
 * Su código no viaja en el bundle de la página: se pide, junto con el motor de Motion,
 * cuando el navegador ya terminó de pintar e hidratar.
 */

const MagneticFieldImpl = dynamic(() => import("./magnetic-field"), { ssr: false });

/** Activa todos los `<Magnetic>` de la página. */
export function MagneticField() {
  return useMotionReady() ? <MagneticFieldImpl /> : null;
}

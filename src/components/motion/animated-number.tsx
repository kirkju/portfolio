"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Como un contador mecánico: al subir, el número nuevo entra desde abajo y el viejo sale
// por arriba; al bajar, al revés.
const roll = {
  enter: (direction: number) => ({ y: `${direction * 100}%`, opacity: 0 }),
  center: { y: "0%", opacity: 1 },
  exit: (direction: number) => ({ y: `${direction * -100}%`, opacity: 0 }),
};

/**
 * Número que "rueda" al cambiar. Es decorativo: quien lo use debe dejar el texto completo
 * a los lectores de pantalla (por ejemplo en un `sr-only`) y marcar esto con `aria-hidden`.
 * Con movimiento reducido solo hace un fundido.
 */
export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [shown, setShown] = useState({ value, direction: 1 });
  if (shown.value !== value) {
    setShown({ value, direction: value > shown.value ? 1 : -1 });
  }

  return (
    <span className={cn("number-roll", className)}>
      <AnimatePresence mode="popLayout" initial={false} custom={shown.direction}>
        <m.span
          key={value}
          custom={shown.direction}
          variants={roll}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: duration.ui, ease: ease.out }}
          className="inline-block"
        >
          {value}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

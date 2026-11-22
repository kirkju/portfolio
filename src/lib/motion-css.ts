/**
 * Traduce los tokens de `lib/motion.ts` a variables CSS (`--m-*`).
 * Solo se importa desde componentes de servidor: el resultado es texto que viaja
 * en el HTML, así CSS y Motion leen exactamente los mismos valores.
 */
import { spring as springGenerator } from "motion";
import { distance, duration, ease, fullMotionQuery, loop, spring, stagger } from "@/lib/motion";

const bezier = (curve: readonly number[]) => `cubic-bezier(${curve.join(", ")})`;
const ms = (seconds: number) => `${Math.round(seconds * 1000)}ms`;
const px = (value: number) => `${value}px`;

/** El spring suave como `linear()` de CSS, con el tiempo que tarda en asentarse. */
function softSpring(): { time: string; easing: string } {
  // El generador de Motion se serializa como "800ms linear(0, 0.05, …)".
  const [time = ms(duration.enter), ...easing] = springGenerator({ keyframes: [0, 1], ...spring.soft })
    .toString()
    .split(" ");
  return { time, easing: easing.join(" ") };
}

function declarations(values: Record<string, string>) {
  return Object.entries(values)
    .map(([name, value]) => `--m-${name}:${value}`)
    .join(";");
}

const soft = softSpring();

const base = declarations({
  "ease-out": bezier(ease.out),
  "ease-in-out": bezier(ease.inOut),
  "ease-spring": soft.easing,
  "dur-micro": ms(duration.micro),
  "dur-ui": ms(duration.ui),
  "dur-enter": ms(duration.enter),
  "dur-spring": soft.time,
  "shift-sm": px(distance.sm),
  shift: px(distance.md),
  "shift-lg": px(distance.lg),
  "stagger-fast": ms(stagger.fast),
  stagger: ms(stagger.base),
  "stagger-slow": ms(stagger.slow),
  "loop-pulse": ms(loop.pulse),
  "loop-ring": ms(loop.ring),
  "loop-aurora-a": ms(loop.auroraA),
  "loop-aurora-b": ms(loop.auroraB),
});

// Móvil: versión ligera. Cada distancia y cada escalonado bajan un peldaño.
const compact = declarations({
  shift: px(distance.sm),
  "shift-lg": px(distance.md),
  stagger: ms(stagger.fast),
  "stagger-slow": ms(stagger.base),
});

// Movimiento reducido: sin desplazamientos ni escalonados; solo fundidos cortos.
const reduced = declarations({
  "shift-sm": px(0),
  shift: px(0),
  "shift-lg": px(0),
  "stagger-fast": ms(0),
  stagger: ms(0),
  "stagger-slow": ms(0),
  "dur-enter": ms(duration.ui),
  "dur-spring": ms(duration.ui),
  "ease-spring": bezier(ease.out),
});

/** Hoja de estilos mínima para <head>. */
export const motionCss = [
  `:root{${base}}`,
  `@media not all and ${fullMotionQuery}{:root{${compact}}}`,
  `@media (prefers-reduced-motion: reduce){:root{${reduced}}}`,
].join("");

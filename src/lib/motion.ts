/**
 * Tokens de movimiento: la única fuente de verdad del sitio.
 *
 * - Motion (JS) los importa tal cual: `transition={spring.soft}`.
 * - CSS los recibe como variables `--m-*` (las genera `lib/motion-css.ts` a partir de
 *   este archivo y las inyecta el layout).
 *
 * Ningún componente ni regla de CSS escribe curvas, duraciones o distancias a mano.
 */

type Bezier = readonly [number, number, number, number];

/** Curvas de tiempo. La tercera curva del sistema es `spring.soft`. */
export const ease = {
  /** Expresiva: arranca rápido y frena suave. Entradas y reveals. */
  out: [0.22, 1, 0.36, 1],
  /** Simétrica: algo que ya está en pantalla y cambia de estado, o que sale. */
  inOut: [0.65, 0, 0.35, 1],
} as const satisfies Record<string, Bezier>;

/** Duraciones en segundos (Motion). A CSS llegan en milisegundos. */
export const duration = {
  /** Hover, pressed y foco. */
  micro: 0.15,
  /** Cambios de estado de la interfaz. */
  ui: 0.3,
  /** Entradas y reveals. */
  enter: 0.6,
} as const;

/** Desplazamiento de las entradas, en px. */
export const distance = { sm: 12, md: 16, lg: 24 } as const;

/** Retraso entre elementos consecutivos de una secuencia, en segundos. */
export const stagger = { fast: 0.04, base: 0.06, slow: 0.08 } as const;

export const spring = {
  /** El spring suave del sistema: píldoras, indicadores, tarjetas que se reordenan. */
  soft: { type: "spring", visualDuration: 0.4, bounce: 0.15 },
  /** Cosas que persiguen al cursor (botones magnéticos, spotlight). */
  follow: { stiffness: 260, damping: 26, mass: 0.6 },
  /** Suaviza valores ligados al scroll (barra de progreso, línea de trayectoria). */
  scroll: { stiffness: 120, damping: 24, mass: 0.35, restDelta: 0.0005 },
} as const;

/** Bucles de ambiente, en segundos: lentos y continuos, nunca protagonistas. */
export const loop = {
  /** Punto que late (insignia "Disponible", nodo actual de la trayectoria). */
  pulse: 2.2,
  /** Vuelta completa del anillo de la foto. */
  ring: 14,
  /** Deriva de los dos resplandores del hero. */
  auroraA: 18,
  auroraB: 22,
} as const;

/** Desde este ancho (el `md` de Tailwind) se usa la versión completa; por debajo, la ligera. */
export const fullMotionQuery = "(min-width: 48rem)";

/** Reveals de scroll (ver `components/motion/reveal-runtime.tsx`). */
export const reveal = {
  /** Fracción inferior de la ventana que un bloque debe superar para revelarse. */
  margin: 0.12,
  /** Bloques que entran a la vez se escalonan como mucho estos pasos. */
  maxLanes: 4,
} as const;

/** Barra de navegación. */
export const header = {
  /** Píxeles de scroll a partir de los que se compacta. */
  compactAfter: 16,
  /** Altura de la ventana (0 arriba, 1 abajo) en la que una sección pasa a ser la activa. */
  spyLine: 0.4,
} as const;

/** Botones magnéticos: cuánto siguen al cursor y hasta dónde, en px. */
export const magnetic = { strength: 0.3, max: distance.sm / 2 } as const;

/** Gestos del detalle de proyecto: desplazamiento (px) o velocidad (px/s) que cambia de proyecto. */
export const swipe = { offset: 64, velocity: 480 } as const;

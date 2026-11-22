"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { createContext, startTransition, useCallback, useContext, useState, type ReactNode } from "react";

/** Tope de espera a que el navegador quede libre, y espera fija donde no hay `requestIdleCallback`. */
const IDLE_TIMEOUT_MS = 2000;
const IDLE_FALLBACK_MS = 200;

const MotionReadyContext = createContext(false);

/** `true` cuando el motor de Motion ya se cargó. Hasta entonces los componentes `m` son HTML estático. */
export function useMotionReady() {
  return useContext(MotionReadyContext);
}

/** Espera a que el navegador termine lo urgente (pintar e hidratar) antes de pedir más JavaScript. */
function whenIdle() {
  return new Promise<void>((resolve) => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => resolve(), { timeout: IDLE_TIMEOUT_MS });
    } else {
      window.setTimeout(resolve, IDLE_FALLBACK_MS);
    }
  });
}

/**
 * Contexto de Motion para toda la página.
 *
 * - `LazyMotion` con `strict`: solo se permiten componentes `m` (unos 5 kB). El motor
 *   completo llega después, en un chunk aparte, sin bloquear la carga.
 * - `reducedMotion="user"`: con "reducir movimiento" activo, Motion no anima transform ni
 *   layout; solo deja pasar opacidad y color.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  const loadFeatures = useCallback(async () => {
    await whenIdle();
    const { default: features } = await import("./features");
    // Un instante después: para entonces LazyMotion ya entregó el motor a los componentes `m`.
    window.setTimeout(() => startTransition(() => setReady(true)), 0);
    return features;
  }, []);

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <MotionReadyContext value={ready}>{children}</MotionReadyContext>
      </MotionConfig>
    </LazyMotion>
  );
}

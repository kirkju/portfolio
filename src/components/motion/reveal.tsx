import type { ComponentPropsWithoutRef, ElementType } from "react";

/**
 * Primitivas de aparición al hacer scroll.
 *
 * Solo marcan el HTML con `data-reveal`; no llevan "use client" ni estado, así que sirven
 * igual en componentes de servidor. El HTML que sale del servidor es el estado final (todo
 * visible): quien oculta y revela es `RevealRuntime`, una sola vez por bloque y solo si hay
 * JavaScript. Los estilos están en globals.css y leen los tokens de `lib/motion.ts`.
 *
 * Un bloque con `data-reveal` dentro de otro no se observa por separado: entra en secuencia
 * cuando lo hace su bloque raíz.
 */

type RevealKind =
  /** Sube unos píxeles mientras aparece. */
  | "up"
  /** Solo aparece. */
  | "fade"
  /** Se dibuja de izquierda a derecha (líneas y reglas). */
  | "line"
  /** No se anima: agrupa y ordena la secuencia de los bloques que contiene. */
  | "group";

type PolymorphicProps<T extends ElementType, Own> = Own & { as?: T } & Omit<ComponentPropsWithoutRef<T>, keyof Own | "as">;

export function Reveal<T extends ElementType = "div">({
  as,
  kind = "up",
  ...props
}: PolymorphicProps<T, { kind?: RevealKind }>) {
  const Tag: ElementType = as ?? "div";
  return <Tag data-reveal={kind} {...props} />;
}

/**
 * Sus hijos directos entran uno tras otro. `speed` elige el paso entre ellos
 * (`stagger.fast | base | slow` en los tokens).
 */
export function Stagger<T extends ElementType = "div">({
  as,
  speed = "base",
  ...props
}: PolymorphicProps<T, { speed?: "fast" | "base" | "slow" }>) {
  const Tag: ElementType = as ?? "div";
  return <Tag data-reveal="stagger" data-stagger={speed} {...props} />;
}

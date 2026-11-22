"use client";

import { useEffect } from "react";
import { duration, fullMotionQuery, reveal, stagger } from "@/lib/motion";

const SELECTOR = "[data-reveal]";
/** Carruseles horizontales: sus bloques entran juntos cuando entra el carrusel. */
const SCOPE_SELECTOR = "[data-reveal-scope]";
/** Margen sobre la ventana: lo que quedó por encima cuenta como "ya visto". */
const ABOVE_PX = 1_000_000;

type Cleanup = () => void;

const toMs = (seconds: number) => seconds * 1000;

/**
 * Paso entre elementos consecutivos, en ms. Se lee de la variable CSS y no del token,
 * porque en móvil y con movimiento reducido el valor efectivo es otro (ver motion-css.ts).
 */
function currentStep() {
  const value = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--m-stagger"));
  return Number.isFinite(value) ? value : toMs(stagger.base);
}

/** Un bloque raíz y todos los `data-reveal` que contiene, en orden de documento. */
function members(root: HTMLElement) {
  return [root, ...root.querySelectorAll<HTMLElement>(SELECTOR)];
}

function inDocumentOrder(a: Element, b: Element) {
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

/**
 * Parte un párrafo de texto plano en sus líneas reales (las mide con un Range, sin tocar
 * el DOM) y envuelve cada una en una máscara. Devuelve cómo dejarlo como estaba.
 */
function splitLines(el: HTMLElement): Cleanup | null {
  const node = el.firstChild;
  if (el.childNodes.length !== 1 || !(node instanceof Text)) return null;

  const range = document.createRange();
  const lines: string[] = [];
  let line = "";
  let lineTop: number | null = null;
  for (const match of node.data.matchAll(/\S+/g)) {
    const word = match[0];
    range.setStart(node, match.index);
    range.setEnd(node, match.index + word.length);
    const { top } = range.getBoundingClientRect();
    // Una palabra más abajo que la anterior empieza una línea nueva.
    if (lineTop !== null && Math.abs(top - lineTop) > 2) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
    lineTop = top;
  }
  if (!line) return null;
  lines.push(line);

  const fragment = document.createDocumentFragment();
  lines.forEach((line, i) => {
    const mask = document.createElement("span");
    mask.className = "line-mask";
    const inner = document.createElement("span");
    inner.className = "line";
    inner.style.setProperty("--i", String(i));
    inner.textContent = line;
    mask.append(inner);
    // El espacio entre líneas mantiene el texto intacto al copiar o leerlo en voz alta.
    fragment.append(mask, " ");
  });
  el.replaceChildren(fragment);
  return () => el.replaceChildren(node);
}

/** Oculta un bloque que todavía no se ha visto. Devuelve cómo deshacerlo. */
function arm(root: HTMLElement, splitText: boolean): Cleanup {
  const items = members(root);
  const undo: Cleanup[] = [];

  for (const el of items) {
    if (el.dataset.reveal === "lines") {
      const plainText = el.childNodes.length === 1 && el.firstChild instanceof Text;
      // En móvil, con movimiento reducido o si el párrafo trae marcado, entra como un bloque normal.
      if (!splitText || !plainText) el.dataset.reveal = "up";
    }
    if (el.dataset.reveal === "stagger") {
      const children = Array.from(el.children) as HTMLElement[];
      children.forEach((child, i) => child.style.setProperty("--i", String(i)));
      undo.push(() => children.forEach((child) => child.style.removeProperty("--i")));
    }
    el.setAttribute("data-armed", "");
  }

  return () => {
    for (const el of items) {
      el.removeAttribute("data-armed");
      el.removeAttribute("data-shown");
      el.style.removeProperty("--d");
    }
    undo.forEach((fn) => fn());
  };
}

/**
 * Suelta un bloque armado: cada `data-reveal` que contiene empieza un paso después del
 * anterior (`--d`, en ms). Devuelve cuánto tarda en terminar y cómo limpiar lo que añadió.
 */
function show(root: HTMLElement, baseMs: number, step: number): { total: number; undo: Cleanup } {
  const items = members(root);
  const undo: Cleanup[] = [];
  let cursor = baseMs;
  let end = baseMs;

  items.forEach((el, index) => {
    if (index > 0) cursor += step;
    el.style.setProperty("--d", `${cursor}ms`);

    let parts = 0;
    let sequential = false;
    if (el.dataset.reveal === "stagger") parts = el.children.length;
    if (el.dataset.reveal === "words") {
      parts = el.querySelectorAll(".word").length;
      sequential = true;
    }
    if (el.dataset.reveal === "lines") {
      const restore = splitLines(el);
      if (restore) undo.push(restore);
      parts = el.querySelectorAll(".line").length;
      sequential = true;
    }
    end = Math.max(end, cursor + parts * toMs(stagger.slow));
    // Un texto se lee en orden: lo siguiente espera a que haya salido su última palabra o línea.
    // Los hijos de un `stagger`, en cambio, entran mientras sigue la secuencia.
    if (sequential) cursor += Math.max(0, parts - 1) * step;
  });

  // Las líneas recién creadas necesitan un estilo calculado de partida para poder animarse.
  if (undo.length > 0) void root.offsetWidth;
  items.forEach((el) => el.setAttribute("data-shown", ""));

  return { total: end + toMs(duration.enter) + toMs(duration.ui), undo: () => undo.forEach((fn) => fn()) };
}

function startReveals(): Cleanup {
  // En desarrollo, StrictMode vuelve a montar <html> y borra lo que puso el script de <head>.
  document.documentElement.setAttribute("data-js", "");
  if (!("IntersectionObserver" in window)) return () => {};

  const splitText =
    window.matchMedia(fullMotionQuery).matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const viewportHeight = window.innerHeight;

  // Raíces: bloques sin otro `data-reveal` por encima. Solo se arma lo que está entero
  // bajo el pliegue: nada que el visitante ya haya visto se oculta para volver a entrar.
  const roots = [...document.querySelectorAll<HTMLElement>(SELECTOR)]
    .filter((el) => !el.parentElement?.closest(SELECTOR))
    .filter((el) => el.getBoundingClientRect().top >= viewportHeight);

  // Lo que vive en un carrusel horizontal no se cruza con la ventana hasta deslizarlo:
  // se observa el carrusel y sus bloques entran con él.
  const targets = new Map<Element, HTMLElement[]>();
  for (const root of roots) {
    const scope = root.closest<HTMLElement>(SCOPE_SELECTOR);
    const target = scope && scope.scrollWidth > scope.clientWidth + 1 ? scope : root;
    targets.set(target, [...(targets.get(target) ?? []), root]);
  }

  const disarm = new Map<HTMLElement, Cleanup>();
  for (const root of roots) disarm.set(root, arm(root, splitText));

  const timers = new Set<number>();
  const pendingUndo = new Map<HTMLElement, Cleanup>();

  function release(root: HTMLElement) {
    pendingUndo.get(root)?.();
    pendingUndo.delete(root);
    disarm.get(root)?.();
    disarm.delete(root);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      let lane = 0;
      const step = currentStep();
      const entering = entries.filter((entry) => entry.isIntersecting).sort((a, b) => inDocumentOrder(a.target, b.target));
      for (const entry of entering) {
        observer.unobserve(entry.target);
        // Si el visitante saltó por encima (un ancla, "buscar en la página"), se muestra sin espera.
        const skipped = entry.boundingClientRect.bottom <= 0;
        for (const root of targets.get(entry.target) ?? []) {
          const delay = skipped ? 0 : Math.min(lane++, reveal.maxLanes) * step;
          const { total, undo } = show(root, delay, step);
          pendingUndo.set(root, undo);
          const timer = window.setTimeout(() => {
            timers.delete(timer);
            release(root);
          }, total);
          timers.add(timer);
        }
      }
    },
    // Hacia arriba y a los lados no hay límite: solo cuenta haber pasado la línea inferior.
    { rootMargin: `${ABOVE_PX}px ${ABOVE_PX}px ${-reveal.margin * 100}% ${ABOVE_PX}px` },
  );
  targets.forEach((_, target) => observer.observe(target));

  return () => {
    observer.disconnect();
    timers.forEach((timer) => window.clearTimeout(timer));
    [...disarm.keys()].forEach(release);
  };
}

/**
 * Aparición al hacer scroll para todo lo marcado con `data-reveal` (ver `reveal.tsx`).
 *
 * El HTML del servidor llega visible. Tras hidratar, este componente "arma" (oculta) solo
 * los bloques que aún están bajo el pliegue y los revela una única vez, cuando entran, con
 * un único IntersectionObserver para toda la página. Bloques que entran a la vez se
 * escalonan entre sí. Al terminar, cada bloque queda exactamente como lo envió el servidor.
 */
export function RevealRuntime() {
  useEffect(() => startReveals(), []);
  return null;
}

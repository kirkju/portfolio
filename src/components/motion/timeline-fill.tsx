"use client";

import { useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, type RefObject } from "react";
import { spring, timeline } from "@/lib/motion";

/**
 * Relleno de la línea de la trayectoria. Avanza con el scroll (suavizado con un spring) y
 * nunca retrocede: lo ya recorrido se queda dibujado, igual que los reveals.
 *
 * También enciende los nodos (`data-timeline-node`) cuando el relleno llega a ellos. El
 * HTML los trae encendidos; aquí solo se "apagan" los que siguen bajo el pliegue, para
 * poder encenderlos una vez. Con movimiento reducido el relleno va pegado al scroll.
 */
export default function TimelineFillImpl({ track }: { track: RefObject<HTMLElement | null> }) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: track,
    offset: [`start ${timeline.readingLine}`, `end ${timeline.readingLine}`],
  });
  const reached = useMotionValue(0);
  const smooth = useSpring(reached, spring.scroll);
  const fill = reduceMotion ? reached : smooth;

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (progress > reached.get()) reached.set(progress);
  });

  useEffect(() => {
    const line = track.current;
    const list = line?.parentElement;
    if (!line || !list) return;

    const pending = [...list.querySelectorAll<HTMLElement>("[data-timeline-node]")].filter(
      (node) => node.getBoundingClientRect().top >= window.innerHeight,
    );
    for (const node of pending) node.setAttribute("data-armed", "");

    // Altura de cada nodo como fracción de la línea: es el valor de relleno que lo alcanza.
    let marks: Array<{ node: HTMLElement; at: number }> = [];
    const measure = () => {
      const box = line.getBoundingClientRect();
      marks = pending.map((node) => {
        const rect = node.getBoundingClientRect();
        return { node, at: (rect.top + rect.height / 2 - box.top) / box.height };
      });
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(line);

    const light = (value: number) => {
      for (const mark of marks) {
        if (value >= mark.at) mark.node.setAttribute("data-lit", "");
      }
    };
    light(fill.get());
    const stop = fill.on("change", light);

    return () => {
      stop();
      resize.disconnect();
      for (const node of pending) {
        node.removeAttribute("data-armed");
        node.removeAttribute("data-lit");
      }
    };
  }, [track, fill]);

  return <m.span className="timeline-fill absolute inset-0 origin-top bg-accent/70" style={{ scaleY: fill }} />;
}

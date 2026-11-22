"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button-link";
import { duration, ease, feedback, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

type CopyState = "idle" | "copied" | "error";

type CopyEmailButtonProps = {
  email: string;
  labels: { copy: string; copied: string; copiedAnnouncement: string; copyError: string };
};

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Respaldo para navegadores sin Clipboard API o sin permiso.
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    field.remove();
    return ok;
  }
}

// El icono saliente se encoge y el entrante crece con el spring del sistema.
const swap = {
  initial: { scale: 0.4, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: spring.soft },
  exit: { scale: 0.4, opacity: 0, transition: { duration: duration.micro, ease: ease.inOut } },
};

export function CopyEmailButton({ email, labels }: CopyEmailButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handleClick() {
    const ok = await copyText(email);
    setState(ok ? "copied" : "error");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), feedback.hold * 1000);
  }

  const copied = state === "copied";

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={buttonClasses("secondary", "md", copied ? "border-success/60! text-heading" : undefined)}
      >
        {/* El icono de copiar se transforma en la palomita, y vuelve. */}
        <span className="relative grid size-4 place-items-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.span key={copied ? "check" : "copy"} {...swap} className="grid place-items-center">
              {copied ? <CheckIcon className="size-4 text-success" /> : <CopyIcon className="size-4" />}
            </m.span>
          </AnimatePresence>
        </span>

        {state === "error" ? (
          <span>{labels.copyError}</span>
        ) : (
          // "Copiar" y "Copiado" comparten celda: el botón mide siempre lo que la más larga,
          // así el cambio de texto no mueve nada alrededor.
          <span className="grid">
            <span
              aria-hidden={copied}
              className={cn(
                "col-start-1 row-start-1 transition duration-ui ease-smooth",
                copied && "opacity-0 motion-safe:-translate-y-2",
              )}
            >
              {labels.copy}
            </span>
            <span
              aria-hidden={!copied}
              className={cn(
                "col-start-1 row-start-1 transition duration-ui ease-smooth",
                !copied && "opacity-0 motion-safe:translate-y-2",
              )}
            >
              {labels.copied}
            </span>
          </span>
        )}
        <span className="sr-only">{state === "idle" ? `: ${email}` : ""}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? labels.copiedAnnouncement : state === "error" ? labels.copyError : ""}
      </span>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button-link";

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

export function CopyEmailButton({ email, labels }: CopyEmailButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handleClick() {
    const ok = await copyText(email);
    setState(ok ? "copied" : "error");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2500);
  }

  const text = state === "copied" ? labels.copied : state === "error" ? labels.copyError : labels.copy;

  return (
    <>
      <button type="button" onClick={handleClick} className={buttonClasses("secondary")}>
        {state === "copied" ? <CheckIcon className="size-4 text-success" /> : <CopyIcon className="size-4" />}
        <span>{text}</span>
        <span className="sr-only">{state === "idle" ? `: ${email}` : ""}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? labels.copiedAnnouncement : state === "error" ? labels.copyError : ""}
      </span>
    </>
  );
}

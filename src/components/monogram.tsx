import type { SVGProps } from "react";

/** Monograma "AV" (el mismo trazo del favicon). Decorativo: el nombre siempre aparece en texto. */
export function Monogram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      <path d="M11 45 20 19l9 26M14.3 36h11.4" stroke="#ffffff" strokeWidth="5" />
      <path d="M34 19l9 26 9-26" stroke="#22d3ee" strokeWidth="5" />
    </svg>
  );
}

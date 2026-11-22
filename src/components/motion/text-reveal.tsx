import { Fragment, type ComponentPropsWithoutRef, type CSSProperties, type ElementType } from "react";

/**
 * Parte un texto en palabras, cada una dentro de una máscara (`.word-mask` en globals.css)
 * de la que puede subir. El texto y los espacios no cambian para lectores de pantalla ni
 * al copiar. `--i` es la posición de la palabra: el CSS la multiplica por el escalonado.
 */
export function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span className="word-mask">
        <span className="word" style={{ "--i": i } as CSSProperties}>
          {word}
        </span>
      </span>
      {i < words.length - 1 ? " " : null}
    </Fragment>
  ));
}

type TextRevealProps<T extends ElementType> = {
  as?: T;
  /**
   * - `words`: cada palabra sube desde su máscara (títulos).
   * - `lines`: cada línea sube desde su máscara (párrafos). Las líneas dependen del ancho,
   *   así que las mide `RevealRuntime` justo antes de animar y después restaura el texto.
   *   En móvil el párrafo entra como un solo bloque.
   */
  by: "words" | "lines";
  /** Texto plano: es lo que permite partirlo sin tocar marcado. */
  text: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/** Texto que se revela por palabras o por líneas al entrar en pantalla. */
export function TextReveal<T extends ElementType = "span">({ as, by, text, ...props }: TextRevealProps<T>) {
  const Tag: ElementType = as ?? "span";
  return (
    <Tag data-reveal={by} {...props}>
      {by === "words" ? <SplitWords text={text} /> : text}
    </Tag>
  );
}

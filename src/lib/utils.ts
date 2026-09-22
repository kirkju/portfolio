import type { Localized, YearMonth } from "@/data/types";
import type { Locale } from "@/lib/i18n";

/** Une clases condicionales sin depender de librerías externas. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Devuelve el texto en el idioma pedido; los textos sin traducción se usan tal cual. */
export function pick<T>(value: T | Localized<T>, locale: Locale): T {
  if (typeof value === "object" && value !== null && "es" in value && "en" in value) {
    return (value as Localized<T>)[locale];
  }
  return value as T;
}

/** "2025-12" → "12/2025" */
export function formatYearMonth(value: YearMonth): string {
  const [year, month] = value.split("-");
  return `${month}/${year}`;
}

/** Ordena por año, del más reciente al más antiguo; a igual año conserva el orden del archivo. */
export function byYearDesc<T extends { year: number }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => b.year - a.year);
}

/** Serializa JSON-LD escapando `<` para que no pueda cerrar la etiqueta <script>. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

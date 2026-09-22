/**
 * Oculta la capa de desarrollo de Next.js (contador de "Issues" y avisos) en `npm run dev`.
 * En producción no se renderiza nada. Los errores siguen apareciendo en la terminal.
 * Para volver a verlos en el navegador, quita <HideDevOverlay /> del layout.
 */
export function HideDevOverlay() {
  if (process.env.NODE_ENV !== "development") return null;
  return <style>{"nextjs-portal{display:none!important}"}</style>;
}

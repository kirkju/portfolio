export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/**
 * Se ejecuta en <head> antes del primer pintado para evitar el parpadeo de tema.
 * Prioridad: preferencia guardada → `prefers-color-scheme` → oscuro (el
 * atributo que ya trae el HTML).
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

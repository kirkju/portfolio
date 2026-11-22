/**
 * Scripts en línea del movimiento. Corren mientras el navegador lee el HTML, antes del
 * primer pintado y sin esperar a React, así que funcionan aunque la hidratación falle.
 */
import { header } from "@/lib/motion";

const LANG_POSITION_KEY = "lang-position";
/** Id del script que restaura la posición; el navegador no pinta hasta haberlo leído. */
export const LANG_RESTORE_ID = "lang-restore";
/** Línea de referencia para saber "por dónde va leyendo", como fracción de la ventana. */
const READING_LINE = 0.3;
/** Una posición guardada caduca enseguida: solo sirve para la navegación en curso. */
const MAX_AGE_MS = 10_000;

/**
 * En <head>:
 * - `data-js` en <html>: el CSS distingue "hay JavaScript" de "no lo hay".
 * - `data-scrolled` en <html> tras los primeros píxeles de scroll (la barra se compacta).
 * - `data-smooth` en <html> con la primera pulsación o tecla: a partir de ahí las anclas
 *   hacen scroll suave. Antes no, para que al recargar la página no se recorra entera.
 * - Al pulsar el cambio de idioma guarda por qué sección y a qué altura iba el lector.
 *   La página nueva (ver `langRestoreScript`) se abre en ese mismo punto y sin repetir
 *   la entrada del hero, de modo que el cambio se lee como un fundido del texto.
 */
export const motionInitScript = `(function(){var d=document.documentElement,k="${LANG_POSITION_KEY}";d.setAttribute("data-js","");function s(){d.toggleAttribute("data-scrolled",window.scrollY>${header.compactAfter})}addEventListener("scroll",s,{passive:true});s();function u(){d.hasAttribute("data-smooth")||d.setAttribute("data-smooth","")}addEventListener("pointerdown",u,{passive:true});addEventListener("keydown",u,{passive:true});try{var v=JSON.parse(sessionStorage.getItem(k)||"null");if(v&&Date.now()-v.t<${MAX_AGE_MS}){d.setAttribute("data-intro","skip");var l=document.createElement("link");l.rel="expect";l.href="#${LANG_RESTORE_ID}";l.setAttribute("blocking","render");document.head.appendChild(l)}else if(v){sessionStorage.removeItem(k)}}catch(e){}addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest("a[hreflang]");if(!a||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;try{var p={t:Date.now()};if(window.scrollY>${header.compactAfter}){var y=innerHeight*${READING_LINE},q=document.querySelectorAll("main > section");for(var i=0;i<q.length;i++){var r=q[i].getBoundingClientRect();if(r.top<=y&&r.bottom>y){p.i=i;p.p=(y-r.top)/r.height;break}}}sessionStorage.setItem(k,JSON.stringify(p))}catch(e){}})})();`;

/** Al final de <body>: coloca la página nueva donde iba el lector antes de cambiar de idioma. */
export const langRestoreScript = `(function(){try{var k="${LANG_POSITION_KEY}",v=JSON.parse(sessionStorage.getItem(k)||"null");sessionStorage.removeItem(k);if(!v||v.i==null||Date.now()-v.t>${MAX_AGE_MS})return;var el=document.querySelectorAll("main > section")[v.i];if(!el)return;var r=el.getBoundingClientRect();window.scrollTo({top:window.scrollY+r.top+v.p*r.height-innerHeight*${READING_LINE},behavior:"instant"})}catch(e){}})();`;

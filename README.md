# Alejandro Vargas — CV digital

CV digital y portafolio bilingüe (ES/EN) de Alejandro Vargas, Ingeniero de Software.

**Sitio:** https://aledev-hsd0hhbzf6cvhrax.eastus2-01.azurewebsites.net/

- Next.js 16 (App Router) como **export estático**, React 19, TypeScript 6 (strict) y Tailwind CSS 4.
- Sin dependencias de UI adicionales: iconos SVG propios, i18n propio y animaciones solo con CSS.
- Tema oscuro por defecto con alternancia a claro. La preferencia se guarda y respeta `prefers-color-scheme`.
- SEO: metadatos por idioma con `hreflang`, imagen Open Graph generada con `next/og`, JSON-LD `Person`, `sitemap.xml` y `robots.txt`.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en http://localhost:3000 (redirige a `/es/`). |
| `npm run build` | Genera el sitio estático en `out/`. |
| `npm run preview` | Sirve `out/` como lo haría IIS, en http://localhost:4173. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | Comprobación de tipos de TypeScript. |
| `npm run cv:pdf` | Hace el build y regenera `public/cv/*.pdf` desde los datos del CV. |

Requisitos: Node.js 20.9 o superior (se recomienda 24). `npm run cv:pdf` requiere Node 22.18 o superior y Microsoft Edge o Google Chrome instalado.

## Estructura

```
.github/workflows/deploy.yml   CI/CD: lint, build y despliegue al App Service
public/
  cv/                          PDF del CV en ES y EN (npm run cv:pdf)
  projects/                    Imágenes de los proyectos (placeholders SVG por ahora)
  web.config                   Reglas de IIS: redirección, 404, caché, MIME y cabeceras
scripts/                       Generador de PDF y servidor local del export
src/
  app/
    (root)/                    "/" → redirige a /es/
    [lang]/                    Página por idioma: layout, page, cv/ (versión imprimible), og.png/
    global-not-found.tsx       404 bilingüe
    sitemap.ts, robots.ts      SEO
    icon.svg, favicon.ico, apple-icon.png
    globals.css                Tokens de color, tipografía y animaciones
  assets/fonts/                Geist en TTF para la imagen Open Graph
  components/                  layout/ (navbar, tema, idioma), sections/ (una por sección), ui/
  data/
    cv.ts                      ← Todo el contenido del CV (ES y EN)
    ui.ts                      Textos de la interfaz
    types.ts                   Tipos del contenido
  lib/                         i18n, tema, JSON-LD, imagen OG y utilidades
```

## Cómo editar el contenido

Todo el CV está en **`src/data/cv.ts`**. No hace falta tocar los componentes.

- Cada texto traducible es un objeto `{ es: "…", en: "…" }`.
- El orden de los arreglos es el orden en pantalla (experiencia, proyectos, publicaciones…).
- **Badge "Disponible para nuevas oportunidades":** `profile.availableForWork: true | false`.
- **Foto:** guarda un JPG cuadrado de al menos 400 × 400 px en `public/images/profile.jpg`. Aparece sola en el hero y en el JSON-LD. Si no hay foto, se muestra el monograma.
- **Capturas de proyectos:** exporta cada captura en WebP de unos 1600 × 1000 px (16:10), ya optimizada, porque el sitio no tiene optimizador de imágenes. Luego:
  1. Guárdala en `public/projects/`, con un nombre nuevo si reemplaza a otra, por la caché.
  2. Cambia `image` en el proyecto.
  3. Describe la captura en `imageAlt`.
- **Estados de proyecto:** `production`, `active`, `delivered`, `pilot` o `development`. Sin `status`, no se muestra el badge.
- **Publicaciones:** `status` es `published` o `pending`. El botón de DOI aparece solo si hay `doi` (o `url`), y el resumen solo si hay `abstract`.
- **Textos de la interfaz** (menú, botones, títulos de sección): `src/data/ui.ts`.
- **URL del sitio** (dominio propio en el futuro): `src/lib/site.ts`, o la variable `NEXT_PUBLIC_SITE_URL` al hacer el build.

Busca `TODO` en `src/data/cv.ts` para ver los datos pendientes.

### PDF del CV

El botón "Descargar CV" apunta a `public/cv/Alejandro-Vargas-CV.pdf` (ES) y `public/cv/Alejandro-Vargas-CV-EN.pdf` (EN).

- Esos PDF se generan desde `cv.ts` con `npm run cv:pdf`: el script hace el build e imprime `/es/cv/` y `/en/cv/` con Edge o Chrome headless.
- Después de cambiar el contenido, vuelve a generarlos y haz commit de `public/cv/`.
- Si prefieres tu CV diseñado, reemplaza los archivos manteniendo los nombres. **No publiques** versiones con tu teléfono ni con datos de tus referencias.

## Despliegue

Cada push a `main` ejecuta [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. `npm ci`, `npm run lint` y `npm run build`.
2. Empaqueta `out/` en un zip.
3. Lo publica en el App Service `aledev` con `azure/webapps-deploy`, autenticado con el publish profile guardado en el secreto `AZURE_WEBAPP_PUBLISH_PROFILE`.
4. `clean: true` borra `wwwroot` antes de publicar, así que no quedan archivos del sitio anterior.

Los pull requests solo hacen lint y build.

### Por qué export estático y no `standalone`

El App Service existente es **Windows** (IIS).

- En Windows, Node corre detrás de iisnode, que le pasa el puerto como un named pipe. El `server.js` de `output: "standalone"` espera un puerto numérico, así que haría falta un servidor a medida.
- Como el sitio no necesita servidor, se exporta a HTML estático e IIS lo sirve directamente: sin arranques en frío ni versión de Node que mantener en Azure.
- `public/web.config` hace el trabajo que haría el servidor:
  - redirige `/` a `/es/` y sirve la página 404;
  - declara los tipos MIME (`.woff2`, `.webp`, `.avif`);
  - aplica una caché de un año a `/_next/static` y revalidación al HTML;
  - agrega cabeceras de seguridad y quita `X-Powered-By`.

### Configuración inicial (una sola vez)

1. **Descarga el publish profile.** En el [portal de Azure](https://portal.azure.com), abre *App Services* → `aledev` → *Información general* → **Descargar perfil de publicación**. Si el botón está deshabilitado:
   1. Ve a *Configuración* → *Configuración general*.
   2. Activa **Credenciales de publicación de autenticación básica de SCM**.
   3. Guarda y vuelve a intentarlo.
2. **Crea el secreto en GitHub.** En el repositorio, ve a *Settings* → *Secrets and variables* → *Actions* → **New repository secret**. Usa el nombre `AZURE_WEBAPP_PUBLISH_PROFILE` y pega como valor el contenido completo del archivo `.PublishSettings`. También puedes hacerlo por consola:
   ```bash
   gh secret set AZURE_WEBAPP_PUBLISH_PROFILE < ruta/al/aledev.PublishSettings
   ```
   Después borra el archivo descargado: contiene credenciales. El `.gitignore` ya lo excluye.
3. **Ajustes recomendados del App Service** (*Configuración*):
   - **Solo HTTPS:** activado.
   - **Afinidad de ARR:** desactivada. Quita una cookie innecesaria en un sitio estático.
   - **Comando de inicio:** no hace falta. IIS sirve los archivos estáticos y la versión de Node del App Service ya no se usa.
4. **Publica.** Haz push a `main`, o en *Actions* → *Build and deploy* → **Run workflow**.

## Licencias

La fuente Geist (Vercel) se distribuye bajo la SIL Open Font License 1.1; ver [`src/assets/fonts/OFL.txt`](src/assets/fonts/OFL.txt).

import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { MagneticField } from "@/components/motion/deferred";
import { MotionProvider } from "@/components/motion/motion-provider";
import { RevealRuntime } from "@/components/motion/reveal-runtime";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Publications } from "@/components/sections/publications";
import { Skills } from "@/components/sections/skills";
import { Spotlight } from "@/components/spotlight";
import { ui } from "@/data/ui";
import { isLocale } from "@/lib/i18n";
import { LANG_RESTORE_ID, langRestoreScript } from "@/lib/motion-init";
import { personSchema } from "@/lib/schema";
import { jsonLd } from "@/lib/utils";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = ui[lang];

  return (
    <>
      {/* Contexto de Motion: los componentes `m` de la página cargan su motor en diferido. */}
      <MotionProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-fg"
        >
          {t.skipToContent}
        </a>
        <Navbar locale={lang} />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero locale={lang} />
          <About locale={lang} />
          <Experience locale={lang} />
          <Projects locale={lang} />
          <Publications locale={lang} />
          <Skills locale={lang} />
          <Education locale={lang} />
          <Contact locale={lang} />
        </main>
        <Footer locale={lang} />
        <Spotlight />
        <RevealRuntime />
        <MagneticField />
      </MotionProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personSchema(lang)) }} />
      {/* Tras un cambio de idioma, abre la página por donde iba el lector (ver lib/motion-init.ts). */}
      <script id={LANG_RESTORE_ID} dangerouslySetInnerHTML={{ __html: langRestoreScript }} />
    </>
  );
}

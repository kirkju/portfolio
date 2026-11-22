import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowRightIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MapPinIcon } from "@/components/icons";
import { Monogram } from "@/components/monogram";
import { HeroSpotlight } from "@/components/motion/deferred";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitWords } from "@/components/motion/text-reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { cv } from "@/data/cv";
import { ui } from "@/data/ui";
import { publicFileExists } from "@/lib/assets";
import type { Locale } from "@/lib/i18n";

/**
 * Turno de cada elemento en la entrada del hero. El CSS (`.intro` en globals.css) multiplica
 * el turno por el escalonado de los tokens, así que aquí solo se decide el orden:
 * insignia → nombre (una palabra por turno) → subtítulo → párrafo → botones → datos.
 * La foto arranca pronto y dura más: es lo último en asentarse sin retrasar el contenido.
 */
const turn = (order: number) => ({ "--turn": order }) as CSSProperties;

export function Hero({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const { profile } = cv;
  // La foto es opcional: solo aparece si el archivo existe en /public.
  const hasPhoto = publicFileExists(profile.photo);
  const [role, focus] = profile.title[locale].split(" · ");
  const nameWords = profile.name.split(" ").length;
  // Los turnos siguen al nombre: cada palabra ocupa uno.
  const afterName = 1 + nameWords;
  const socialLinks = [
    { href: profile.social.github, label: "GitHub", Icon: GitHubIcon },
    { href: profile.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  ];

  return (
    <section
      id={t.sectionIds.home}
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-28 pb-12 sm:pt-40 sm:pb-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,#000_35%,transparent_100%)]" />
        {/* Aurora: los dos resplandores derivan muy despacio (ver globals.css). */}
        <div className="aurora-a absolute -top-56 left-1/2 h-[44rem] w-[80rem] -translate-x-1/2 bg-[radial-gradient(closest-side,var(--glow),transparent)]" />
        <div className="aurora-b absolute top-16 -right-48 size-[30rem] bg-[radial-gradient(closest-side,var(--glow-accent),transparent)]" />
        {/* Luz tenue que sigue al cursor y aviva la cuadrícula a su paso (solo con ratón). */}
        <HeroSpotlight />
      </div>

      <div className="wrapper grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
        <div className="max-w-3xl">
          {profile.availableForWork ? (
            <p
              className="intro inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-fg backdrop-blur"
              style={turn(0)}
            >
              <span aria-hidden="true" className="relative flex size-2">
                <span className="ping-soft absolute inline-flex size-full rounded-full bg-success" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {t.hero.available}
            </p>
          ) : null}

          {/* El nombre sube palabra por palabra desde su máscara. */}
          <h1
            id="hero-heading"
            className="hero-name mt-7 text-5xl font-semibold tracking-tighter sm:text-6xl lg:text-7xl"
            style={turn(1)}
          >
            <SplitWords text={profile.name} />
          </h1>

          <p className="intro mt-5 text-lg font-medium text-fg sm:text-2xl" style={turn(afterName)}>
            {role}
            {focus ? (
              <>
                <span className="text-muted"> · </span>
                <span className="text-accent">{focus}</span>
              </>
            ) : null}
          </p>

          <p className="intro mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg" style={turn(afterName + 1)}>
            {profile.tagline[locale]}
          </p>

          {/* Cada botón entra en su turno y, con ratón, sigue levemente al cursor. */}
          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <ButtonLink href={`#${t.sectionIds.projects}`} className="intro" style={turn(afterName + 2)}>
                {t.actions.viewProjects}
                <ArrowRightIcon className="nudge-x size-4" />
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink
                href={`#${t.sectionIds.contact}`}
                variant="secondary"
                className="intro"
                style={turn(afterName + 2.75)}
              >
                {t.actions.contact}
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink
                href={profile.cvPdf[locale]}
                download
                variant="ghost"
                className="intro"
                style={turn(afterName + 3.5)}
              >
                <DownloadIcon className="nudge-y size-4" />
                {t.actions.downloadCv}
              </ButtonLink>
            </Magnetic>
          </div>

          <div
            className="intro mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted"
            style={turn(afterName + 4.5)}
          >
            <p className="inline-flex items-center gap-2">
              <MapPinIcon className="size-4 text-accent" />
              {profile.location[locale]}
            </p>
            <span aria-hidden="true" className="h-4 w-px bg-border" />
            <ul aria-label={t.hero.profiles} className="flex items-center gap-1">
              {socialLinks.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-9 items-center justify-center rounded-full text-muted transition duration-micro ease-smooth hover:bg-surface-2 hover:text-fg motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95"
                  >
                    <Icon className="size-[1.125rem]" />
                    <span className="sr-only">
                      {label} {t.actions.newTab}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {hasPhoto ? (
          // La foto se descubre desde el centro (clip-path) mientras la imagen se asienta a su escala.
          // `w-fit`: el recorte se calcula sobre la caja de la foto, no sobre toda la columna.
          <div className="intro-photo order-first w-fit md:order-none" style={turn(1.5)}>
            {/* Anillo de gradiente que gira lento alrededor de la foto. */}
            <div className="photo-ring relative size-28 rounded-full bg-linear-to-br from-accent/60 via-brand to-brand p-[3px] shadow-card sm:size-40 md:size-60 lg:size-72">
              <Image
                src={profile.photo}
                alt={t.hero.photoAlt}
                width={540}
                height={540}
                priority
                className="size-full rounded-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div aria-hidden="true" className="intro-photo hidden md:block" style={turn(1.5)}>
            <div className="relative grid size-60 place-items-center overflow-hidden rounded-[2.5rem] border border-white/10 bg-linear-to-br from-[#16438a] via-brand to-[#06122b] shadow-card lg:size-72">
              <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:2rem_2rem] [mask-image:radial-gradient(closest-side,#000,transparent)]" />
              <Monogram className="relative size-40 lg:size-48" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowRightIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MapPinIcon } from "@/components/icons";
import { Monogram } from "@/components/monogram";
import { ButtonLink } from "@/components/ui/button-link";
import { cv } from "@/data/cv";
import { ui } from "@/data/ui";
import { publicFileExists } from "@/lib/assets";
import type { Locale } from "@/lib/i18n";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function Hero({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const { profile } = cv;
  // La foto es opcional: solo aparece si el archivo existe en /public.
  const hasPhoto = publicFileExists(profile.photo);
  const [role, focus] = profile.title[locale].split(" · ");
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
        <div className="absolute -top-56 left-1/2 h-[44rem] w-[80rem] -translate-x-1/2 bg-[radial-gradient(closest-side,var(--glow),transparent)]" />
        <div className="absolute top-16 -right-48 size-[30rem] bg-[radial-gradient(closest-side,var(--glow-accent),transparent)]" />
      </div>

      <div className="wrapper grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
        <div className="max-w-3xl">
          {profile.availableForWork ? (
            <p className="rise inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-fg backdrop-blur">
              <span aria-hidden="true" className="relative flex size-2">
                <span className="ping-soft absolute inline-flex size-full rounded-full bg-success" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {t.hero.available}
            </p>
          ) : null}

          <h1
            id="hero-heading"
            className="rise mt-7 text-5xl font-semibold tracking-tighter sm:text-6xl lg:text-7xl"
            style={delay(60)}
          >
            {profile.name}
          </h1>

          <p className="rise mt-5 text-lg font-medium text-fg sm:text-2xl" style={delay(120)}>
            {role}
            {focus ? (
              <>
                <span className="text-muted"> · </span>
                <span className="text-accent">{focus}</span>
              </>
            ) : null}
          </p>

          <p className="rise mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg" style={delay(180)}>
            {profile.tagline[locale]}
          </p>

          <div className="rise mt-9 flex flex-wrap gap-3" style={delay(240)}>
            <ButtonLink href={`#${t.sectionIds.projects}`}>
              {t.actions.viewProjects}
              <ArrowRightIcon className="size-4" />
            </ButtonLink>
            <ButtonLink href={`#${t.sectionIds.contact}`} variant="secondary">
              {t.actions.contact}
            </ButtonLink>
            <ButtonLink href={profile.cvPdf[locale]} download variant="ghost">
              <DownloadIcon className="size-4" />
              {t.actions.downloadCv}
            </ButtonLink>
          </div>

          <div
            className="rise mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted"
            style={delay(300)}
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
                    className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
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
          <div className="rise order-first md:order-none" style={delay(120)}>
            <div className="relative size-28 rounded-full bg-linear-to-br from-accent/60 via-brand to-brand p-[3px] shadow-card sm:size-40 md:size-60 lg:size-72">
              <Image
                src={profile.photo}
                alt={t.hero.photoAlt}
                width={576}
                height={576}
                priority
                className="size-full rounded-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div aria-hidden="true" className="rise hidden md:block" style={delay(120)}>
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

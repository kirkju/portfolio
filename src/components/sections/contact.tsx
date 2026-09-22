import { CopyEmailButton } from "@/components/copy-email-button";
import { ExternalLinkIcon, GitHubIcon, LinkedInIcon, MailIcon, MapPinIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button-link";
import { Section } from "@/components/ui/section";
import { cv } from "@/data/cv";
import { ui } from "@/data/ui";
import type { Locale } from "@/lib/i18n";

export function Contact({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const { email, social, location } = cv.profile;
  const githubUser = social.github.replace(/\/+$/, "").split("/").pop();
  const profiles = [
    { href: social.linkedin, name: "LinkedIn", hint: t.contact.linkedinHint, Icon: LinkedInIcon },
    { href: social.github, name: "GitHub", hint: `@${githubUser} · ${t.contact.githubHint}`, Icon: GitHubIcon },
  ];

  return (
    <Section id={t.sectionIds.contact} index="07" title={t.contact.title} lead={t.contact.lead}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="reveal relative isolate overflow-hidden rounded-3xl border border-border bg-surface p-7 shadow-card sm:p-10">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 -z-10 size-80 bg-[radial-gradient(closest-side,var(--glow),transparent)]"
          />
          <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">{t.contact.email}</p>
          <a
            href={`mailto:${email}`}
            className="mt-3 block rounded-md text-2xl font-semibold tracking-tight break-all text-heading transition-colors hover:text-accent sm:text-4xl"
          >
            {email}
          </a>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`mailto:${email}`}>
              <MailIcon className="size-4" />
              {t.contact.write}
            </ButtonLink>
            <CopyEmailButton
              email={email}
              labels={{
                copy: t.contact.copy,
                copied: t.contact.copied,
                copiedAnnouncement: t.contact.copiedAnnouncement,
                copyError: t.contact.copyError,
              }}
            />
          </div>
        </div>

        <ul className="grid gap-4">
          {profiles.map(({ href, name, hint, Icon }) => (
            <li key={name} className="reveal">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card transition-colors hover:border-accent/50"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface-2 text-fg transition-colors group-hover:text-accent">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-heading">{name}</span>
                  <span className="block truncate text-sm text-muted">{hint}</span>
                </span>
                <ExternalLinkIcon className="ml-auto size-4 shrink-0 text-muted transition-colors group-hover:text-accent" />
                <span className="sr-only">{t.actions.newTab}</span>
              </a>
            </li>
          ))}
          <li className="reveal flex items-center gap-4 rounded-2xl border border-dashed border-border p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface-2 text-accent">
              <MapPinIcon className="size-5" />
            </span>
            <span>
              <span className="block font-medium text-heading">{location[locale]}</span>
              <span className="block text-sm text-muted">{cv.references[locale]}</span>
            </span>
          </li>
        </ul>
      </div>
    </Section>
  );
}

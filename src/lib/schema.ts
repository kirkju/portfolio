import { cv } from "@/data/cv";
import { publicFileExists } from "@/lib/assets";
import { localePath, type Locale } from "@/lib/i18n";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { pick } from "@/lib/utils";

/** Datos estructurados schema.org/Person para buscadores. */
export function personSchema(locale: Locale) {
  const { profile } = cv;
  const current = cv.experience.find((job) => !job.end);
  const university = cv.education[0];
  const [locality, country] = profile.location[locale].split(",").map((part) => part.trim());

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.name,
    url: absoluteUrl(localePath(locale)),
    jobTitle: profile.title[locale].split(" · ")[0],
    description: profile.tagline[locale],
    email: `mailto:${profile.email}`,
    ...(publicFileExists(profile.photo) ? { image: absoluteUrl(profile.photo) } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: locality,
      addressCountry: country,
    },
    sameAs: [profile.social.github, profile.social.linkedin],
    ...(current ? { worksFor: { "@type": "Organization", name: current.company } } : {}),
    ...(university ? { alumniOf: { "@type": "CollegeOrUniversity", name: university.institution } } : {}),
    knowsAbout: cv.skills.flatMap((group) => group.items.map((item) => pick(item, locale))),
    knowsLanguage: ["es", "en"],
  };
}

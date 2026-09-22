import type { Locale } from "@/lib/i18n";

/** Un valor con versión en español (`es`) y en inglés (`en`). */
export type Localized<T = string> = Readonly<Record<Locale, T>>;

/** Fecha en formato "AAAA-MM", por ejemplo "2025-12". */
export type YearMonth = `${number}-${number}`;

export type ProjectStatus = "production" | "active" | "delivered" | "pilot" | "development";

export type PublicationStatus = "published" | "pending";

export interface Profile {
  name: string;
  /** Iniciales para el monograma (foto de reemplazo, favicon, imagen OG). */
  initials: string;
  /** Formas en que tu nombre aparece como autor, para resaltarlo en las publicaciones. */
  authorNames: readonly string[];
  title: Localized;
  /** Propuesta de valor del hero (1–2 líneas). */
  tagline: Localized;
  location: Localized;
  email: string;
  /** Muestra el badge "Disponible para nuevas oportunidades". */
  availableForWork: boolean;
  /** Ruta dentro de /public. La foto solo se muestra si el archivo existe. */
  photo: string;
  /** PDF del CV por idioma, dentro de /public. */
  cvPdf: Localized;
  social: {
    github: string;
    linkedin: string;
  };
}

export interface Experience {
  role: Localized;
  company: string;
  start: YearMonth;
  /** Sin fecha de fin = puesto actual. */
  end?: YearMonth;
  highlights: Localized<readonly string[]>;
  tags?: readonly string[];
}

export interface Project {
  /** Identificador estable; también nombra la imagen en /public/projects. */
  id: string;
  title: Localized;
  /** Cliente u organización (opcional). */
  client?: Localized;
  year: number;
  /** Sin estado = no se muestra el badge. */
  status?: ProjectStatus;
  image: string;
  imageAlt: Localized;
  context: Localized;
  solution: Localized;
  result: Localized;
  features: Localized<readonly string[]>;
  stack: readonly string[];
  /** Enlace público (demo o sitio), solo si existe. */
  url?: string;
}

export interface Publication {
  id: string;
  /** Título original, tal como se publicó (en inglés). */
  title: string;
  year: number;
  location: Localized;
  /** Nombre corto del evento, por ejemplo "CISTI 2025". */
  venue?: string;
  /** Título completo de las actas o revista. */
  venueFull?: string;
  /** Editorial y serie, por ejemplo "Springer · LNNS 1717". */
  publisher?: string;
  status: PublicationStatus;
  authors?: readonly string[];
  /** DOI sin prefijo, por ejemplo "10.1109/LA-CCI66231.2025.11270447". */
  doi?: string;
  /** Enlace alternativo cuando no hay DOI. */
  url?: string;
  abstract?: Localized;
  keywords?: Localized<readonly string[]>;
}

export interface SkillGroup {
  id: "languages" | "databases" | "cloud" | "ai" | "architecture";
  title: Localized;
  items: readonly (string | Localized)[];
}

export interface Education {
  degree: Localized;
  institution: string;
  period: string;
}

export interface Certification {
  title: Localized;
  detail?: Localized;
  year: number;
}

export interface Language {
  name: Localized;
  /** Sin nivel = solo se muestra el idioma. */
  level?: Localized;
}

export interface CV {
  profile: Profile;
  about: Localized<readonly string[]>;
  experience: readonly Experience[];
  projects: readonly Project[];
  publications: readonly Publication[];
  researchAreas: readonly Localized[];
  skills: readonly SkillGroup[];
  education: readonly Education[];
  certifications: readonly Certification[];
  languages: readonly Language[];
  references: Localized;
}

"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type SyntheticEvent } from "react";
import { flushSync } from "react-dom";
import { ArrowRightIcon, CheckIcon, CloseIcon, ExternalLinkIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button-link";
import { StatusBadge, Tag, TagList, type Tone } from "@/components/ui/tag";
import type { ProjectStatus } from "@/data/types";
import { cn } from "@/lib/utils";

/** Un proyecto ya resuelto al idioma de la página (lo prepara `sections/projects.tsx`). */
export type GalleryProject = {
  id: string;
  title: string;
  client?: string;
  /** "2025 — Presente" o "2026". */
  period: string;
  status?: ProjectStatus;
  statusLabel?: string;
  tone?: Tone;
  image: string;
  imageAlt: string;
  context: string;
  solution: string;
  result: string;
  features: readonly string[];
  stack: readonly string[];
  url?: string;
};

type FilterKey = "all" | "production" | "delivered" | "progress";

export type GalleryLabels = {
  context: string;
  solution: string;
  result: string;
  features: string;
  stack: string;
  visit: string;
  details: string;
  close: string;
  previous: string;
  next: string;
  counter: string;
  showing: string;
  showingOne: string;
  swipeHint: string;
  newTab: string;
  filters: Record<FilterKey | "label", string>;
};

const FILTERS: readonly FilterKey[] = ["all", "production", "delivered", "progress"];

const GROUPS: Record<Exclude<FilterKey, "all">, readonly ProjectStatus[]> = {
  production: ["production", "active"],
  delivered: ["delivered"],
  progress: ["development", "pilot"],
};

/** Tecnologías que se ven en la tarjeta; el resto aparece en el detalle. */
const STACK_PREVIEW = 4;

function matches(project: GalleryProject, filter: FilterKey) {
  return filter === "all" || (project.status !== undefined && GROUPS[filter].includes(project.status));
}

function canAnimate() {
  return (
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Ejecuta `update` dentro de una View Transition. `kind` queda en `<html data-vt>`
 * mientras dura, para que globals.css elija la animación (filtro, abrir, cerrar,
 * siguiente, anterior). Sin soporte o con movimiento reducido, el cambio es directo.
 */
function runTransition(kind: string, update: () => void, done?: () => void) {
  if (!canAnimate()) {
    update();
    done?.();
    return;
  }
  const root = document.documentElement;
  root.dataset.vt = kind;
  document
    .startViewTransition(update)
    .finished.catch(() => {})
    .finally(() => {
      if (root.dataset.vt === kind) delete root.dataset.vt;
      done?.();
    });
}

function isOnScreen(element: Element) {
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
}

export function ProjectGallery({ projects, labels }: { projects: readonly GalleryProject[]; labels: GalleryLabels }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const mediaRefs = useRef(new Map<string, HTMLDivElement>());
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());

  const visible = projects.flatMap((project, index) => (matches(project, filter) ? [index] : []));
  const counts = Object.fromEntries(
    FILTERS.map((key) => [key, projects.filter((project) => matches(project, key)).length]),
  ) as Record<FilterKey, number>;
  const current = projects[active] ?? projects[0];

  function changeFilter(next: FilterKey) {
    if (next === filter) return;
    runTransition("filter", () => {
      flushSync(() => setFilter(next));
      listRef.current?.scrollTo({ left: 0 });
    });
  }

  // Abrir: la imagen de la tarjeta "vuela" hasta la cabecera del detalle.
  function openProject(index: number) {
    const dialog = dialogRef.current;
    const project = projects[index];
    if (!dialog || dialog.open || !project) return;
    const cardMedia = mediaRefs.current.get(project.id);
    if (cardMedia && canAnimate()) cardMedia.style.viewTransitionName = "project-media";
    runTransition("open", () => {
      if (cardMedia) cardMedia.style.viewTransitionName = "";
      flushSync(() => setActive(index));
      dialog.showModal();
      // Después de showModal: cerrado no se renderiza y el scroll no se puede reiniciar.
      scrollRef.current?.scrollTo({ top: 0 });
      closeRef.current?.focus();
    });
  }

  // Cerrar: la imagen vuelve a su tarjeta si está a la vista; si no, el detalle se desvanece.
  function closeProject() {
    const dialog = dialogRef.current;
    if (!dialog?.open || !current) return;
    const { id } = current;
    const cardMedia = mediaRefs.current.get(id);
    const trigger = triggerRefs.current.get(id);
    const onScreen = cardMedia ? isOnScreen(cardMedia) : false;
    runTransition(
      "close",
      () => {
        dialog.close();
        if (cardMedia && onScreen) cardMedia.style.viewTransitionName = "project-media";
        trigger?.focus({ preventScroll: onScreen });
      },
      () => {
        if (cardMedia) cardMedia.style.viewTransitionName = "";
      },
    );
  }

  function step(delta: 1 | -1) {
    if (visible.length < 2) return;
    const position = Math.max(0, visible.indexOf(active));
    const next = visible[(position + delta + visible.length) % visible.length];
    if (next === undefined) return;
    runTransition(delta > 0 ? "next" : "prev", () => {
      flushSync(() => setActive(next));
      scrollRef.current?.scrollTo({ top: 0 });
    });
  }

  function onDialogCancel(event: SyntheticEvent<HTMLDialogElement>) {
    // Esc: cerramos nosotros, con animación.
    event.preventDefault();
    closeProject();
  }

  function onDialogClick(event: MouseEvent<HTMLDialogElement>) {
    // Clic en el fondo oscurecido (fuera del panel).
    if (event.target === event.currentTarget) closeProject();
  }

  function onDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
  }

  const showing = visible.length === 1 ? labels.showingOne : labels.showing.replace("{count}", String(visible.length));
  const counter = labels.counter
    .replace("{current}", String(visible.indexOf(active) + 1))
    .replace("{total}", String(visible.length));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div
          role="group"
          aria-label={labels.filters.label}
          className="-mx-5 flex max-w-[calc(100%+2.5rem)] gap-1 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:max-w-full sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {FILTERS.filter((key) => counts[key] > 0).map((key) => {
            const selected = key === filter;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={selected}
                onClick={() => changeFilter(key)}
                className={cn(
                  "relative shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition duration-200 ease-smooth motion-safe:active:scale-95 sm:px-4",
                  selected
                    ? "border-transparent text-accent-fg"
                    : "border-border bg-surface/80 text-muted hover:border-accent/40 hover:text-fg",
                )}
              >
                {/* La pastilla del filtro activo se desliza al cambiar (ver globals.css). */}
                {selected ? (
                  <span aria-hidden="true" className="filter-pill absolute inset-0 rounded-full bg-accent shadow-glow" />
                ) : null}
                <span className="relative">{labels.filters[key]}</span>
                <span className={cn("relative ml-1.5 font-mono text-xs", selected ? "text-accent-fg" : "text-muted")}>
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="font-mono text-xs text-muted">
          {showing}
        </p>
      </div>

      {/* Carrusel deslizable en móvil; grid de 2 o 3 columnas desde md. */}
      <ul
        ref={listRef}
        className="project-list -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pt-1 pb-6 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:p-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, index) => (
          <li
            key={project.id}
            hidden={!matches(project, filter)}
            className="reveal flex w-[84%] shrink-0 snap-start sm:w-[58%] md:w-auto"
            style={{ "--vt-name": `project-${project.id}` } as CSSProperties}
          >
            <ProjectCard
              project={project}
              labels={labels}
              onOpen={() => openProject(index)}
              mediaRef={(node) => {
                if (node) mediaRefs.current.set(project.id, node);
                else mediaRefs.current.delete(project.id);
              }}
              triggerRef={(node) => {
                if (node) triggerRefs.current.set(project.id, node);
                else triggerRefs.current.delete(project.id);
              }}
            />
          </li>
        ))}
      </ul>
      <p aria-hidden="true" className="mt-1 flex items-center gap-2 font-mono text-xs text-muted md:hidden">
        {labels.swipeHint}
        <ArrowRightIcon className="swipe-hint size-3.5" />
      </p>

      <dialog
        ref={dialogRef}
        aria-labelledby={current ? `${current.id}-dialog-title` : undefined}
        onCancel={onDialogCancel}
        onClick={onDialogClick}
        onKeyDown={onDialogKeyDown}
        className="project-dialog fixed inset-0 m-0 size-full max-h-none max-w-none border-0 bg-transparent p-3 text-fg open:grid open:place-items-center sm:p-6"
      >
        <div className="dialog-panel relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {projects.map((project, index) => (
              <ProjectDetail key={project.id} project={project} labels={labels} hidden={index !== active} />
            ))}
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={closeProject}
            aria-label={labels.close}
            className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full border border-white/15 bg-bg/70 text-fg shadow-card backdrop-blur transition duration-300 ease-smooth hover:bg-bg motion-safe:hover:rotate-90 motion-safe:active:scale-90"
          >
            <CloseIcon className="size-5" />
          </button>

          {visible.length > 1 ? (
            <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2.5 sm:px-5">
              <button type="button" onClick={() => step(-1)} className={buttonClasses("ghost", "sm")}>
                <ArrowRightIcon className="size-4 rotate-180" />
                <span className="max-sm:sr-only">{labels.previous}</span>
              </button>
              <p className="font-mono text-xs text-muted">{counter}</p>
              <button type="button" onClick={() => step(1)} className={buttonClasses("ghost", "sm")}>
                <span className="max-sm:sr-only">{labels.next}</span>
                <ArrowRightIcon className="nudge-x size-4" />
              </button>
            </div>
          ) : null}
        </div>
      </dialog>
    </div>
  );
}

type ProjectCardProps = {
  project: GalleryProject;
  labels: GalleryLabels;
  onOpen: () => void;
  mediaRef: (node: HTMLDivElement | null) => void;
  triggerRef: (node: HTMLButtonElement | null) => void;
};

function ProjectCard({ project, labels, onOpen, mediaRef, triggerRef }: ProjectCardProps) {
  const hiddenStack = project.stack.length - STACK_PREVIEW;
  return (
    <article className="carousel-card spotlight group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition duration-300 ease-smooth hover:border-accent/50 hover:shadow-card-hover has-[button:focus-visible]:border-accent motion-safe:hover:-translate-y-1">
      <div ref={mediaRef} className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-2">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(min-width: 1152px) 352px, (min-width: 768px) 50vw, 84vw"
          className="object-cover transition duration-700 ease-smooth motion-safe:group-hover:scale-[1.06]"
        />
        {project.statusLabel && project.tone ? (
          <StatusBadge tone={project.tone} className="absolute top-3 left-3 border-white/10 bg-surface/85 backdrop-blur">
            {project.statusLabel}
          </StatusBadge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-mono text-xs text-muted">
          {project.client ? `${project.client} · ` : null}
          {project.period}
        </p>
        <h3 className="mt-2 text-lg leading-snug font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{project.solution}</p>

        <ul aria-label={labels.stack} className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, STACK_PREVIEW).map((item) => (
            <li key={item}>
              <Tag>{item}</Tag>
            </li>
          ))}
          {hiddenStack > 0 ? (
            <li>
              <Tag>+{hiddenStack}</Tag>
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          {/* El ::after del botón cubre toda la tarjeta: cualquier clic en ella abre el detalle. */}
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="dialog"
            onClick={onOpen}
            className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-accent after:absolute after:inset-0 after:rounded-2xl"
          >
            {labels.details}
            <span className="sr-only">: {project.title}</span>
            <ArrowRightIcon className="nudge-x size-4" />
          </button>
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 rounded-md text-sm text-muted transition-colors hover:text-fg"
            >
              {labels.visit}
              <ExternalLinkIcon className="nudge-xy size-3.5" />
              <span className="sr-only">{labels.newTab}</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

const narrative = ["context", "solution", "result"] as const;

function ProjectDetail({ project, labels, hidden }: { project: GalleryProject; labels: GalleryLabels; hidden: boolean }) {
  return (
    <article hidden={hidden} aria-labelledby={`${project.id}-dialog-title`}>
      <div className="dialog-media relative aspect-[2/1] overflow-hidden md:aspect-[12/5] border-b border-border bg-surface-2">
        <Image src={project.image} alt={project.imageAlt} fill sizes="(min-width: 960px) 896px, 100vw" className="object-cover" />
      </div>

      <div className="dialog-body p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-xs text-muted">
            {project.client ? `${project.client} · ` : null}
            {project.period}
          </p>
          {project.statusLabel && project.tone ? <StatusBadge tone={project.tone}>{project.statusLabel}</StatusBadge> : null}
        </div>
        <h2 id={`${project.id}-dialog-title`} className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {project.title}
        </h2>

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-10">
          <dl className="space-y-5 text-sm leading-relaxed sm:text-base">
            {narrative.map((key) => (
              <div key={key}>
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent uppercase">{labels[key]}</dt>
                <dd className="mt-1.5 text-muted">{project[key]}</dd>
              </div>
            ))}
          </dl>

          <div className="space-y-7">
            <div>
              <h3 className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">{labels.features}</h3>
              <ul className="mt-3 grid gap-2 text-sm text-fg">
                {project.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">{labels.stack}</h3>
              <TagList items={project.stack} label={labels.stack} className="mt-3" />
            </div>
            {project.url ? (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className={buttonClasses("primary", "sm")}>
                {labels.visit}
                <ExternalLinkIcon className="nudge-xy size-4" />
                <span className="sr-only">{labels.newTab}</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

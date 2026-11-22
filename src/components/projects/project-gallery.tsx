"use client";

import { AnimatePresence, useMotionValue, useReducedMotion, type PanInfo } from "motion/react";
import * as m from "motion/react-m";
import Image from "next/image";
import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
} from "react";
import { flushSync } from "react-dom";
import { ArrowRightIcon, CheckIcon, CloseIcon, ExternalLinkIcon } from "@/components/icons";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { useMotionReady } from "@/components/motion/motion-provider";
import { buttonClasses } from "@/components/ui/button-link";
import { StatusBadge, Tag, TagList, type Tone } from "@/components/ui/tag";
import { projects as projectData } from "@/data/cv";
import type { Project, ProjectStatus } from "@/data/types";
import type { Locale } from "@/lib/i18n";
import { distance, duration, ease, fullMotionQuery, spring, stagger, swipe } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

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
  present: string;
  filters: Record<FilterKey | "label", string>;
  status: Record<ProjectStatus, string>;
};

/** Un proyecto ya resuelto al idioma de la página. */
type GalleryProject = {
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

const FILTERS: readonly FilterKey[] = ["all", "production", "delivered", "progress"];

const GROUPS: Record<Exclude<FilterKey, "all">, readonly ProjectStatus[]> = {
  production: ["production", "active"],
  delivered: ["delivered"],
  progress: ["development", "pilot"],
};

const STATUS_TONE = {
  production: "success",
  active: "success",
  delivered: "accent",
  pilot: "warning",
  development: "muted",
} as const satisfies Record<ProjectStatus, Tone>;

/** Tecnologías que se ven en la tarjeta; el resto aparece en el detalle. */
const STACK_PREVIEW = 4;

/** Partes de una tarjeta que "viajan" al detalle, con el nombre de su transición. */
const SHARED_PARTS = { card: "project-dialog", media: "project-media", title: "project-title" } as const;
type SharedPart = keyof typeof SHARED_PARTS;
type CardNodes = Partial<Record<SharedPart | "trigger", HTMLElement>>;

function localize(project: Project, locale: Locale, labels: GalleryLabels): GalleryProject {
  return {
    id: project.id,
    title: project.title[locale],
    client: project.client?.[locale],
    period: project.ongoing ? `${project.year} — ${labels.present}` : String(project.year),
    status: project.status,
    statusLabel: project.status ? labels.status[project.status] : undefined,
    tone: project.status ? STATUS_TONE[project.status] : undefined,
    image: project.image,
    imageAlt: project.imageAlt[locale],
    context: project.context[locale],
    solution: project.solution[locale],
    result: project.result[locale],
    features: project.features[locale],
    stack: project.stack,
    url: project.url,
  };
}

function matches(project: GalleryProject, filter: FilterKey) {
  return filter === "all" || (project.status !== undefined && GROUPS[filter].includes(project.status));
}

/** Separa una plantilla ("{current} de {total}") alrededor de sus marcadores. */
function around(template: string, token: string): [string, string] {
  const [before = "", after = ""] = template.split(token);
  return [before, after];
}

function canAnimate() {
  return (
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Ejecuta `update` dentro de una View Transition. `kind` ("open" o "close") queda en
 * `<html data-vt>` mientras dura, para que globals.css elija la animación. Sin soporte o
 * con movimiento reducido, el cambio es directo (el detalle hace un fundido con CSS).
 */
function runTransition(kind: "open" | "close", update: () => void, done?: () => void) {
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

/** Pone (o quita) en una tarjeta los nombres que la emparejan con el detalle. */
function pair(nodes: CardNodes, on: boolean) {
  for (const part of Object.keys(SHARED_PARTS) as SharedPart[]) {
    const node = nodes[part];
    if (node) node.style.viewTransitionName = on ? SHARED_PARTS[part] : "";
  }
}

type Animate = (typeof import("@/components/motion/animate"))["animate"];
let animateLoader: Promise<Animate> | undefined;

/** `animate()` de Motion, pedido la primera vez que se abre un detalle (va en un chunk diferido). */
function loadAnimate() {
  animateLoader ??= import("@/components/motion/animate").then((module) => module.animate);
  return animateLoader;
}

function isOnScreen(element: Element) {
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
}

export function ProjectGallery({ locale, labels }: { locale: Locale; labels: GalleryLabels }) {
  // Los datos se importan de cv.ts: así el HTML no los lleva dos veces (marcado y props).
  const projects = useMemo(() => projectData.map((project) => localize(project, locale, labels)), [locale, labels]);

  const [filter, setFilter] = useState<FilterKey>("all");
  /** Proyecto cuyo detalle está en pantalla. */
  const [active, setActive] = useState(0);
  /** Proyecto pedido con anterior/siguiente: el contador lo sigue al instante. */
  const [wanted, setWanted] = useState(0);
  /** `opening`: el contenido del detalle entra en cascada. `browsing`: ya se cambió de proyecto. */
  const [phase, setPhase] = useState<"idle" | "opening" | "browsing">("idle");

  const listRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardNodes = useRef(new Map<string, CardNodes>());
  /** Estado de la navegación dentro del detalle, fuera de React para no perder pulsaciones. */
  const browse = useRef({ shown: 0, wanted: 0, direction: 1, running: false });

  const motionReady = useMotionReady();
  const reduceMotion = useReducedMotion();
  // En escritorio (grid) las tarjetas se reordenan con animación; el carrusel móvil va más ligero.
  const isGrid = useMediaQuery(fullMotionQuery);
  // Posición y opacidad del contenido del detalle: las mueven el dedo y `animate()`.
  const slideX = useMotionValue(0);
  const slideOpacity = useMotionValue(1);

  const visible = projects.flatMap((project, index) => (matches(project, filter) ? [index] : []));
  const counts = Object.fromEntries(
    FILTERS.map((key) => [key, projects.filter((project) => matches(project, key)).length]),
  ) as Record<FilterKey, number>;
  const current = projects[active] ?? projects[0];

  function register(id: string, part: keyof CardNodes) {
    return (node: HTMLElement | null) => {
      const nodes = cardNodes.current.get(id) ?? {};
      if (node) nodes[part] = node;
      else delete nodes[part];
      cardNodes.current.set(id, nodes);
    };
  }

  function changeFilter(next: FilterKey) {
    if (next === filter) return;
    flushSync(() => setFilter(next));
    listRef.current?.scrollTo({ left: 0 });
  }

  // Abrir: la tarjeta crece hasta ser el detalle; su imagen y su título viajan a su nuevo sitio.
  function openProject(index: number) {
    const dialog = dialogRef.current;
    const project = projects[index];
    if (!dialog || dialog.open || !project) return;
    const nodes = cardNodes.current.get(project.id) ?? {};
    browse.current = { shown: index, wanted: index, direction: 1, running: false };
    slideX.jump(0);
    slideOpacity.jump(1);
    if (motionReady) void loadAnimate();
    if (canAnimate()) pair(nodes, true);
    runTransition("open", () => {
      pair(nodes, false);
      flushSync(() => {
        setActive(index);
        setWanted(index);
        setPhase("opening");
      });
      dialog.showModal();
      // Después de showModal: cerrado no se renderiza y el scroll no se puede reiniciar.
      scrollRef.current?.scrollTo({ top: 0 });
      closeRef.current?.focus();
    });
  }

  // Cerrar: el detalle vuelve a su tarjeta si está a la vista; si no, se desvanece.
  function closeProject() {
    const dialog = dialogRef.current;
    const project = projects[browse.current.shown];
    if (!dialog?.open || !project) return;
    const nodes = cardNodes.current.get(project.id) ?? {};
    const onScreen = nodes.card ? isOnScreen(nodes.card) : false;
    runTransition(
      "close",
      () => {
        dialog.close();
        flushSync(() => setPhase("idle"));
        if (onScreen) pair(nodes, true);
        nodes.trigger?.focus({ preventScroll: onScreen });
      },
      () => pair(nodes, false),
    );
  }

  /**
   * Cambia de proyecto dentro del detalle: el contenido sale hacia un lado y el nuevo
   * entra desde el otro con el spring del sistema. Si llegan varias pulsaciones seguidas,
   * el contador avanza con cada una y el contenido salta directo al último pedido.
   */
  async function showWanted() {
    const state = browse.current;
    if (state.running) return;
    state.running = true;
    // Sin el motor cargado el cambio es directo. Con movimiento reducido, solo un fundido.
    const animate = motionReady ? await loadAnimate() : null;
    const shift = reduceMotion ? 0 : distance.lg;
    while (state.shown !== state.wanted) {
      const direction = state.direction;
      if (animate) {
        const leave = { duration: duration.micro, ease: ease.inOut };
        await Promise.all([
          animate(slideX, slideX.get() - direction * shift, leave),
          animate(slideOpacity, 0, leave),
        ]);
      }
      const next = state.wanted;
      flushSync(() => setActive(next));
      state.shown = next;
      scrollRef.current?.scrollTo({ top: 0 });
      if (animate) {
        slideX.jump(direction * shift);
        void animate(slideX, 0, spring.soft);
        void animate(slideOpacity, 1, { duration: duration.ui, ease: ease.out });
      }
    }
    state.running = false;
  }

  function step(delta: 1 | -1) {
    if (visible.length < 2) return;
    const state = browse.current;
    const from = Math.max(0, visible.indexOf(state.wanted));
    const next = visible[(from + delta + visible.length) % visible.length];
    if (next === undefined) return;
    state.wanted = next;
    state.direction = delta;
    setWanted(next);
    setPhase("browsing");
    void showWanted();
  }

  // Táctil: el contenido sigue al dedo con resistencia; al soltar, pasa de proyecto si se
  // arrastró o se lanzó lo suficiente y, si no, vuelve a su sitio con el spring.
  function canSwipe(event: PointerEvent) {
    return event.pointerType !== "mouse" && visible.length > 1 && !browse.current.running && !reduceMotion;
  }

  function onPan(event: PointerEvent, info: PanInfo) {
    if (!canSwipe(event)) return;
    if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) slideX.set(info.offset.x * swipe.resistance);
  }

  async function onPanEnd(event: PointerEvent, info: PanInfo) {
    if (!canSwipe(event)) return;
    const horizontal = Math.abs(info.offset.x) > Math.abs(info.offset.y);
    const far = Math.abs(info.offset.x) > swipe.offset || Math.abs(info.velocity.x) > swipe.velocity;
    if (horizontal && far) {
      step(info.offset.x < 0 ? 1 : -1);
      return;
    }
    // No llegó: vuelve a su sitio con el spring, partiendo de la velocidad del dedo.
    const animate = await loadAnimate();
    void animate(slideX, 0, { ...spring.soft, velocity: info.velocity.x * swipe.resistance });
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
  // El número rueda aparte; el resto del texto ("proyectos") se queda quieto.
  const showingNoun = showing.replace(String(visible.length), "");
  const position = Math.max(0, visible.indexOf(wanted)) + 1;
  const [counterBefore, counterRest] = around(labels.counter, "{current}");
  const counterAfter = counterRest.replace("{total}", String(visible.length));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        {/* `layoutScroll`: en móvil esta fila se desplaza, y la pastilla debe medirse con ese scroll. */}
        <m.div
          layoutScroll
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
                  "relative shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition duration-ui ease-smooth motion-safe:active:scale-95 sm:px-4",
                  selected
                    ? "border-transparent text-accent-fg"
                    : "border-border bg-surface/80 text-muted hover:border-accent/40 hover:text-fg",
                )}
              >
                {/* Una sola pastilla compartida: al cambiar de filtro se desliza hasta el nuevo. */}
                {selected ? (
                  <m.span
                    layoutId="filter-pill"
                    aria-hidden="true"
                    transition={spring.soft}
                    className="absolute inset-0 rounded-full bg-accent shadow-glow"
                  />
                ) : null}
                {/* `z-10`: los textos quedan siempre por encima de la pastilla mientras pasa sobre otros filtros. */}
                <span className="relative z-10">{labels.filters[key]}</span>
                <span
                  className={cn(
                    "relative z-10 ml-1.5 font-mono text-xs transition-colors duration-ui",
                    selected ? "text-accent-fg" : "text-muted",
                  )}
                >
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </m.div>
        <p className="font-mono text-xs text-muted">
          <span aria-live="polite" className="sr-only">
            {showing}
          </span>
          <span aria-hidden="true">
            <AnimatedNumber value={visible.length} />
            {showingNoun}
          </span>
        </p>
      </div>

      {/* Carrusel deslizable en móvil; grid de 2 o 3 columnas desde md. Al filtrar, las tarjetas
          que se quedan se recolocan (`layout`) y las que salen o entran lo hacen con un fundido. */}
      <ul
        ref={listRef}
        data-reveal-scope=""
        className="project-list relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pt-1 pb-6 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:p-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((index, order) => {
            const project = projects[index];
            if (!project) return null;
            return (
              <m.li
                key={project.id}
                layout={isGrid}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: duration.ui, ease: ease.out, delay: order * stagger.fast },
                }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: duration.micro, ease: ease.inOut } }}
                transition={{ layout: spring.soft }}
                className="flex w-[84%] shrink-0 snap-start sm:w-[58%] md:w-auto"
              >
                {/* La entrada con el scroll va en su propia capa: no se mezcla con la animación de filtrado. */}
                <div data-reveal="up" className="flex w-full">
                  <ProjectCard project={project} labels={labels} onOpen={() => openProject(index)} register={register} />
                </div>
              </m.li>
            );
          })}
        </AnimatePresence>
      </ul>
      <p aria-hidden="true" className="mt-1 flex items-center gap-2 font-mono text-xs text-muted md:hidden">
        {labels.swipeHint}
        <ArrowRightIcon className="swipe-hint size-3.5" />
      </p>

      <dialog
        ref={dialogRef}
        data-phase={phase}
        aria-labelledby={current ? `${current.id}-dialog-title` : undefined}
        onCancel={onDialogCancel}
        onClick={onDialogClick}
        onKeyDown={onDialogKeyDown}
        className="project-dialog fixed inset-0 m-0 size-full max-h-none max-w-none border-0 bg-transparent p-3 text-fg open:grid open:place-items-center sm:p-6"
      >
        <div className="dialog-panel relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-x-clip overflow-y-auto overscroll-contain">
            {/* Todos los detalles están siempre en el HTML; solo se muestra el activo. */}
            <m.div
              style={{ x: slideX, opacity: slideOpacity }}
              onPan={onPan}
              onPanEnd={onPanEnd}
              className="touch-pan-y"
            >
              {projects.map((project, index) => (
                <ProjectDetail key={project.id} project={project} labels={labels} hidden={index !== active} />
              ))}
            </m.div>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={closeProject}
            aria-label={labels.close}
            className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full border border-white/15 bg-bg/70 text-fg shadow-card backdrop-blur transition duration-ui ease-smooth hover:bg-bg motion-safe:hover:rotate-90 motion-safe:active:scale-90"
          >
            <CloseIcon className="size-5" />
          </button>

          {visible.length > 1 ? (
            <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2.5 sm:px-5">
              <button type="button" onClick={() => step(-1)} className={buttonClasses("ghost", "sm")}>
                <ArrowRightIcon className="nudge-back size-4 rotate-180" />
                <span className="max-sm:sr-only">{labels.previous}</span>
              </button>
              <p className="font-mono text-xs text-muted">
                <span className="sr-only">
                  {counterBefore}
                  {position}
                  {counterAfter}
                </span>
                <span aria-hidden="true">
                  {counterBefore}
                  <AnimatedNumber value={position} />
                  {counterAfter}
                </span>
              </p>
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
  register: (id: string, part: keyof CardNodes) => (node: HTMLElement | null) => void;
};

function ProjectCard({ project, labels, onOpen, register }: ProjectCardProps) {
  const hiddenStack = project.stack.length - STACK_PREVIEW;
  return (
    <article
      ref={register(project.id, "card")}
      className="carousel-card spotlight group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition duration-ui ease-smooth hover:border-accent/50 hover:shadow-card-hover has-[button:focus-visible]:border-accent motion-safe:hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] border-b border-border bg-surface-2">
        {/* Solo la imagen viaja al detalle; la insignia de estado se queda en la tarjeta. */}
        <div ref={register(project.id, "media")} className="absolute inset-0 overflow-hidden">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(min-width: 1152px) 352px, (min-width: 768px) 50vw, 84vw"
            className="object-cover transition duration-enter ease-smooth motion-safe:group-hover:scale-[1.06]"
          />
        </div>
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
        <h3 ref={register(project.id, "title")} className="mt-2 text-lg leading-snug font-semibold tracking-tight">
          {project.title}
        </h3>
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
            ref={register(project.id, "trigger")}
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
              className="relative z-10 inline-flex items-center gap-1.5 rounded-md text-sm text-muted transition-colors duration-micro hover:text-fg"
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

/** Turno de cada bloque del detalle en la cascada de entrada (ver `data-enter` en globals.css). */
const enter = (order: number) => ({ "data-enter": "", style: { "--i": order } as CSSProperties });

function ProjectDetail({ project, labels, hidden }: { project: GalleryProject; labels: GalleryLabels; hidden: boolean }) {
  return (
    <article hidden={hidden} aria-labelledby={`${project.id}-dialog-title`}>
      <div className="dialog-media relative aspect-[2/1] overflow-hidden border-b border-border bg-surface-2 md:aspect-[12/5]">
        <Image src={project.image} alt={project.imageAlt} fill sizes="(min-width: 960px) 896px, 100vw" className="object-cover" />
      </div>

      <div className="dialog-body p-6 sm:p-10">
        <div {...enter(0)} className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-xs text-muted">
            {project.client ? `${project.client} · ` : null}
            {project.period}
          </p>
          {project.statusLabel && project.tone ? <StatusBadge tone={project.tone}>{project.statusLabel}</StatusBadge> : null}
        </div>
        <h2 id={`${project.id}-dialog-title`} className="dialog-title mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {project.title}
        </h2>

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-10">
          <dl className="space-y-5 text-sm leading-relaxed sm:text-base">
            {narrative.map((key, index) => (
              <div key={key} {...enter(1 + index)}>
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent uppercase">{labels[key]}</dt>
                <dd className="mt-1.5 text-muted">{project[key]}</dd>
              </div>
            ))}
          </dl>

          <div className="space-y-7">
            <div {...enter(2)}>
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
            <div {...enter(3)}>
              <h3 className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">{labels.stack}</h3>
              <TagList items={project.stack} label={labels.stack} className="mt-3" />
            </div>
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                {...enter(4)}
                className={buttonClasses("primary", "sm")}
              >
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

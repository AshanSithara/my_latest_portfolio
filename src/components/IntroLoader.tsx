"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./IntroLoader.module.css";

gsap.registerPlugin(useGSAP);

declare global {
  interface Window { __introPlay?: boolean; __introFailsafe?: number }
}

/*
 * Intro sequence that "builds" the REAL homepage. Nothing is duplicated: the page is mounted from the first paint,
 * an inline script in layout.tsx adds `html.intro-active` before hydration (CSS in globals.css hides the hero
 * elements with visibility only, so there is no layout shift), and this component moves virtual cursors to the
 * measured positions of the real elements and reveals each one with GSAP.
 *
 * Desktop (ReferenceHero) and mobile (legacy hero) selectors live side by side; whichever hero is hidden at the
 * current breakpoint has no client rects and is skipped automatically.
 */
const CURSORS = [
  { label: "Cloud", color: "#37d8f5" },
  { label: "DevOps", color: "#8b7aff" },
  { label: "AI", color: "#b184ff" },
  { label: "Infra", color: "#618ffb" },
];

type Kind = "fade" | "text" | "pop" | "visual";
const GROUPS: { sel: string; kind: Kind }[] = [
  { kind: "fade", sel: ".reference-live-brand, .reference-live-nav a, .reference-live-header-actions, .site-header .brand, .site-header .nav-links a, .site-header .header-cta, .site-header .menu-toggle" },
  { kind: "text", sel: ".reference-live-eyebrow, .legacy-hero .availability, .legacy-hero .hero-eyebrow" },
  { kind: "text", sel: ".reference-live-copy h1 > span, .legacy-hero h1" },
  { kind: "text", sel: ".reference-live-disciplines, .legacy-hero .hero-intro" },
  { kind: "pop", sel: ".reference-live-actions a, .legacy-hero .hero-actions a" },
  { kind: "visual", sel: ".interactive-hero" }, // mobile portrait / 3D scene (desktop portrait lives in the hero artwork)
  { kind: "pop", sel: ".reference-live-metrics > div, .legacy-hero .hero-micro span" },
];
const CARD_SEL = ".hero-brand-card, .domain-detail, .domain-tabs button, .mobile-tech-list button";
const SLOT_SEL = ".reference-tool"; // transparent hit areas exactly over the technology cards in the desktop artwork

const FROM: Record<Kind, gsap.TweenVars> = {
  fade: { autoAlpha: 0, y: -8 },
  text: { autoAlpha: 1, clipPath: "inset(0% 100% 0% 0%)" },
  pop: { autoAlpha: 0, scale: 0.88, y: 10 },
  visual: { autoAlpha: 0, scale: 0.96 },
};
const TO: Record<Kind, gsap.TweenVars> = {
  fade: { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
  text: { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power2.inOut" },
  pop: { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.7)" },
  visual: { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out" },
};
const SLOT_ON = "rgba(7,24,51,1)";
const SLOT_OFF = "rgba(7,24,51,0)";
const NO_GLOW = "0 0 0px 0px rgba(28,194,255,0)";

const MOVE = 0.5;  // first travel to a step
const HOP = 0.11;  // sweep between items of one group
const GAP = 0.42;  // spacing between consecutive steps
const CARD_HOP = 0.26;

type Pt = { x: number; y: number };
type Step = { pts: Pt[]; reveal: (i: number, at: number) => void; hop?: number; clickEach?: boolean };

export default function IntroLoader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const finishRef = useRef<() => void>(() => {});

  useGSAP((ctx, contextSafe) => {
    if (!window.__introPlay || !contextSafe || !root.current) { setDone(true); return; }
    window.clearTimeout(window.__introFailsafe);
    const html = document.documentElement;
    html.classList.add("intro-active"); // re-applied for StrictMode's second effect run

    const vw = window.innerWidth, vh = window.innerHeight;
    const inView = (el: Element) => {
      if (!el.getClientRects().length) return false;
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
    };
    const pick = (sel: string) => gsap.utils.toArray<HTMLElement>(sel).filter(inView);
    const center = (el: Element): Pt => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

    // Measure everything up front, before any transform is applied.
    const groups = GROUPS.map((g) => ({ ...g, els: pick(g.sel) }));
    const cards = pick(CARD_SEL);
    const slots = pick(SLOT_SEL);
    const heroEl = document.querySelector<HTMLElement>(".reference-hero");
    const hero = heroEl && inView(heroEl) ? heroEl : null;
    const heroRect = hero?.getBoundingClientRect();
    const art = (fx: number, fy: number): Pt => ({ x: heroRect!.left + heroRect!.width * fx, y: heroRect!.top + heroRect!.height * fy });

    const elTargets = [...groups.flatMap((g) => g.els), ...cards];
    const textTargets = groups.filter((g) => g.kind === "text").flatMap((g) => g.els);

    const cursorEls = gsap.utils.toArray<HTMLElement>(`.${styles.cursor}`, root.current);
    const ripples = gsap.utils.toArray<HTMLElement>(`.${styles.ripple}`, root.current);
    const n = vw < 600 ? 3 : 4;
    const active = cursorEls.slice(0, n);
    const starts: Pt[] = [{ x: -40, y: vh * 0.25 }, { x: vw + 40, y: vh * 0.15 }, { x: vw + 40, y: vh + 40 }, { x: -40, y: vh + 40 }];
    active.forEach((c, i) => gsap.set(c, { x: starts[i].x, y: starts[i].y, autoAlpha: 0 }));

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(active, { autoAlpha: 1, duration: 0.3, stagger: 0.06 }, 0.1);

    const click = (ci: number, p: Pt, at: number) => {
      tl.to(active[ci].firstElementChild, { scale: 0.78, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" }, at)
        .fromTo(ripples[ci], { x: p.x, y: p.y, scale: 0, autoAlpha: 0.9 }, { scale: 1, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, at);
    };
    // Travel a cursor across a step's points; returns the time it arrives at the last one.
    const visit = (ci: number, s: Step, firstAt: number) => {
      const hop = s.hop ?? HOP;
      let t = firstAt;
      s.pts.forEach((p, i) => {
        const dur = i === 0 ? MOVE : hop;
        const c = active[ci]; // flip the label left near the right edge (e.g. the mobile menu button) so it is not clipped
        tl.to(c, { x: p.x, y: p.y, duration: dur, ease: i === 0 ? "power3.inOut" : "power1.inOut", onStart: () => c.toggleAttribute("data-flip", p.x > vw - 90) }, t - dur);
        if (i === 0 || s.clickEach) click(ci, p, t);
        s.reveal(i, t + 0.03);
        t += hop;
      });
      return t - hop;
    };
    const elStep = (els: HTMLElement[], kind: Kind, extra?: Partial<Step>): Step => ({
      pts: els.map(center),
      reveal: (i, at) => { tl.fromTo(els[i], FROM[kind], { ...TO[kind] }, at); },
      ...extra,
    });

    const steps: Step[] = [];
    groups.forEach((g, gi) => {
      if (g.els.length) steps.push(elStep(g.els, g.kind));
      if (gi === 4 && hero) { // right after the hero buttons
        // Desktop portrait is part of the hero artwork: open a spotlight on it through the veil.
        steps.push({ pts: [art(0.68, 0.3)], reveal: (_, at) => { tl.to(hero, { "--intro-r": "22vw", duration: 0.8, ease: "power2.out" }, at); } });
      }
    });
    if (hero) {
      // Dashboards on either side, then the whole artwork (technology cards stay as empty slots until clicked).
      steps.push({ pts: [art(0.52, 0.24), art(0.88, 0.25)], hop: 0.35, reveal: (i, at) => { if (!i) tl.to(hero, { "--intro-r": "130vw", duration: 1.1, ease: "power2.inOut" }, at); } });
    }

    const free = active.map(() => 0);
    let clock = 0.75;
    steps.forEach((s, k) => {
      const ci = k % n;
      const at = Math.max(clock, free[ci] + MOVE);
      free[ci] = visit(ci, s, at) + 0.15;
      clock = at + GAP;
    });

    // Technology cards: every cursor takes a contiguous chunk and clicks each card in it.
    const cardStep = (els: HTMLElement[], reveal: (el: HTMLElement, at: number) => void) => {
      const size = Math.ceil(els.length / n);
      active.forEach((_, ci) => {
        const chunk = els.slice(ci * size, ci * size + size);
        if (!chunk.length) return;
        const at = Math.max(clock, free[ci] + MOVE) + ci * 0.08;
        free[ci] = visit(ci, { pts: chunk.map(center), hop: CARD_HOP, clickEach: true, reveal: (i, t) => reveal(chunk[i], t) }, at) + 0.15;
      });
    };
    if (slots.length) cardStep(slots, (el, at) => {
      tl.fromTo(el, { backgroundColor: SLOT_ON, boxShadow: NO_GLOW }, { backgroundColor: SLOT_OFF, borderColor: "rgba(118,199,255,0.72)", boxShadow: "0 0 25px 0px rgba(28,194,255,0.67)", duration: 0.3, ease: "power2.out" }, at)
        .to(el, { borderColor: "rgba(118,199,255,0)", boxShadow: NO_GLOW, duration: 0.5, ease: "power1.out" }, at + 0.3);
    });
    if (cards.length) cardStep(cards, (el, at) => { tl.fromTo(el, FROM.pop, { ...TO.pop }, at); });

    const end = Math.max(...free, clock) + 0.2;
    tl.to(active, { autoAlpha: 0, y: "+=24", duration: 0.35, stagger: 0.05 }, end);

    let finished = false;
    const cleanup = () => {
      window.__introPlay = false;
      html.classList.remove("intro-active");
      gsap.set(elTargets, { clearProps: "opacity,visibility,transform,clipPath" });
      if (slots.length) gsap.set(slots, { clearProps: "backgroundColor,borderColor,boxShadow" });
      hero?.style.removeProperty("--intro-r");
      removeListeners();
      ctx.kill(false); // keep the cleared state; never revert back to hidden
      setDone(true);
    };
    tl.call(() => { finished = true; cleanup(); }, [], end + 0.55);

    // Skip (button, Escape, any scroll/tap/key, or a resize that invalidates measured positions).
    const finish = contextSafe(() => {
      if (finished) return;
      finished = true;
      tl.kill();
      const out = gsap.timeline({ onComplete: cleanup, defaults: { duration: 0.3, ease: "power1.out", overwrite: true } });
      out.to([...active, ...ripples], { autoAlpha: 0, duration: 0.2 }, 0)
        .to(elTargets, { autoAlpha: 1, y: 0, scale: 1 }, 0);
      if (textTargets.length) out.to(textTargets, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" }, 0);
      if (slots.length) out.to(slots, { backgroundColor: SLOT_OFF, borderColor: "rgba(118,199,255,0)", boxShadow: NO_GLOW }, 0);
      if (hero) out.to(hero, { "--intro-r": "130vw", duration: 0.4 }, 0);
    });
    finishRef.current = finish;

    const onKey = (e: KeyboardEvent) => { if (e.key !== "Tab" && e.key !== "Shift") finish(); };
    const onPointer = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) finish(); };
    const lastW = window.innerWidth; // ignore height-only resizes (mobile address bar); width/orientation changes skip
    const onResize = () => { if (window.innerWidth !== lastW) finish(); };
    const events: [string, EventListener][] = [["wheel", finish], ["touchmove", finish], ["resize", onResize], ["orientationchange", finish], ["keydown", onKey as EventListener], ["pointerdown", onPointer as EventListener]];
    events.forEach(([type, fn]) => window.addEventListener(type, fn, { passive: true }));
    const removeListeners = () => events.forEach(([type, fn]) => window.removeEventListener(type, fn));

    return () => removeListeners(); // useGSAP reverts the context on unmount (e.g. StrictMode re-run)
  }, []);

  if (done) return null;

  return (
    <div ref={root} className={styles.layer}>
      {CURSORS.map((c) => (
        <div key={c.label} className={styles.cursor} aria-hidden="true">
          <div className={styles.cursorInner}>
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 2l16 9.5-7 1.6-3.6 6.9z" fill={c.color} stroke="#070d1b" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            <span style={{ background: c.color }}>{c.label}</span>
          </div>
        </div>
      ))}
      {CURSORS.map((c) => <span key={c.label} className={styles.ripple} style={{ borderColor: c.color }} aria-hidden="true" />)}
      <button type="button" className={styles.skip} onClick={() => finishRef.current()}>Skip intro</button>
    </div>
  );
}

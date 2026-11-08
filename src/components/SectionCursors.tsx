"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./IntroLoader.module.css"; // reuse the intro's cursor + ripple look

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Scroll-triggered continuation of the hero intro. When a section first reaches "top 80%", a few virtual cursors
 * travel to its REAL headings, cards, images and buttons (measured with getBoundingClientRect at the moment each
 * move starts) and each element fades/slides in as it is "clicked". Only opacity and a small translateY are touched
 * (opacity only for elements that already run CSS animations), nothing is hidden from clicks, and all inline styles
 * are cleared when a section finishes. Sections play once per page load; a reload resets everything.
 */
const CURSORS = [
  { label: "Cloud", color: "#37d8f5" },
  { label: "DevOps", color: "#8b7aff" },
  { label: "AI", color: "#b184ff" },
  { label: "Infra", color: "#618ffb" },
];

// Ordered reveal groups per section (selectors are scoped to the section). Motion <Reveal> wrappers are never
// targeted directly, only elements inside them, so the existing motion animations are left alone.
const SECTIONS: { id: string; groups: string[] }[] = [
  { id: "about", groups: [".af-eyebrow", ".af-copy h2", ".af-copy .af-description, .af-capabilities > div", ".af-link", ".af-portrait", ".af-float, .af-nameplate", ".af-journey-heading, .af-stop, .af-career-detail", ".af-stats > div"] },
  { id: "expertise", groups: [".section-heading", ".expertise-card"] },
  { id: "projects", groups: [".section-heading-row", ".project-card"] },
  { id: "experience", groups: [".section-heading, .body-copy", ".timeline-entry"] },
  { id: "certifications", groups: [".section-heading", ".cert-card"] },
  { id: "contact", groups: [".contact-text > :not(.contact-actions)", ".contact-actions a"] },
];

const MOVE = 0.4; // travel to a new target
const HOP = 0.14; // drift between items of the same group
const SPREAD = 1.3; // seconds over which a section's visits are spread (keeps each section ~1.5-2.5s)

export default function SectionCursors() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const html = document.documentElement;
      let teardown: (() => void) | undefined;
      let mo: MutationObserver | undefined;
      // Wait for the hero intro to hand off so the two never overlap.
      if (html.classList.contains("intro-active")) {
        mo = new MutationObserver(() => {
          if (html.classList.contains("intro-active")) return;
          mo?.disconnect(); mo = undefined;
          teardown = setup(root.current!);
        });
        mo.observe(html, { attributes: true, attributeFilter: ["class"] });
      } else teardown = setup(root.current!);
      return () => { mo?.disconnect(); teardown?.(); };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, zIndex: 90, pointerEvents: "none" }}>
      {SECTIONS.map(({ id }) => (
        <div key={id} data-sc={id}>
          {CURSORS.map((c) => (
            <div key={c.label} className={styles.cursor}>
              <div className={styles.cursorInner}>
                <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 2l16 9.5-7 1.6-3.6 6.9z" fill={c.color} stroke="#070d1b" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                <span style={{ background: c.color }}>{c.label}</span>
              </div>
            </div>
          ))}
          {CURSORS.map((c) => <span key={c.label} className={styles.ripple} style={{ borderColor: c.color }} />)}
        </div>
      ))}
    </div>
  );
}

function setup(layer: HTMLElement) {
  const finishers: (() => void)[] = [];

  SECTIONS.forEach(({ id, groups }) => {
    const section = document.getElementById(id);
    // Missing, or already on screen (e.g. reload on a #hash): leave it exactly as it is.
    if (!section || section.getBoundingClientRect().top < window.innerHeight * 0.8) return;

    const gEls = groups.map((sel) => gsap.utils.toArray<HTMLElement>(sel, section).filter((el) => el.getClientRects().length));
    const all = gEls.flat();
    if (!all.length) return;
    gsap.set(all, { opacity: 0 }); // opacity only: still clickable/focusable, no layout change

    const box = layer.querySelector<HTMLElement>(`[data-sc="${id}"]`)!;
    const cursorEls = gsap.utils.toArray<HTMLElement>(`.${styles.cursor}`, box);
    const ripples = gsap.utils.toArray<HTMLElement>(`.${styles.ripple}`, box);
    let tl: gsap.core.Timeline | undefined;
    let finished = false;
    let st: ScrollTrigger | undefined;

    const finish = () => {
      if (finished) return;
      finished = true;
      tl?.kill();
      st?.kill();
      gsap.set(all, { clearProps: "opacity,transform,transition" });
      gsap.set([...cursorEls, ...ripples], { autoAlpha: 0 });
      section.removeEventListener("focusin", finish);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", finish);
    };
    // A width change / rotation makes measured paths stale: settle immediately. Height-only resizes (mobile address
    // bar showing/hiding while scrolling) are ignored so they don't cancel the animation.
    let lastW = window.innerWidth;
    const onResize = () => { if (window.innerWidth === lastW) return; lastW = window.innerWidth; if (tl) finish(); };

    const play = () => {
      const r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) { finish(); return; } // jumped past it (nav link)
      tl = build(gEls, cursorEls, ripples, finish);
    };

    st = ScrollTrigger.create({ trigger: section, start: "clamp(top 80%)", once: true, onEnter: play });
    section.addEventListener("focusin", finish); // keyboard users get the content instantly
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", finish);
    finishers.push(finish);
  });

  // Lazy images / late layout changes move section offsets: keep trigger positions accurate.
  let raf = 0;
  const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => ScrollTrigger.refresh()); });
  ro.observe(document.body);

  return () => { ro.disconnect(); cancelAnimationFrame(raf); finishers.forEach((f) => f()); };
}

function build(gEls: HTMLElement[][], cursorEls: HTMLElement[], ripples: HTMLElement[], onDone: () => void) {
  const vw = document.documentElement.clientWidth, vh = window.innerHeight, sy = window.scrollY;
  const n = vw < 600 ? 3 : 4;
  const cs = cursorEls.slice(0, n);

  // Document coordinates of a target, measured lazily when the move starts. x is clamped so the cursor label
  // never creates horizontal overflow.
  const pt = (el: HTMLElement) => {
    const b = el.getBoundingClientRect();
    return { x: gsap.utils.clamp(8, vw - 100, b.left + window.scrollX + Math.min(b.width / 2, 90)), y: b.top + window.scrollY + Math.min(b.height / 2, 60) };
  };
  // Elements that already run a CSS animation (e.g. floating About cards) only get an opacity fade.
  const canMove = (el: HTMLElement) => getComputedStyle(el).animationName === "none";

  // One "visit" = a cursor clicking the first element of a chunk and sweeping the rest. Big card groups are split
  // across cursors so they work in parallel.
  const visits: HTMLElement[][] = [];
  gEls.forEach((g) => {
    if (!g.length) return;
    const size = g.length > 3 ? Math.ceil(g.length / n) : g.length;
    for (let i = 0; i < g.length; i += size) visits.push(g.slice(i, i + size));
  });
  const step = gsap.utils.clamp(0.12, 0.35, SPREAD / visits.length);

  const tl = gsap.timeline({ onComplete: onDone });
  const starts = [[12, 0.35], [vw - 110, 0.25], [vw - 110, 0.9], [12, 0.95]];
  cs.forEach((c, i) => gsap.set(c, { x: starts[i][0], y: sy + vh * starts[i][1], autoAlpha: 0 }));
  tl.to(cs, { autoAlpha: 1, duration: 0.25, stagger: 0.05 }, 0);

  const reveal = (el: HTMLElement, at: number) => {
    const move = canMove(el);
    if (move) gsap.set(el, { transition: "none" }); // avoid fighting CSS transform transitions (hover lifts)
    tl.fromTo(el, { opacity: 0, y: move ? 16 : 0 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, at);
  };

  const free = cs.map(() => 0);
  let clock = 0.45;
  visits.forEach((v, k) => {
    const ci = k % n, c = cs[ci];
    const at = Math.max(clock, free[ci] + MOVE);
    tl.to(c, { x: () => pt(v[0]).x, y: () => pt(v[0]).y, duration: MOVE, ease: "power3.inOut" }, at - MOVE)
      .to(c.firstElementChild, { scale: 0.78, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" }, at)
      .fromTo(ripples[ci], { x: () => pt(v[0]).x, y: () => pt(v[0]).y, scale: 0, autoAlpha: 0.9 }, { scale: 1, autoAlpha: 0, duration: 0.45, ease: "power2.out", immediateRender: false }, at);
    reveal(v[0], at + 0.03);
    let t = at;
    v.slice(1).forEach((el, j) => {
      if (j < 2) { // the cursor drifts across the next couple of items...
        tl.to(c, { x: () => pt(el).x, y: () => pt(el).y, duration: HOP, ease: "power1.inOut" }, t);
        t += HOP;
      } else t += 0.06; // ...the rest simply stagger in
      reveal(el, t);
    });
    free[ci] = t + 0.1;
    clock = at + step;
  });

  tl.to(cs, { autoAlpha: 0, y: "+=20", duration: 0.3, stagger: 0.04 }, Math.max(...free) + 0.2);
  return tl;
}

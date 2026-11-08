"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BriefcaseBusiness, Cloud, Code2, GraduationCap, MapPin, Network, Server, ShieldCheck, Trophy } from "lucide-react";

const disciplines = [
  { title: "Cloud", detail: "Azure · AWS", Icon: Cloud },
  { title: "Networking", detail: "Cisco · TCP/IP", Icon: Network },
  { title: "Servers", detail: "Linux · Docker", Icon: Server },
  { title: "Software", detail: "Code · APIs", Icon: Code2 },
];
const journey = [
  { title: "EZELINK", detail: "DevOps Engineer", period: "Current", description: "Infrastructure automation, monitoring, platform reliability and high-availability operations at EZELINK Telecom LLC.", Icon: BriefcaseBusiness },
  { title: "Dialog Axiata", detail: "DevOps & Data", period: "Previous", description: "Production operations, automation, SQL reporting and data analytics across telecom systems at Dialog Axiata PLC.", Icon: BriefcaseBusiness },
  { title: "University of Colombo", detail: "Bachelor of IT", period: "Education", description: "Building a foundation in information technology, software development and systems engineering.", Icon: GraduationCap },
];

export default function AboutSection() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const selected = journey[active];
  return (
    <section id="about" className="section about-future" aria-labelledby="about-title">
      <div className="container">
        <p className="af-eyebrow"><span>01 / ABOUT ME</span><i /> THE HUMAN BEHIND THE SYSTEMS</p>
        <div className="af-layout">
          <motion.div className="af-copy" initial={reducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .6 }}>
            <h2 id="about-title">Engineering across <span>code, cloud<br />&amp; networks.</span></h2>
            <p className="af-description">I&apos;m <strong>Ashan Sithara</strong>, a Dubai-based DevOps Engineer with 6+ years across infrastructure, telecom systems, software development and data analytics.</p>
            <p className="af-description">I connect the dots between software and infrastructure—building everything from backend APIs and mobile apps to secure networks, resilient platforms and monitoring.</p>
            <div className="af-capabilities">
              <div><span>BUILD</span><p>PHP · Java · Python · Next.js · Flutter</p></div>
              <div><span>OPERATE</span><p>Azure · AWS · Linux · Docker</p></div>
              <div><span>CONNECT</span><p>Cisco · Grafana · Prometheus · SNMP</p></div>
            </div>
            <a className="af-link" href="#expertise">Explore my expertise <ArrowRight size={18} /></a>
          </motion.div>
          <div className="af-visual" aria-label="Ashan surrounded by cloud, networking, server and software specializations">
            <div className="af-orbit-space" aria-hidden="true"><div className="af-halo" /><div className="af-ring af-ring-one" /><div className="af-ring af-ring-two" /><div className="af-ring af-ring-three" /><div className="af-platform" /></div>
            <div className="af-portrait"><Image src="/ashan-about-portrait-hd.png" alt="Ashan Sithara" width={1200} height={1311} sizes="(max-width: 850px) 80vw, 40vw" /></div>
            {disciplines.map(({ title, detail, Icon }, index) => <a href="#expertise" className={`af-float af-float-${index}`} key={title}><span className="af-float-icon"><Icon size={25} strokeWidth={1.6} /></span><span><strong>{title}</strong><small>{detail}</small></span><span className="af-card-dot" aria-hidden="true" /></a>)}
            <div className="af-nameplate"><span className="af-status" /><div><strong>ASHAN SITHARA</strong><small>DEVOPS ENGINEER · DUBAI, UAE</small></div></div>
          </div>
        </div>
        <div className="af-bottom">
          <div className="af-journey">
            <div className="af-journey-heading"><span>MY JOURNEY</span><a href="#experience">Full experience <ArrowRight size={14} /></a></div>
            <div className="af-timeline" aria-label="Career and education highlights">
              {journey.map(({ title, detail, period, Icon }, index) => <button type="button" key={title} className={`af-stop ${active === index ? "is-active" : ""}`} aria-pressed={active === index} aria-controls="af-career-detail" onClick={() => setActive(index)}><span className="af-stop-node"><Icon size={18} /></span><span><small>{period}</small><strong>{title}</strong><span>{detail}</span></span></button>)}
            </div>
            <div id="af-career-detail" className="af-career-detail" aria-live="polite" aria-atomic="true"><strong>{selected.detail}</strong><p>{selected.description}</p></div>
          </div>
          <div className="af-stats">
            <div><Trophy /><strong>6+ years</strong><span>IT Engineering</span></div>
            <div><ShieldCheck /><strong>AZ-104</strong><span>Microsoft Certified</span></div>
            <div><MapPin /><strong>Dubai</strong><span>United Arab Emirates</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

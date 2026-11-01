"use client";

import { motion } from "motion/react";
import { ArrowRight, BriefcaseBusiness, Cloud, Code2, Database, GraduationCap, MapPin, Network, ShieldCheck, Signal, Trophy } from "lucide-react";

const specialties = [
  { title: "DevOps & Cloud", Icon: Cloud },
  { title: "Full-Stack Development", Icon: Code2 },
  { title: "Networking", Icon: Network },
  { title: "Observability", Icon: Signal },
  { title: "Data & AI", Icon: Database },
];

const journey = [
  { title: "EZELINK", detail: "DevOps Engineer", Icon: BriefcaseBusiness },
  { title: "Dialog Axiata", detail: "DevOps & Data", Icon: BriefcaseBusiness },
  { title: "University of Colombo", detail: "Bachelor of IT", Icon: GraduationCap },
];

export default function AboutSection() {
  return (
    <section id="about" className="section about-new" aria-label="About Ashan Sithara">
      <div className="container about-new-layout">
        <motion.div className="about-new-intro" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.65}}>
          <p className="about-new-eyebrow"><span>01 / ABOUT ME</span><i /></p>
          <h2>Engineering across <span>code, cloud &amp; networks.</span></h2>
          <p className="about-new-description">I&apos;m Ashan, a Dubai-based DevOps Engineer with 6+ years across infrastructure, telecom systems, software development and data analytics. I build end-to-end solutions—from backend APIs and mobile apps to secure networks, resilient platforms and monitoring.</p>
          <div className="about-new-capabilities" aria-label="Technology experience at a glance">
            <div><strong>BUILD</strong><span>PHP &amp; Laravel · Java · Python · Next.js · Flutter / Dart</span></div>
            <div><strong>OPERATE</strong><span>Azure · AWS · Linux · Docker · high-availability systems</span></div>
            <div><strong>OBSERVE &amp; CONNECT</strong><span>Grafana · InfluxDB · Prometheus · SNMP · Cisco networking</span></div>
          </div>
          <div className="about-new-specialties" aria-label="Engineering specializations">
            {specialties.map(({title,Icon})=><a key={title} href="#expertise" className="about-new-specialty"><Icon size={20} strokeWidth={1.9}/><span>{title}</span></a>)}
          </div>
          <a className="about-new-journey-link" href="#experience">Explore my journey <ArrowRight size={20}/></a>
        </motion.div>
        <motion.div className="about-new-right" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.7,delay:.13}}>
          <div className="about-new-identity">
            <div className="about-new-portrait-glow" aria-hidden="true"/>
            <img className="about-new-person" src="/ashan-about-portrait-hd.png" alt="High-resolution professional portrait of Ashan Sithara" loading="lazy"/>
            <div className="about-new-identity-label"><span className="about-new-green-dot"/><strong>ASHAN SITHARA</strong><small>DEVOPS ENGINEER</small><span className="about-new-languages">PHP / JAVA / PYTHON / FLUTTER / LINUX / CISCO</span></div>
            <div className="about-new-timeline" aria-label="Career and education highlights">
              {journey.map(({title,detail,Icon})=><div className="about-new-milestone" key={title}><span className="about-new-node"/><div className="about-new-milestone-icon"><Icon size={23} strokeWidth={1.75}/></div><div><strong>{title}</strong><small>{detail}</small></div></div>)}
              <p>ENGINEER.<br/>BUILDER.<br/><span>CONTINUOUS<br/>LEARNER.</span></p>
            </div>
          </div>
          <div className="about-new-stats">
            <div><span className="about-new-stat-icon"><Trophy/></span><p><strong>6+ years</strong><small>IT Engineering</small></p></div>
            <div><span className="about-new-stat-icon violet"><ShieldCheck/></span><p><strong>AZ-104</strong><small>Microsoft Certified</small></p></div>
            <div><span className="about-new-stat-icon"><MapPin/></span><p><strong>Dubai</strong><small>UAE</small></p></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

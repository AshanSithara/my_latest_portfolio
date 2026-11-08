"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import ReferenceHero from "@/components/ReferenceHero";
import AboutSection from "@/components/AboutSection";
import { siGrafana, siInfluxdb, siPrometheus, siApachekafka, siDocker, siPhp, siFlutter, siCisco } from "simple-icons";
import { Activity, ArrowDown, ArrowDownToLine, ArrowRight, BrainCircuit, CheckCircle2, Cloud, Code2, Cpu, ExternalLink, Github, Linkedin, Mail, MapPin, Menu, Network, ServerCog, ShieldCheck, Smartphone, Terminal, X } from "lucide-react";
type DomainId = "cloud" | "backend" | "mobile" | "network" | "ai";

const brandLogos: Record<string,{path?:string;src?:string;color:string}> = {
  Grafana:{path:siGrafana.path,color:"#F46800"},
  InfluxDB:{path:siInfluxdb.path,color:"#A95FFC"},
  Prometheus:{path:siPrometheus.path,color:"#E6522C"},
  Kafka:{path:siApachekafka.path,color:"#F1F5F9"},
  Azure:{src:"/logos/azure.svg",color:"#38A8F5"},
  AWS:{src:"/logos/aws.svg",color:"#FF9900"},
  Docker:{path:siDocker.path,color:"#2496ED"},
  PHP:{path:siPhp.path,color:"#9B9EF2"},
  Java:{src:"/logos/java.svg",color:"#ED8B35"},
  Flutter:{path:siFlutter.path,color:"#54C5F8"},
  Cisco:{path:siCisco.path,color:"#17A6D5"},
};
function BrandLogo({name}:{name:string}) {
  const logo=brandLogos[name];
  return <span className={`brand-logo ${logo.src?"brand-logo-image":""}`} aria-hidden="true">{logo.src?<img src={logo.src} alt=""/>:<svg viewBox="0 0 24 24" fill={logo.color} role="presentation"><path d={logo.path}/></svg>}</span>;
}

// Falls back to the static portrait if WebGL is unavailable or the 3D scene throws (instead of crashing the page).
class SceneBoundary extends Component<{ fallback: React.ReactNode; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function supportsWebGL() {
  try { const c = document.createElement("canvas"); const gl = c.getContext("webgl2") || c.getContext("webgl"); gl?.getExtension("WEBGL_lose_context")?.loseContext(); return !!gl; } catch { return false; }
}

const CloudScene = dynamic(() => import("@/components/CloudScene"), { ssr: false, loading: () => <div className="cloud-fallback" aria-label="Loading cloud visualization"><Cloud size={92} strokeWidth={0.7} /></div> });

const nav = ["About", "Expertise", "Projects", "Experience", "Certifications", "Contact"];
const domains: { id:DomainId;title:string;summary:string;technologies:string[] }[] = [
  { id:"cloud",title:"Cloud & DevOps",summary:"Azure, AWS, Linux, automation, observability and high-availability infrastructure.",technologies:["Azure","AWS","Docker","CI/CD"] },
  { id:"backend",title:"Backend & Web",summary:"Building APIs and web applications with PHP, Java, Python and modern JavaScript.",technologies:["PHP","Laravel","Java","Spring Boot"] },
  { id:"mobile",title:"Mobile Apps",summary:"Cross-platform Flutter and Dart applications connected to practical backend systems.",technologies:["Flutter","Dart","Firebase","REST APIs"] },
  { id:"network",title:"Networking",summary:"Enterprise routing, switching, VLANs, troubleshooting and network operations.",technologies:["Cisco","CCNA / ENCOR","VLANs","TCP/IP"] },
  { id:"ai",title:"AI & Data",summary:"Python analytics, ML forecasting, AI integrations and automation-oriented experiments.",technologies:["Python","ML","SQL","RAG"] },
];
const techDetails: Record<string,{domain:DomainId;title:string;summary:string;tags:string[]}> = {
  Grafana:{domain:"cloud",title:"Grafana · Monitoring Dashboards",summary:"Visualizing infrastructure health, trends and operational metrics through dashboards.",tags:["Dashboards","Observability","Alerting"]},
  InfluxDB:{domain:"cloud",title:"InfluxDB · Time-Series Data",summary:"Working with time-series telemetry, collectd measurements and infrastructure monitoring data.",tags:["Time series","Flux","Telemetry"]},
  Prometheus:{domain:"cloud",title:"Prometheus · Metrics",summary:"Metrics collection, alerting concepts and infrastructure observability.",tags:["Metrics","Monitoring","Alerts"]},
  Kafka:{domain:"ai",title:"Kafka · Event Streaming",summary:"Exploring event-driven pipelines and real-time security analytics in hands-on projects.",tags:["Event streaming","Pipelines","Learning lab"]},
  Azure:{domain:"cloud",title:"Microsoft Azure",summary:"Microsoft Certified Azure Administrator Associate, with cloud administration and infrastructure knowledge.",tags:["AZ-104","Cloud","Networking"]},
  AWS:{domain:"cloud",title:"Amazon Web Services",summary:"Cloud exposure through SFTP workflows, operations and monitoring.",tags:["SFTP","Cloud operations","Monitoring"]},
  Docker:{domain:"cloud",title:"Docker · Containers",summary:"Packaging applications and building consistent development and deployment environments.",tags:["Containers","DevOps","Deployment"]},
  PHP:{domain:"backend",title:"PHP & Laravel",summary:"Web applications, APIs and production application troubleshooting.",tags:["PHP","Laravel","MariaDB"]},
  Java:{domain:"backend",title:"Java & Spring Boot",summary:"Software development experience across Java applications and backend concepts.",tags:["Java","Spring Boot","REST APIs"]},
  Flutter:{domain:"mobile",title:"Flutter & Dart",summary:"Cross-platform mobile development, including the Smart Garbage project.",tags:["Flutter","Dart","Firebase"]},
  Cisco:{domain:"network",title:"Cisco & Networking",summary:"Routing, switching, VLANs, network operations and CCNA/CCNP ENCOR training.",tags:["Cisco","VLANs","TCP/IP"]},
};
const domainDefaultTech: Record<DomainId,string> = {cloud:"Grafana",backend:"PHP",mobile:"Flutter",network:"Cisco",ai:"Kafka"};
const pillars = [
  { title: "Cloud & DevOps", Icon: Cloud, accent: "cyan", description: "Cloud environments, observability, automation and scalable application delivery.", tags: ["Azure", "AWS", "Linux", "CI/CD", "Docker"] },
  { title: "Backend & Web", Icon: Code2, accent: "violet", description: "Business applications, backend services, APIs and end-to-end web development.", tags: ["PHP", "Laravel", "Java", "Spring Boot", "Next.js"] },
  { title: "Mobile Development", Icon: Smartphone, accent: "teal", description: "Practical cross-platform mobile experiences backed by cloud and real-time data.", tags: ["Flutter", "Dart", "Firebase", "REST"] },
  { title: "Networking & Systems", Icon: Network, accent: "blue", description: "Routing, switching, VLANs, telecommunications and systems troubleshooting.", tags: ["Cisco", "CCNA", "ENCOR Training", "TCP/IP"] },
  { title: "AI & Data", Icon: BrainCircuit, accent: "violet", description: "Data pipelines, ML experiments and intelligent workflow integrations.", tags: ["Python", "Oracle SQL", "ML", "RAG"] },
];
const projects = [
  { tag: "MOBILE / IoT", status: "Past project", title: "Smart Garbage Management", description: "A mobile and connected-device project combining Flutter, microcontrollers and backend integration.", stack: ["Flutter", "Dart", "Arduino", "Firebase"], visual: "mobile", Icon: Smartphone },
  { tag: "FULL-STACK WEB", status: "Past project", title: "OpenShelf — E-book Marketplace", description: "A modern web marketplace project focused on browsing and organizing digital books.", stack: ["Next.js", "React", "JavaScript"], visual: "web", Icon: Code2 },
  { tag: "INFRASTRUCTURE", status: "Experience showcase", title: "Monitoring & Automation", description: "Production operations work involving infrastructure metrics, troubleshooting, alerts and automation.", stack: ["Linux", "Grafana", "SNMP", "Bash"], visual: "monitor", Icon: Activity },
  { tag: "BACKEND DEVELOPMENT", status: "Portfolio category", title: "PHP & Java Applications", description: "A dedicated space for PHP and Java services, web applications and API-based systems. Add individual case studies here.", stack: ["PHP", "Laravel", "Java", "Spring Boot"], visual: "backend", Icon: Code2 },
  { tag: "NETWORK ENGINEERING", status: "Experience showcase", title: "Network Operations & Labs", description: "Networking work and learning around Cisco technologies, subnetting, VLAN configuration and infrastructure troubleshooting.", stack: ["Cisco", "VLANs", "TCP/IP", "CCNA / ENCOR"], visual: "network", Icon: Network },
  { tag: "CYBERSECURITY / AI", status: "Planned lab", title: "Real-Time Threat Detection Lab", description: "A planned Kafka and Python practice environment for security event analytics and threat detection.", stack: ["Kafka", "Python", "Security Analytics"], visual: "security", Icon: ShieldCheck },
];
const careers = [
  { organization: "EZELINK Telecom LLC", role: "DevOps Engineer", period: "Current", text: "Infrastructure automation, monitoring, platform reliability, high availability and cloud-oriented operations." },
  { organization: "Dialog Axiata PLC", role: "DevOps Engineering & Data Analytics", period: "Previous", text: "Automation, production operations, SQL reporting, data pipelines and analytics for telecom systems." },
  { organization: "Earlier Engineering Experience", role: "IT Infrastructure & Telecommunications", period: "Foundation", text: "Systems, networking, core operations, troubleshooting and engineering support." },
];

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.65, delay }} className={className}>{children}</motion.div>;
}

function SectionHeading({ eyebrow, title, gradient, description }: { eyebrow: string; title: string; gradient?: string; description?: string }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title} {gradient && <span className="gradient-text">{gradient}</span>}</h2>{description && <p className="section-description">{description}</p>}</div>;
}

function ProjectVisual({ type }: { type: string }) {
  if (type === "mobile") return <div className="project-visual domain-visual mobile-visual"><div className="device-mock"><div className="device-notch"/><div className="device-app-icon"><Smartphone size={26}/></div><div className="device-lines"><span/><span/><span/></div><div className="device-bottom"><i/><i/><i/></div></div><div className="device-orbit"/><span className="visual-label">FLUTTER / IoT</span></div>;
  if (type === "web" || type === "backend") return <div className="project-visual domain-visual code-visual"><div className="mock-window"><div className="window-top"><i/><i/><i/><span>{type==="web"?"openshelf.app":"api / server"}</span></div><div className="mock-editor"><b>{type==="web"?"Explore digital books":"Backend services"}</b><span/><span/><span/></div><div className="mock-card-row"><i/><i/><i/></div></div><span className="visual-label">{type==="web"?"NEXT.JS WEB APPLICATION":"PHP / JAVA BACKEND"}</span></div>;
  if (type === "network") return <div className="project-visual domain-visual network-visual"><div className="network-grid"><span/><span/><span/><span/><span/><span/></div><div className="network-center"><Network size={62} strokeWidth={1.3}/></div><span className="visual-label">ROUTING / SWITCHING / VLANs</span></div>;
  if (type === "monitor") return <div className="project-visual monitor-visual"><div className="mini-sidebar"><span/><span/><span/><span/></div><div className="monitor-main"><div className="mini-top"><span>Infrastructure health</span><span className="live-indicator">● ONLINE</span></div><div className="stat-row"><div><strong>99.9%</strong><small>Availability*</small></div><div><strong>24/7</strong><small>Visibility</small></div><div><strong>08</strong><small>Services*</small></div></div><svg className="line-graph" viewBox="0 0 520 110" preserveAspectRatio="none"><defs><linearGradient id="graphFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#2ecbf2" stopOpacity=".38"/><stop offset="1" stopColor="#2ecbf2" stopOpacity="0"/></linearGradient></defs><path d="M0 91 L28 76 L54 81 L81 42 L113 54 L144 30 L173 51 L202 22 L234 49 L260 31 L291 45 L326 19 L352 28 L389 14 L416 29 L452 9 L484 18 L520 7 L520 110 L0 110 Z" fill="url(#graphFill)"/><path d="M0 91 L28 76 L54 81 L81 42 L113 54 L144 30 L173 51 L202 22 L234 49 L260 31 L291 45 L326 19 L352 28 L389 14 L416 29 L452 9 L484 18 L520 7" stroke="#37d9f7" strokeWidth="3" fill="none"/></svg><p className="demo-note">Illustrative dashboard data</p></div></div>;
  if (type === "automation") return <div className="project-visual automation-visual"><div className="flow-node"><Terminal size={24}/><span>Trigger</span></div><div className="flow-line"/><div className="flow-node active-node"><Cpu size={28}/><span>Process</span></div><div className="flow-line"/><div className="flow-node"><CheckCircle2 size={27}/><span>Deploy</span></div><div className="flow-caption">AUTOMATION PIPELINE</div></div>;
  return <div className="project-visual security-visual"><div className="security-orbit orbit-one"/><div className="security-orbit orbit-two"/><ShieldCheck size={80} strokeWidth={1.05}/><div className="security-chip chip-one">EVENT STREAM</div><div className="security-chip chip-two">THREAT SIGNAL</div><div className="security-chip chip-three">ALERT ENGINE</div><p className="demo-note">Concept visualization</p></div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sceneEnabled, setSceneEnabled] = useState(true);
  const [activeDomain,setActiveDomain] = useState<DomainId>("cloud");
  const [activeTech,setActiveTech] = useState("Grafana");
  const selectedTech = techDetails[activeTech] ?? techDetails.Grafana;
  const selectTech = (name:string) => {setActiveTech(name);setActiveDomain((techDetails[name]??techDetails.Grafana).domain);};
  const heroPortrait = <div className="mobile-cloud portrait-mobile"><Image src="/ashan-3d-portrait.png" alt="3D-styled portrait of Ashan Sithara" fill priority sizes="(max-width: 900px) 92vw, 16px"/></div>;
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Mobile menu: focus the first link on open, close on Escape (returning focus), outside tap, or growing to desktop.
  useEffect(() => {
    if (!menuOpen) return;
    navRef.current?.querySelector("a")?.focus({ preventScroll: true });
    const close = () => setMenuOpen(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { close(); toggleRef.current?.focus(); } };
    const onDown = (e: PointerEvent) => { const t = e.target as Node; if (!navRef.current?.contains(t) && !toggleRef.current?.contains(t)) close(); };
    const desktop = window.matchMedia("(min-width: 901px)");
    const onMq = () => { if (desktop.matches) close(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    desktop.addEventListener("change", onMq);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); desktop.removeEventListener("change", onMq); };
  }, [menuOpen]);
  const [portraitTilt,setPortraitTilt] = useState({x:0,y:0});
  useEffect(() => { const mq = window.matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setReducedMotion(mq.matches); update(); mq.addEventListener("change", update); setSceneEnabled(window.matchMedia("(min-width: 720px)").matches && !mq.matches && supportsWebGL()); return () => mq.removeEventListener("change", update); }, []);
  return <main>
    <div className="site-backdrop" aria-hidden="true" />
    <header className="site-header"><div className="container header-inner"><a href="#top" className="brand" aria-label="Ashan Sithara home"><span className="brand-mark"><span/><span/></span>ASHAN <span>SITHARA</span></a><nav id="site-nav" ref={navRef} className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">{nav.map(item => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>)}</nav><a className="header-cta" href="#contact">Let&apos;s Talk <ArrowRight size={15}/></a><button ref={toggleRef} className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div></header>

    <ReferenceHero/>
    <section id="mobile-top" className="hero container legacy-hero"><div className="hero-copy"><Reveal><div className="availability"><span className="status-dot"/> OPEN TO NEW OPPORTUNITIES <span className="availability-divider">/</span> DUBAI, UAE</div><p className="eyebrow hero-eyebrow">DEVOPS <span>•</span> SOFTWARE <span>•</span> CLOUD <span>•</span> NETWORKING</p><h1>From applications to infrastructure. <span className="gradient-text">I engineer the whole system.</span></h1><p className="hero-intro">I&apos;m <strong>Ashan Sithara,</strong> a Dubai-based DevOps engineer with 6 years of experience across IT infrastructure, telecom networks and data-driven operations. I also develop web and mobile solutions using PHP, Java, Next.js and Flutter—bringing software, cloud and networking together.</p><div className="hero-actions"><a className="btn-primary" href="#projects">Explore Projects <ArrowRight size={18}/></a><a className="btn-outline" href="#contact">Request My CV <ArrowDownToLine size={18}/></a></div><div className="hero-micro"><span><Cloud size={15}/> DevOps & Cloud</span><span><Code2 size={15}/> PHP / Java</span><span><Smartphone size={15}/> Flutter / Dart</span><span><Network size={15}/> Cisco & Networks</span></div></Reveal></div>
      <div className="hero-visual interactive-hero"><div className="scene-glow"/>{sceneEnabled && !reducedMotion ? <SceneBoundary fallback={heroPortrait}><CloudScene/></SceneBoundary> : heroPortrait}
        <div className="hero-tech-tier tier-monitoring" aria-label="Observability and data tools">{["Grafana","InfluxDB","Prometheus","Kafka"].map(t=><button key={t} type="button" className={`hero-brand-card primary ${activeTech===t?"selected":""}`} style={{"--tech-accent":brandLogos[t].color} as React.CSSProperties} onClick={()=>selectTech(t)} aria-pressed={activeTech===t}><BrandLogo name={t}/><span>{t}</span></button>)}</div>
        <div className="hero-tech-tier tier-engineering" aria-label="Cloud, software and networking tools">{["Azure","AWS","Docker","PHP","Java","Flutter","Cisco"].map(t=><button key={t} type="button" className={`hero-brand-card secondary ${activeTech===t?"selected":""}`} style={{"--tech-accent":brandLogos[t].color} as React.CSSProperties} onClick={()=>selectTech(t)} aria-pressed={activeTech===t}><BrandLogo name={t}/><span>{t}</span></button>)}</div>
        <div className="domain-detail" aria-live="polite"><span className="domain-detail-kicker">EXPLORE MY ENGINEERING WORLD</span><strong>{selectedTech.title}</strong><p>{selectedTech.summary}</p><div className="domain-tech">{selectedTech.tags.map(t=><span key={t}>{t}</span>)}</div></div><span className="drag-hint">{sceneEnabled ? "SLOWLY ROTATING 3D SCENE • SELECT A TOOL" : "SELECT A TECHNOLOGY BELOW"}</span></div>
      <div className="domain-tabs" role="group" aria-label="Explore engineering domains">{domains.map((d,i)=><button key={d.id} type="button" className={activeDomain===d.id?"domain-tab selected":"domain-tab"} aria-pressed={activeDomain===d.id} onClick={()=>{setActiveDomain(d.id);setActiveTech(domainDefaultTech[d.id]);}}><span>0{i+1}</span>{d.title}</button>)}</div><div className="mobile-tech-list" aria-label="Select a technology">{Object.keys(techDetails).map(t=><button key={t} type="button" className={activeTech===t?"active":""} onClick={()=>selectTech(t)}>{t}</button>)}</div><a href="#about" className="scroll-prompt"><ArrowDown size={16}/> SCROLL TO EXPLORE</a></section>

    <AboutSection />

    <section id="expertise" className="section"><div className="container"><Reveal><SectionHeading eyebrow="02 / EXPERTISE" title="One engineer." gradient="Multiple disciplines." description="From software applications to the systems they run on, I bring together development, infrastructure and network engineering."/></Reveal><div className="expertise-grid">{pillars.map(({title,Icon,accent,description,tags},i)=><Reveal key={title} delay={i*.08}><div className={`expertise-card accent-${accent}`}><div className="expertise-icon"><Icon size={28} strokeWidth={1.7}/></div><h3>{title}</h3><p>{description}</p><div className="tech-tags">{tags.map(t=><span key={t}>{t}</span>)}</div><div className="card-number">0{i+1}</div></div></Reveal>)}</div></div></section>

    <section id="projects" className="section projects-section"><div className="container"><Reveal><div className="section-heading-row"><SectionHeading eyebrow="03 / PORTFOLIO & ENGINEERING WORK" title="More than infrastructure." gradient="I build software too."/><p>Applications, mobile experiences, backend engineering, networking and systems. Each card distinguishes past work from planned labs and experience showcases.</p></div></Reveal><div className="project-grid">{projects.map(({tag,status,title,description,stack,visual,Icon},i)=><Reveal key={title} delay={i*.07}><article className="project-card"><ProjectVisual type={visual}/><div className="project-content"><div className="project-topline"><span><Icon size={13}/>{tag}</span><span className={status === "Planned lab" || status === "Portfolio category" ? "work-status planned" : "work-status"}>{status}</span></div><h3>{title}</h3><p>{description}</p><div className="tech-tags">{stack.map(t=><span key={t}>{t}</span>)}</div><a href="#contact" className="project-action" aria-label={`Ask about ${title}`}>Discuss project <ArrowRight size={17}/></a></div></article></Reveal>)}</div><p className="project-disclaimer">Project visualizations are illustrative. Repository and demo links can be added when you provide them.</p></div></section>

    <section id="experience" className="section experience-section"><div className="container experience-grid"><Reveal><SectionHeading eyebrow="04 / CAREER JOURNEY" title="Built through experience." gradient="Driven by curiosity."/><p className="body-copy">From telecommunications and analytics to production infrastructure and modern cloud engineering—each step has shaped how I solve problems.</p></Reveal><div className="timeline">{careers.map((entry,i)=><Reveal key={entry.organization} delay={i*.1}><div className="timeline-entry"><span className="timeline-node"/><div className="timeline-date">{entry.period}</div><div className="timeline-card"><div className="timeline-initial">{i===0 ? "EZ" : i===1 ? "DA" : "IT"}</div><div><h3>{entry.organization}</h3><p className="timeline-role">{entry.role}</p><p>{entry.text}</p></div></div></div></Reveal>)}</div></div></section>

    <section id="certifications" className="section"><div className="container"><Reveal><SectionHeading eyebrow="05 / CERTIFICATIONS & LEARNING" title="Always learning." gradient="Always evolving." description="Credentials and continued technical study underpinning the work."/></Reveal><div className="cert-grid"><Reveal><div className="cert-card main-cert"><div className="cert-emblem"><CheckCircle2 size={39}/><span>AZ-104</span></div><div><p className="cert-kicker">MICROSOFT CERTIFIED</p><h3>Azure Administrator Associate</h3><p>Identity, governance, networking, compute and storage in Microsoft Azure.</p></div><div className="cert-check"><CheckCircle2 size={22}/></div></div></Reveal><Reveal delay={.12}><div className="cert-card"><div className="training-icon"><Network size={33}/></div><div><p className="cert-kicker">PROFESSIONAL TRAINING</p><h3>CCNA & CCNP ENCOR</h3><p>Networking technologies, enterprise infrastructure and engineering fundamentals.</p></div></div></Reveal></div></div></section>

    <section id="contact" className="section contact-section"><div className="container"><Reveal><div className="contact-panel"><div className="contact-orb" aria-hidden="true"/><div className="contact-text"><p className="eyebrow">06 / LET&apos;S CONNECT</p><h2>Let&apos;s build something <span className="gradient-text">remarkable.</span></h2><p>Whether the challenge is a web application, cloud platform, connected mobile experience or production network, I&apos;d be happy to connect about engineering opportunities.</p><div className="contact-actions"><a className="btn-primary" href="mailto:hello@example.com?subject=Portfolio%20enquiry" onClick={(e)=>{e.preventDefault(); window.alert("Add your email address in src/app/page.tsx to activate this button.");}}><Mail size={18}/> Email Me <ArrowRight size={16}/></a><a className="btn-outline" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"><Linkedin size={18}/> LinkedIn <ExternalLink size={15}/></a></div><small className="contact-note">Contact links are placeholders until you add your preferred public details.</small></div></div></Reveal></div></section>
    <footer className="footer"><div className="container footer-inner"><div><a href="#top" className="brand">ASHAN <span>SITHARA</span></a><p>Software • DevOps • Cloud • Networking</p></div><div className="footer-links"><a href="#about">About</a><a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#contact">Contact</a></div><p className="copyright">© {new Date().getFullYear()} Ashan Sithara. Built with Next.js.</p></div></footer>
  </main>;
}

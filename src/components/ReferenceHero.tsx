"use client";

import { useState } from "react";
import { ArrowRight, FileText, Rocket, Sun } from "lucide-react";

type Tool = { name:string; x:number; y:number; w:number; h:number; description:string };
const tools:Tool[] = [
  {name:"Grafana",x:41.7,y:56.0,w:5.4,h:13.6,description:"Infrastructure dashboards, operational trends and monitoring."},
  {name:"InfluxDB",x:47.5,y:58.0,w:6.7,h:13.3,description:"Time-series telemetry and infrastructure measurement data."},
  {name:"Prometheus",x:54.6,y:59.9,w:7.5,h:12.2,description:"Metrics, monitoring and infrastructure observability."},
  {name:"Kafka",x:62.7,y:60.0,w:7.4,h:12.2,description:"Event streaming and real-time analytics learning projects."},
  {name:"Node.js",x:70.8,y:59.6,w:7.4,h:12.5,description:"JavaScript runtime for server-side applications and APIs."},
  {name:"Next.js",x:79.1,y:57.6,w:7.4,h:13.6,description:"React framework used for full-stack web applications, including this portfolio."},
  {name:"Linux",x:87.0,y:56.0,w:5.4,h:14.1,description:"Linux infrastructure operations, shell scripting and system administration."},
  {name:"Azure",x:38.5,y:70.1,w:5.9,h:14.0,description:"Microsoft Certified Azure Administrator Associate (AZ-104)."},
  {name:"AWS",x:44.4,y:72.4,w:6.7,h:12.7,description:"AWS SFTP workflows, cloud operations and monitoring."},
  {name:"Docker",x:51.1,y:74.5,w:7.2,h:13.3,description:"Application containerization and deployment environments."},
  {name:"PHP",x:58.4,y:76.4,w:7.4,h:12.4,description:"PHP and Laravel applications and production troubleshooting."},
  {name:"Java",x:66.4,y:76.6,w:7.4,h:11.8,description:"Java software development and Spring Boot backend concepts."},
  {name:"Flutter",x:74.0,y:75.4,w:7.8,h:11.7,description:"Flutter and Dart mobile apps, including Smart Garbage."},
  {name:"Cisco",x:81.9,y:73.7,w:7.2,h:12.1,description:"Cisco networking, VLANs, routing, switching and CCNA/ENCOR training."},
  {name:"Vue.js",x:89.7,y:70.3,w:5.7,h:13.4,description:"Component-based frontend development framework."},
];

export default function ReferenceHero() {
  const [selected,setSelected]=useState<Tool|null>(null);
  return <section id="top" className="reference-hero" aria-label="Ashan Sithara — Software, Cloud, DevOps and Networking portfolio">
    <header className="reference-live-header">
      <a className="reference-live-brand" href="#top">ASHAN SITHARA</a>
      <nav className="reference-live-nav" aria-label="Portfolio navigation">
        <a className="current" href="#top">Home</a>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#expertise">Expertise</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="reference-live-header-actions"><Sun aria-hidden="true"/><a href="#contact">Let&apos;s Connect <ArrowRight size={18}/></a></div>
    </header>
    <div className="reference-live-copy">
      <p className="reference-live-eyebrow"><span/> CLOUD ENGINEER <b>/</b> DEVOPS <b>/</b> SOFTWARE DEVELOPER</p>
      <h1><span>From applications</span><span>to infrastructure.</span><span className="reference-live-gradient">I engineer the whole system.</span></h1>
      <p className="reference-live-disciplines">DevOps <i/> Software <i/> Cloud <i/> Networking</p>
      <div className="reference-live-actions">
        <a className="reference-live-primary" href="#projects"><Rocket aria-hidden="true"/> Explore Projects <ArrowRight aria-hidden="true"/></a>
        <a className="reference-live-secondary" href="#contact"><FileText aria-hidden="true"/> Request CV</a>
      </div>
    </div>
    <div className="reference-live-metrics" aria-label="Professional highlights">
      <div><strong>6+</strong><span>Years Experience</span></div>
      <div><strong>AZ-104</strong><span>Azure Certified</span></div>
      <div><strong>Networking</strong><span>CCNA · CCNP ENCOR</span></div>
      <div><strong>Full-Stack</strong><span>PHP · Java · Next.js</span></div>
      <div><strong>Monitoring</strong><span>Grafana · InfluxDB</span></div>
      <div><strong>Support</strong><span>L2/L3 IT Infrastructure</span></div>
    </div>
    {tools.map(tool=><button
      key={tool.name}
      type="button"
      title={`Explore ${tool.name}`}
      aria-label={`Explore ${tool.name}`}
      aria-pressed={selected?.name===tool.name}
      className={`reference-tool ${selected?.name===tool.name?"reference-tool-selected":""}`}
      style={{left:`${tool.x}%`,top:`${tool.y}%`,width:`${tool.w}%`,height:`${tool.h}%`}}
      onClick={()=>setSelected(selected?.name===tool.name?null:tool)}
    />)}
    {selected && <div className="reference-insight" role="status"><button type="button" onClick={()=>setSelected(null)} aria-label="Close technology details">×</button><strong>{selected.name}</strong><p>{selected.description}</p></div>}
  </section>;
}

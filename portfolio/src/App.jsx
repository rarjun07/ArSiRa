import { useEffect, useState } from "react";
import { getPortfolioContent } from "./api";

const fallbackProjects = [
  { title: "Quiz Management Platform", type: "Product engineering", description: "A focused assessment workflow that keeps authoring, attempts, and results in one place.", color: "coral" },
  { title: "Insurance Management Platform", type: "Operations software", description: "A structured workspace for policies, claims, and the people responsible for them.", color: "blue" },
  { title: "AI Code Review Assistant", type: "Developer tooling", description: "Actionable review context for teams that want to move quickly without losing quality.", color: "gold" },
];

const fallbackSkills = ["Python", "FastAPI", "React", "PostgreSQL", "SQLAlchemy", "Docker"];

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function App() {
  const [content, setContent] = useState({ about: null, skills: [], projects: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getPortfolioContent()
      .then(([about, skills, projects]) => setContent({ about, skills, projects }))
      .catch(() => setLoadError("CMS content is unavailable. Showing the latest saved preview."))
      .finally(() => setIsLoading(false));
  }, []);

  const about = content.about || { headline: "Useful software, carefully built.", summary: "I design and build dependable web products with Python, FastAPI, React, and PostgreSQL.", bio: "Good software should feel considered. I work across backend systems and frontend interfaces, bringing structure to the data and a human rhythm to the experience." };
  const featuredProjects = content.projects.length ? content.projects.map((project, index) => ({ ...project, type: project.tech_stack?.slice(0, 2).join(" / ") || "Product engineering", description: project.summary, color: ["coral", "blue", "gold"][index % 3] })) : fallbackProjects;
  const skills = content.skills.length ? content.skills.map((skill) => skill.name) : fallbackSkills;

  return <div className="site-shell">
    <header className="site-header"><a className="wordmark" href="#top">AR<span>.</span></a><nav aria-label="Primary navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav><a className="header-link" href="#contact">Let&apos;s talk <Arrow /></a></header>
    <main id="top">
      <section className="hero-section"><div className="hero-copy"><p className="eyebrow">Python fullstack developer</p><h1>{about.headline || "Useful software, carefully built."}</h1><p className="hero-description">{about.summary}</p><div className="hero-actions"><a className="button button-dark" href="#work">See selected work <Arrow /></a><a className="text-link" href="#about">A little about me <span aria-hidden="true">↓</span></a></div></div><div className="hero-visual" aria-label="Abstract illustration of connected software systems"><div className="visual-grid" /><div className="visual-card visual-card-main"><span className="card-label">CURRENTLY BUILDING</span><strong>Portfolio CMS</strong><span className="card-line" /><small>React / FastAPI / PostgreSQL</small></div><div className="visual-card visual-card-side"><span className="side-dot" /><span>{isLoading ? "CMS<br />loading" : "API<br />ready"}</span></div><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /></div></section>
      <section className="signal-bar"><p>Based in India</p><span>✦</span><p>Open to meaningful problems</p><span>✦</span><p>2026 / Present</p></section>
      <section className="work-section" id="work"><div className="section-intro"><p className="eyebrow">Selected work</p><h2>Things I&apos;ve helped<br />make clearer.</h2><p>From internal tools to public-facing products, I like the part where complexity becomes a calm experience.</p></div><div className="project-list">{featuredProjects.map((project, index) => <article className={`project-card ${project.color}`} key={project.title}><div className="project-number">0{index + 1}</div><div className="project-details"><p className="project-type">{project.type}</p><h3>{project.title}</h3><p>{project.description}</p><a href="#contact" aria-label={`Ask about ${project.title}`}>View project <Arrow /></a></div><div className="project-shape" /></article>)}</div></section>
      <section className="about-section" id="about"><div><p className="eyebrow">A bit about me</p><h2>{about.headline || "I care about the"}<br /><em>details between.</em></h2></div><div className="about-copy"><p>{about.bio || about.summary}</p><p>Right now, I&apos;m deepening my craft through a Python fullstack developer internship and building this CMS-powered portfolio one day at a time.</p><div className="skill-list">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div></section>
      <section className="contact-section" id="contact"><p className="eyebrow">Have a project in mind?</p><h2>Let&apos;s make<br /><em>something useful.</em></h2><a className="contact-link" href="mailto:hello@arjunsair.dev">hello@arjunsair.dev <Arrow /></a></section>
    </main>
    <footer className="site-footer"><span>© 2026 Arjun Sair</span><span>{loadError || "Content managed with Portfolio CMS."}</span><a href="#top">Back to top ↑</a></footer>
  </div>;
}

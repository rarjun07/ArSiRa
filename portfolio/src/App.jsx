import { useEffect, useState } from "react";
import { getPortfolioContent, resolveMediaUrl, submitContact } from "./api";

const fallbackProjects = [
  { title: "Quiz Management Platform", type: "Product engineering", description: "A focused assessment workflow that keeps authoring, attempts, and results in one place.", color: "coral" },
  { title: "Insurance Management Platform", type: "Operations software", description: "A structured workspace for policies, claims, and the people responsible for them.", color: "blue" },
  { title: "AI Code Review Assistant", type: "Developer tooling", description: "Actionable review context for teams that want to move quickly without losing quality.", color: "gold" },
];

const fallbackSkills = [{ name: "Python", proficiency: 90 }, { name: "FastAPI", proficiency: 85 }, { name: "React", proficiency: 75 }, { name: "PostgreSQL", proficiency: 80 }, { name: "SQLAlchemy", proficiency: 82 }, { name: "Docker", proficiency: 70 }];
const fallbackBlogs = [{ title: "Building a CMS from first principles", excerpt: "A practical look at designing content models, APIs, and a calm admin workflow.", content: "A portfolio CMS becomes easier to maintain when content models, API contracts, and the admin workflow are designed together." }, { title: "Why small interfaces feel faster", excerpt: "A few notes on hierarchy, defaults, and making repeated work feel lighter.", content: "Clear hierarchy, sensible defaults, and fewer unnecessary decisions make repeated work feel faster and more focused." }];
const fallbackTestimonials = [{ name: "A thoughtful collaborator", quote: "The best technical work makes the next decision easier." }];
const fallbackExperience = [{ title: "Python Fullstack Developer Intern", company: "Independent project studio", start_date: "2026", end_date: "Present", description: "Building a CMS-powered portfolio with FastAPI, React, and PostgreSQL." }];

function Arrow() { return <span aria-hidden="true">↗</span>; }

function ContactIcon({ type }) {
  const symbols = { email: "@", phone: "☎", whatsapp: "◉", linkedin: "in", github: "GH" };
  return <span className={`contact-icon contact-icon-${type}`} aria-hidden="true">{symbols[type]}</span>;
}

function ContactDetails({ about }) {
  const whatsappHref = about.whatsapp_number ? `https://wa.me/${about.whatsapp_number.replace(/\D/g, "")}` : "";
  return <div className="contact-details">
    {about.email && <a href={`mailto:${about.email}`}><ContactIcon type="email" /><span className="contact-value"><span>Email</span>{about.email}</span></a>}
    {about.phone_number && <a href={`tel:${about.phone_number}`}><ContactIcon type="phone" /><span className="contact-value"><span>Phone</span>{about.phone_number}</span></a>}
    {about.whatsapp_number && <a href={whatsappHref} target="_blank" rel="noreferrer"><ContactIcon type="whatsapp" /><span className="contact-value"><span>WhatsApp</span>{about.whatsapp_number}</span></a>}
    {about.linkedin_url && <a href={about.linkedin_url} target="_blank" rel="noreferrer"><ContactIcon type="linkedin" /><span className="contact-value"><span>LinkedIn</span>View profile <Arrow /></span></a>}
    {about.github_url && <a href={about.github_url} target="_blank" rel="noreferrer"><ContactIcon type="github" /><span className="contact-value"><span>GitHub</span>View repositories <Arrow /></span></a>}
  </div>;
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) { event.preventDefault(); setStatus({ type: "", text: "" }); setIsSubmitting(true); try { const result = await submitContact(form); setStatus({ type: "success", text: result.detail }); setForm({ name: "", email: "", subject: "", message: "" }); } catch (error) { setStatus({ type: "error", text: error.message }); } finally { setIsSubmitting(false); } }
  return <form className="contact-form" onSubmit={submit}><div className="contact-fields"><label><span>Name</span><input name="name" required minLength="2" value={form.name} onChange={update} /></label><label><span>Email</span><input name="email" type="email" required value={form.email} onChange={update} /></label></div><label><span>Subject</span><input name="subject" required minLength="2" value={form.subject} onChange={update} /></label><label><span>Message</span><textarea name="message" required minLength="10" rows="5" value={form.message} onChange={update} /></label><div className="contact-form-footer"><button className="button button-dark" disabled={isSubmitting} type="submit">{isSubmitting ? "Sending..." : "Send message"} <Arrow /></button>{status.text && <p className={status.type === "success" ? "form-success" : "form-error"} role="status">{status.text}</p>}</div></form>;
}

export default function App() {
  const [content, setContent] = useState({ about: null, skills: [], projects: [], blogs: [], testimonials: [], experience: [], education: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [expandedBlog, setExpandedBlog] = useState("");

  useEffect(() => {
    getPortfolioContent()
      .then(([about, skills, projects, blogs, testimonials, experience, education]) => setContent({ about, skills, projects, blogs, testimonials, experience, education }))
      .catch(() => setLoadError("CMS content is unavailable. Showing the latest saved preview."))
      .finally(() => setIsLoading(false));
  }, []);

  const about = content.about || { headline: "Useful software, carefully built.", summary: "I design and build dependable web products with Python, FastAPI, React, and PostgreSQL.", bio: "Good software should feel considered. I work across backend systems and frontend interfaces, bringing structure to the data and a human rhythm to the experience." };
  const featuredProjects = content.projects.length ? content.projects.map((project, index) => ({ ...project, type: project.tech_stack?.slice(0, 2).join(" / ") || "Product engineering", description: project.summary, color: ["coral", "blue", "gold"][index % 3] })) : fallbackProjects;
  const skills = content.skills.length ? content.skills.map((skill) => ({ name: skill.name, proficiency: skill.proficiency ?? 0 })) : fallbackSkills;
  const blogs = content.blogs.length ? content.blogs : fallbackBlogs;
  const testimonials = content.testimonials.length ? content.testimonials : fallbackTestimonials;
  const experience = content.experience.length ? content.experience : fallbackExperience;
  const education = content.education;

  return <div className="site-shell">
    <header className="site-header"><a className="wordmark" href="#top">AR<span>.</span></a><nav aria-label="Primary navigation"><a href="#top">Home</a><a href="#about">About</a><a href="#skills">Skills</a><a href="#journal">Journal</a><a href="#experience">Experience</a><a href="#education">Education</a><a href="#work">Work</a><a href="#contact">Contact</a></nav><a className="header-link" href="#contact">Let&apos;s talk <Arrow /></a></header>
    <main id="top">
      <section className="hero-section"><div className="hero-copy"><p className="eyebrow">Python fullstack developer</p><h1>{about.headline || "Useful software, carefully built."}</h1><p className="hero-description">{about.summary}</p><ContactDetails about={about} /><div className="hero-actions"><a className="button button-dark" href="#work">See selected work <Arrow /></a><a className="text-link" href="#about">A little about me <span aria-hidden="true">↓</span></a></div></div><div className="hero-visual" aria-label="Abstract illustration of connected software systems"><div className="visual-grid" />{about.profile_image_url && <img className="hero-profile-image" src={resolveMediaUrl(about.profile_image_url)} alt="Arjun Singh" onError={(event) => { event.currentTarget.style.display = "none"; }} />}<div className="visual-card visual-card-main"><span className="card-label">CURRENTLY BUILDING</span><strong>Portfolio CMS</strong><span className="card-line" /><small>React / FastAPI / PostgreSQL</small></div><div className="visual-card visual-card-side"><span className="side-dot" /><span>{isLoading ? "CMS<br />loading" : "API<br />ready"}</span></div><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /></div></section>
      <section className="signal-bar"><p>Based in India</p><span>✦</span><p>Open to meaningful problems</p><span>✦</span><p>2026 / Present</p></section>
      <section className="work-section" id="work"><div className="section-intro"><p className="eyebrow">Selected work</p><h2>Things I&apos;ve helped<br />make clearer.</h2><p>From internal tools to public-facing products, I like the part where complexity becomes a calm experience.</p></div><div className="project-list">{featuredProjects.map((project, index) => <article className={`project-card ${project.color}`} key={project.title}><div className="project-number">0{index + 1}</div><div className="project-details"><p className="project-type">{project.type}</p><h3>{project.title}</h3><p>{project.description}</p><div className="project-links">{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" aria-label={`View live ${project.title}`}>View project <Arrow /></a>}{project.repo_url && <a className="source-link" href={project.repo_url} target="_blank" rel="noreferrer" aria-label={`View source code for ${project.title}`}>View source <Arrow /></a>}{!project.live_url && !project.repo_url && <span className="project-link-muted">Project links coming soon</span>}</div></div><div className="project-shape" /></article>)}</div></section>
      <section className="about-section" id="about"><div className="about-heading"><p className="eyebrow">A bit about me</p><h2>Building useful<br /><em>things with care.</em></h2><p className="about-lede">A Python developer focused on thoughtful backend systems, clear interfaces, and software that earns trust through the details.</p></div><div className="about-copy"><p>{about.bio || about.summary}</p><p>Right now, I&apos;m deepening my craft through a Python fullstack developer internship and building this CMS-powered portfolio one day at a time.</p><div className="about-facts"><div><span>Based in</span><strong>{about.location || "India"}</strong></div><div><span>Focus</span><strong>Python · FastAPI · React</strong></div><div><span>Education</span><strong>{education[0]?.degree || "M.Sc. in Information Technology"}</strong></div></div></div></section>
      <section className="skills-section" id="skills"><div className="section-intro"><p className="eyebrow">Skills and tools</p><h2>Built with<br /><em>careful tools.</em></h2></div><div className="skills-content"><p>The technologies I use to turn thoughtful ideas into reliable products.</p><div className="skill-meters">{skills.map((skill) => <div className="skill-meter" key={skill.name}><div className="skill-meter-label"><span>{skill.name}</span><span>{skill.proficiency}%</span></div><div className="skill-meter-track"><span style={{ width: `${skill.proficiency}%` }} /></div></div>)}</div></div></section>
      <section className="journal-section" id="journal"><div className="section-intro"><p className="eyebrow">From the journal</p><h2>Notes from<br /><em>the work.</em></h2></div><div className="journal-grid">{blogs.slice(0, 3).map((blog) => { const isExpanded = expandedBlog === blog.title; return <article className="journal-card" key={blog.title}><p className="project-type">{blog.tags?.[0] || "Building in public"}</p><h3>{blog.title}</h3><p>{blog.excerpt}</p>{isExpanded && <p className="journal-content">{blog.content || blog.excerpt}</p>}<button className="journal-read-more" type="button" onClick={() => setExpandedBlog(isExpanded ? "" : blog.title)}>{isExpanded ? "Show less" : "Read more"} <Arrow /></button></article>; })}</div></section>
      <section className="timeline-section" id="experience"><div className="section-intro"><p className="eyebrow">Experience</p><h2>A timeline<br /><em>in progress.</em></h2></div><div className="timeline-list">{experience.slice(0, 4).map((item) => <article className="timeline-item" key={`${item.company}-${item.title}`}><div className="timeline-date">{item.start_date}<br />{item.end_date || "Present"}</div><div><h3>{item.title}</h3><p className="timeline-company">{item.company}{item.location ? ` · ${item.location}` : ""}</p><p>{item.description}</p></div></article>)}</div></section>
      <section className="education-section" id="education"><div className="section-intro"><p className="eyebrow">Education</p><h2>The foundation<br /><em>behind the work.</em></h2></div><div className="education-list">{education.length ? education.map((item) => <article className="education-item" key={`${item.institution}-${item.degree}`}><div className="education-date">{item.start_date}<br />{item.end_date || "Present"}</div><div><h3>{item.degree}</h3><p className="education-institution">{item.institution}{item.field_of_study ? ` · ${item.field_of_study}` : ""}{item.location ? ` · ${item.location}` : ""}</p>{item.description && <p>{item.description}</p>}</div></article>) : <p className="education-empty">Education details can be added from Portfolio CMS.</p>}</div></section>
      <section className="testimonial-section"><p className="eyebrow">A good word</p><blockquote>“{testimonials[0].quote}”</blockquote><p className="quote-author">{testimonials[0].name}{testimonials[0].role ? ` · ${testimonials[0].role}` : ""}</p></section>
      <section className="contact-section" id="contact"><div className="contact-heading"><p className="eyebrow">Have a project in mind?</p><h2>Let&apos;s make<br /><em>something useful.</em></h2><ContactDetails about={about} /></div><ContactForm /></section>
    </main>
    <footer className="site-footer"><span>© 2026 Arjun Singh</span><span>{loadError || "Content managed with Portfolio CMS."}</span><a href="#top">Back to top ↑</a></footer>
  </div>;
}

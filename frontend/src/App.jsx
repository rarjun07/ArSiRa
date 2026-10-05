import { useEffect, useState } from "react";
import { deleteContent, getContent, getCurrentUser, login, saveContent, uploadImage } from "./api";

const TOKEN_KEY = "portfolio_cms_tokens";
const contentAreas = [
  { label: "About", icon: "A", detail: "Profile and introduction" },
  { label: "Projects", icon: "P", detail: "Featured work and case studies" },
  { label: "Skills", icon: "S", detail: "Technical capabilities" },
  { label: "Experience", icon: "E", detail: "Career timeline" },
  { label: "Blogs", icon: "B", detail: "Published articles" },
  { label: "Services", icon: "V", detail: "What you offer" },
  { label: "Testimonials", icon: "T", detail: "Client feedback" },
  { label: "Media", icon: "M", detail: "Uploaded images" },
];

function readTokens() {
  try { return JSON.parse(localStorage.getItem(TOKEN_KEY)) || null; } catch { return null; }
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault(); setError(""); setIsSubmitting(true);
    try { const tokens = await login(username.trim(), password); localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens)); await onLogin(tokens); }
    catch (requestError) { setError(requestError.message); } finally { setIsSubmitting(false); }
  }

  return <main className="auth-layout">
    <section className="auth-panel"><div className="brand-mark">AR</div><p className="eyebrow">Portfolio CMS</p><h1>Welcome back.</h1><p className="muted">Sign in to manage the content behind your portfolio.</p>
      <form className="login-form" onSubmit={handleSubmit}><label htmlFor="username">Username or email</label><input id="username" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} /><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />{error && <p className="error-message" role="alert">{error}</p>}<button className="primary-button" disabled={isSubmitting} type="submit">{isSubmitting ? "Signing in..." : "Sign in"}</button></form>
    </section><aside className="auth-aside"><div className="aside-topline"><span className="status-dot" /> Admin workspace</div><h2>Your portfolio, in your hands.</h2><p>Keep your projects, writing, experience, and media ready for the public site.</p><div className="aside-rule" /><span className="aside-caption">FastAPI + React + PostgreSQL</span></aside>
  </main>;
}

function TextField({ label, name, value, onChange, multiline = false, required = false, placeholder = "" }) {
  const id = `field-${name}`;
  return <label className="field" htmlFor={id}><span>{label}</span>{multiline ? <textarea id={id} name={name} required={required} value={value || ""} onChange={onChange} placeholder={placeholder} /> : <input id={id} name={name} required={required} value={value || ""} onChange={onChange} placeholder={placeholder} />}</label>;
}

function EditorHeader({ title, description, onBack }) {
  return <div className="editor-header"><button className="back-button" type="button" onClick={onBack}>← Back</button><p className="eyebrow">Content editor</p><h1>{title}</h1><p className="muted">{description}</p></div>;
}

function AboutEditor({ token, onBack }) {
  const blank = { headline: "", summary: "", bio: "", profile_image_url: "", resume_url: "", location: "", email: "", github_url: "", linkedin_url: "" };
  const [form, setForm] = useState(blank); const [isLoading, setIsLoading] = useState(true); const [isSaving, setIsSaving] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  useEffect(() => { getContent("/about", token).then((data) => data && setForm(data)).catch((e) => setError(e.message)).finally(() => setIsLoading(false)); }, [token]);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  async function submit(event) { event.preventDefault(); setIsSaving(true); setMessage(""); setError(""); try { await saveContent("/about", "PUT", form, token); setMessage("About content saved."); } catch (e) { setError(e.message); } finally { setIsSaving(false); } }
  if (isLoading) return <EditorLayout title="About" description="Loading your profile content..."><Loading /></EditorLayout>;
  return <EditorLayout title="About" description="Keep the introduction on your portfolio current." onBack={onBack}><form className="editor-form" onSubmit={submit}><div className="form-section"><h2>Profile</h2><div className="form-grid"><TextField label="Headline" name="headline" value={form.headline} onChange={update} required /><TextField label="Location" name="location" value={form.location} onChange={update} /><TextField label="Summary" name="summary" value={form.summary} onChange={update} required multiline /><TextField label="Bio" name="bio" value={form.bio} onChange={update} multiline /></div></div><div className="form-section"><h2>Links and contact</h2><div className="form-grid"><TextField label="Email" name="email" value={form.email} onChange={update} /><TextField label="Profile image URL" name="profile_image_url" value={form.profile_image_url} onChange={update} /><TextField label="Resume URL" name="resume_url" value={form.resume_url} onChange={update} /><TextField label="GitHub URL" name="github_url" value={form.github_url} onChange={update} /><TextField label="LinkedIn URL" name="linkedin_url" value={form.linkedin_url} onChange={update} /></div></div><FormStatus message={message} error={error} /><FormActions isSaving={isSaving} /></form></EditorLayout>;
}

const blankSkill = { name: "", category: "", icon_url: "", proficiency: "", display_order: 0, is_featured: false };
function SkillsEditor({ token, onBack }) {
  const [items, setItems] = useState([]); const [form, setForm] = useState(blankSkill); const [editingId, setEditingId] = useState(null); const [error, setError] = useState(""); const [message, setMessage] = useState(""); const [isLoading, setIsLoading] = useState(true); const [isSaving, setIsSaving] = useState(false);
  const load = () => getContent("/skills", token).then(setItems).catch((e) => setError(e.message)).finally(() => setIsLoading(false));
  useEffect(() => { load(); }, [token]); const update = (event) => setForm({ ...form, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value });
  function edit(item) { setEditingId(item.id); setForm({ ...item, proficiency: item.proficiency ?? "" }); setMessage(""); }
  function reset() { setEditingId(null); setForm(blankSkill); }
  async function submit(event) { event.preventDefault(); setIsSaving(true); setError(""); setMessage(""); const payload = { ...form, proficiency: form.proficiency === "" ? null : Number(form.proficiency), display_order: Number(form.display_order) }; try { await saveContent(editingId ? `/skills/${editingId}` : "/skills", editingId ? "PUT" : "POST", payload, token); setMessage(editingId ? "Skill updated." : "Skill created."); reset(); await load(); } catch (e) { setError(e.message); } finally { setIsSaving(false); } }
  async function remove(item) { if (!window.confirm(`Delete ${item.name}?`)) return; try { await deleteContent(`/skills/${item.id}`, token); setMessage("Skill deleted."); await load(); } catch (e) { setError(e.message); } }
  return <EditorLayout title="Skills" description="Organize the technologies and strengths you want to highlight." onBack={onBack}><div className="split-editor"><form className="editor-form compact-form" onSubmit={submit}><div className="form-section"><h2>{editingId ? "Edit skill" : "Add skill"}</h2><TextField label="Name" name="name" value={form.name} onChange={update} required /><TextField label="Category" name="category" value={form.category} onChange={update} required /><TextField label="Icon URL" name="icon_url" value={form.icon_url} onChange={update} /><div className="inline-fields"><TextField label="Proficiency (0-100)" name="proficiency" value={form.proficiency} onChange={update} /><TextField label="Display order" name="display_order" value={form.display_order} onChange={update} /></div><label className="check-field"><input type="checkbox" name="is_featured" checked={form.is_featured} onChange={update} /> Feature this skill</label><FormActions isSaving={isSaving} editing={Boolean(editingId)} onCancel={editingId ? reset : undefined} /></div></form><div className="list-panel"><div className="list-heading"><h2>Current skills</h2><span>{items.length}</span></div>{isLoading ? <Loading /> : items.length === 0 ? <EmptyState text="No skills yet. Add your first one." /> : items.map((item) => <div className="list-row" key={item.id}><div><strong>{item.name}</strong><span>{item.category}{item.proficiency !== null ? ` · ${item.proficiency}%` : ""}</span></div><div className="row-actions"><button type="button" onClick={() => edit(item)}>Edit</button><button className="danger-link" type="button" onClick={() => remove(item)}>Delete</button></div></div>)}<FormStatus message={message} error={error} /></div></div></EditorLayout>;
}

const blankProject = { title: "", slug: "", summary: "", description: "", image_url: "", live_url: "", repo_url: "", tech_stack: "", display_order: 0, is_featured: false, is_published: true };
function ProjectsEditor({ token, onBack }) {
  const [items, setItems] = useState([]); const [form, setForm] = useState(blankProject); const [editingId, setEditingId] = useState(null); const [error, setError] = useState(""); const [message, setMessage] = useState(""); const [isLoading, setIsLoading] = useState(true); const [isSaving, setIsSaving] = useState(false);
  const load = () => getContent("/projects", token).then(setItems).catch((e) => setError(e.message)).finally(() => setIsLoading(false));
  useEffect(() => { load(); }, [token]); const update = (event) => setForm({ ...form, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value });
  function edit(item) { setEditingId(item.id); setForm({ ...item, tech_stack: item.tech_stack.join(", ") }); setMessage(""); }
  function reset() { setEditingId(null); setForm(blankProject); }
  async function submit(event) { event.preventDefault(); setIsSaving(true); setError(""); setMessage(""); const payload = { ...form, tech_stack: form.tech_stack.split(",").map((value) => value.trim()).filter(Boolean), display_order: Number(form.display_order) }; try { await saveContent(editingId ? `/projects/${editingId}` : "/projects", editingId ? "PUT" : "POST", payload, token); setMessage(editingId ? "Project updated." : "Project created."); reset(); await load(); } catch (e) { setError(e.message); } finally { setIsSaving(false); } }
  async function remove(item) { if (!window.confirm(`Delete ${item.title}?`)) return; try { await deleteContent(`/projects/${item.id}`, token); setMessage("Project deleted."); await load(); } catch (e) { setError(e.message); } }
  return <EditorLayout title="Projects" description="Present your best work with clear summaries and links." onBack={onBack}><div className="split-editor"><form className="editor-form project-form" onSubmit={submit}><div className="form-section"><h2>{editingId ? "Edit project" : "Add project"}</h2><div className="form-grid"><TextField label="Title" name="title" value={form.title} onChange={update} required /><TextField label="Slug" name="slug" value={form.slug} onChange={update} required /><TextField label="Summary" name="summary" value={form.summary} onChange={update} required multiline /><TextField label="Description" name="description" value={form.description} onChange={update} multiline /><TextField label="Tech stack (comma separated)" name="tech_stack" value={form.tech_stack} onChange={update} /><TextField label="Image URL" name="image_url" value={form.image_url} onChange={update} /><TextField label="Live URL" name="live_url" value={form.live_url} onChange={update} /><TextField label="Repository URL" name="repo_url" value={form.repo_url} onChange={update} /></div><label className="check-field"><input type="checkbox" name="is_featured" checked={form.is_featured} onChange={update} /> Featured project</label><label className="check-field"><input type="checkbox" name="is_published" checked={form.is_published} onChange={update} /> Published</label><FormActions isSaving={isSaving} editing={Boolean(editingId)} onCancel={editingId ? reset : undefined} /></div></form><div className="list-panel"><div className="list-heading"><h2>Current projects</h2><span>{items.length}</span></div>{isLoading ? <Loading /> : items.length === 0 ? <EmptyState text="No projects yet. Add your first one." /> : items.map((item) => <div className="list-row" key={item.id}><div><strong>{item.title}</strong><span>{item.is_published ? "Published" : "Draft"}{item.is_featured ? " · Featured" : ""}</span></div><div className="row-actions"><button type="button" onClick={() => edit(item)}>Edit</button><button className="danger-link" type="button" onClick={() => remove(item)}>Delete</button></div></div>)}<FormStatus message={message} error={error} /></div></div></EditorLayout>;
}

const collectionDefinitions = {
  Blogs: { endpoint: "blogs", title: "Blogs", description: "Publish useful writing and keep your articles organized.", blank: { title: "", slug: "", excerpt: "", content: "", cover_image_url: "", tags: "", is_published: false, published_at: "" }, fields: [{ label: "Title", name: "title", required: true }, { label: "Slug", name: "slug", required: true }, { label: "Excerpt", name: "excerpt", required: true, multiline: true }, { label: "Content", name: "content", required: true, multiline: true }, { label: "Cover image URL", name: "cover_image_url" }, { label: "Tags (comma separated)", name: "tags", kind: "tags" }, { label: "Published at", name: "published_at", placeholder: "2026-01-30T10:00:00" }, { label: "Published", name: "is_published", kind: "checkbox" }], listTitle: (item) => item.title, listMeta: (item) => item.is_published ? "Published" : "Draft" },
  Testimonials: { endpoint: "testimonials", title: "Testimonials", description: "Collect the words that make your work credible.", blank: { name: "", role: "", company: "", quote: "", avatar_url: "", display_order: 0, is_published: true }, fields: [{ label: "Name", name: "name", required: true }, { label: "Role", name: "role" }, { label: "Company", name: "company" }, { label: "Quote", name: "quote", required: true, multiline: true }, { label: "Avatar URL", name: "avatar_url" }, { label: "Display order", name: "display_order", kind: "number" }, { label: "Published", name: "is_published", kind: "checkbox" }], listTitle: (item) => item.name, listMeta: (item) => [item.role, item.company].filter(Boolean).join(" · ") || "Testimonial" },
  Experience: { endpoint: "experience", title: "Experience", description: "Build a clear timeline of the work behind your portfolio.", blank: { title: "", company: "", location: "", start_date: "", end_date: "", description: "", highlights: "", display_order: 0, is_current: false }, fields: [{ label: "Title", name: "title", required: true }, { label: "Company", name: "company", required: true }, { label: "Location", name: "location" }, { label: "Start date", name: "start_date", required: true, placeholder: "January 2024" }, { label: "End date", name: "end_date", placeholder: "Present" }, { label: "Description", name: "description", multiline: true }, { label: "Highlights (comma separated)", name: "highlights", kind: "tags" }, { label: "Display order", name: "display_order", kind: "number" }, { label: "Current role", name: "is_current", kind: "checkbox" }], listTitle: (item) => item.title, listMeta: (item) => `${item.company} · ${item.start_date}${item.end_date ? ` - ${item.end_date}` : ""}` },
  Services: { endpoint: "services", title: "Services", description: "Explain the work people can hire you to do.", blank: { title: "", slug: "", summary: "", description: "", icon_url: "", display_order: 0, is_published: true }, fields: [{ label: "Title", name: "title", required: true }, { label: "Slug", name: "slug", required: true }, { label: "Summary", name: "summary", required: true, multiline: true }, { label: "Description", name: "description", multiline: true }, { label: "Icon URL", name: "icon_url" }, { label: "Display order", name: "display_order", kind: "number" }, { label: "Published", name: "is_published", kind: "checkbox" }], listTitle: (item) => item.title, listMeta: (item) => item.is_published ? "Published" : "Draft" },
};

function CollectionEditor({ token, type, onBack }) {
  const definition = collectionDefinitions[type];
  const [items, setItems] = useState([]); const [form, setForm] = useState(definition.blank); const [editingId, setEditingId] = useState(null); const [error, setError] = useState(""); const [message, setMessage] = useState(""); const [isLoading, setIsLoading] = useState(true); const [isSaving, setIsSaving] = useState(false);
  const load = () => getContent(`/${definition.endpoint}`, token).then(setItems).catch((e) => setError(e.message)).finally(() => setIsLoading(false));
  useEffect(() => { load(); }, [token, definition.endpoint]);
  function update(event) { const { name, value, type: inputType, checked } = event.target; setForm({ ...form, [name]: inputType === "checkbox" ? checked : value }); }
  function edit(item) { const next = { ...definition.blank, ...item }; for (const field of definition.fields) if (field.kind === "tags") next[field.name] = (item[field.name] || []).join(", "); if (item.published_at) next.published_at = item.published_at.slice(0, 16); setEditingId(item.id); setForm(next); setMessage(""); }
  function reset() { setEditingId(null); setForm({ ...definition.blank }); }
  function payload() { const next = { ...form }; for (const field of definition.fields) { if (field.kind === "tags") next[field.name] = next[field.name].split(",").map((value) => value.trim()).filter(Boolean); if (field.kind === "number") next[field.name] = Number(next[field.name]); if (field.name === "published_at" && !next[field.name]) next[field.name] = null; } return next; }
  async function submit(event) { event.preventDefault(); setIsSaving(true); setError(""); setMessage(""); try { await saveContent(editingId ? `/${definition.endpoint}/${editingId}` : `/${definition.endpoint}`, editingId ? "PUT" : "POST", payload(), token); setMessage(editingId ? `${type.slice(0, -1)} updated.` : `${type.slice(0, -1)} created.`); reset(); await load(); } catch (e) { setError(e.message); } finally { setIsSaving(false); } }
  async function remove(item) { if (!window.confirm(`Delete ${definition.listTitle(item)}?`)) return; try { await deleteContent(`/${definition.endpoint}/${item.id}`, token); setMessage(`${type.slice(0, -1)} deleted.`); await load(); } catch (e) { setError(e.message); } }
  return <EditorLayout title={definition.title} description={definition.description} onBack={onBack}><div className="split-editor"><form className="editor-form collection-form" onSubmit={submit}><div className="form-section"><h2>{editingId ? `Edit ${type.slice(0, -1).toLowerCase()}` : `Add ${type.slice(0, -1).toLowerCase()}`}</h2><div className="form-grid">{definition.fields.map((field) => <CollectionField key={field.name} field={field} value={form[field.name]} onChange={update} />)}</div><FormActions isSaving={isSaving} editing={Boolean(editingId)} onCancel={editingId ? reset : undefined} /></div><FormStatus message={message} error={error} /></form><div className="list-panel"><div className="list-heading"><h2>Current {type.toLowerCase()}</h2><span>{items.length}</span></div>{isLoading ? <Loading /> : items.length === 0 ? <EmptyState text={`No ${type.toLowerCase()} yet. Add the first one.`} /> : items.map((item) => <div className="list-row" key={item.id}><div><strong>{definition.listTitle(item)}</strong><span>{definition.listMeta(item)}</span></div><div className="row-actions"><button type="button" onClick={() => edit(item)}>Edit</button><button className="danger-link" type="button" onClick={() => remove(item)}>Delete</button></div></div>)}<FormStatus message={message} error={error} /></div></div></EditorLayout>;
}

function CollectionField({ field, value, onChange }) {
  if (field.kind === "checkbox") return <label className="check-field"><input type="checkbox" name={field.name} checked={Boolean(value)} onChange={onChange} /> {field.label}</label>;
  return <TextField label={field.label} name={field.name} value={value} onChange={onChange} multiline={field.multiline} required={field.required} placeholder={field.placeholder} />;
}

function MediaEditor({ token, onBack }) {
  const [file, setFile] = useState(null); const [uploaded, setUploaded] = useState(null); const [error, setError] = useState(""); const [isUploading, setIsUploading] = useState(false);
  async function submit(event) { event.preventDefault(); if (!file) return; setError(""); setUploaded(null); setIsUploading(true); try { setUploaded(await uploadImage(file, token)); setFile(null); event.target.reset(); } catch (e) { setError(e.message); } finally { setIsUploading(false); } }
  return <EditorLayout title="Media" description="Upload images for your portfolio content." onBack={onBack}><div className="media-panel"><form className="media-form" onSubmit={submit}><div className="upload-dropzone"><span className="content-icon">M</span><h2>Upload an image</h2><p>JPEG, PNG, WebP, or GIF up to 5 MB.</p><input id="media-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required onChange={(event) => setFile(event.target.files?.[0] || null)} /><label htmlFor="media-file" className="secondary-button">Choose image</label>{file && <span className="selected-file">{file.name}</span>}</div><button className="primary-button" disabled={!file || isUploading} type="submit">{isUploading ? "Uploading..." : "Upload image"}</button>{uploaded && <p className="success-message" role="status">Uploaded successfully: {uploaded.original_name}</p>}{error && <p className="error-message" role="alert">{error}</p>}</form></div></EditorLayout>;
}

function EditorLayout({ title, description, onBack, children }) { return <><header className="editor-topbar"><span className="brand-mark small">AR</span><span>Portfolio CMS</span></header><main className="editor-page"><EditorHeader title={title} description={description} onBack={onBack} />{children}</main></>; }
function Loading() { return <p className="empty-state">Loading...</p>; }
function EmptyState({ text }) { return <p className="empty-state">{text}</p>; }
function FormStatus({ message, error }) { return <>{message && <p className="success-message" role="status">{message}</p>}{error && <p className="error-message" role="alert">{error}</p>}</>; }
function FormActions({ isSaving, editing = false, onCancel }) { return <div className="form-actions"><button className="primary-button" disabled={isSaving} type="submit">{isSaving ? "Saving..." : editing ? "Save changes" : "Save"}</button>{onCancel && <button className="secondary-button" type="button" onClick={onCancel}>Cancel</button>}</div>; }

function Dashboard({ user, token, onLogout }) {
  const [section, setSection] = useState("Overview");
  if (section === "About") return <AboutEditor token={token} onBack={() => setSection("Overview")} />;
  if (section === "Skills") return <DashboardFrame user={user} section={section} onSelect={setSection} onLogout={onLogout}><SkillsEditor token={token} onBack={() => setSection("Overview")} /></DashboardFrame>;
  if (section === "Projects") return <DashboardFrame user={user} section={section} onSelect={setSection} onLogout={onLogout}><ProjectsEditor token={token} onBack={() => setSection("Overview")} /></DashboardFrame>;
  if (collectionDefinitions[section]) return <DashboardFrame user={user} section={section} onSelect={setSection} onLogout={onLogout}><CollectionEditor token={token} type={section} onBack={() => setSection("Overview")} /></DashboardFrame>;
  if (section === "Media") return <DashboardFrame user={user} section={section} onSelect={setSection} onLogout={onLogout}><MediaEditor token={token} onBack={() => setSection("Overview")} /></DashboardFrame>;
  return <DashboardFrame user={user} section={section} onSelect={setSection} onLogout={onLogout}><Overview onSelect={setSection} /></DashboardFrame>;
}

function DashboardFrame({ user, section, onSelect, onLogout, children }) { return <main className="dashboard-layout"><aside className="sidebar"><div className="sidebar-brand"><span className="brand-mark small">AR</span><span>Portfolio CMS</span></div><nav aria-label="CMS sections"><p className="nav-label">Workspace</p><button className={`nav-item ${section === "Overview" ? "active" : ""}`} type="button" onClick={() => onSelect("Overview")}><span>▦</span> Overview</button><p className="nav-label">Content</p>{contentAreas.slice(0, 7).map((area) => <button className={`nav-item ${section === area.label ? "active" : ""}`} key={area.label} type="button" onClick={() => onSelect(area.label)}><span>{area.icon}</span> {area.label}</button>)}<p className="nav-label">Assets</p><button className="nav-item" type="button" onClick={() => onSelect("Media")}><span>M</span> Media</button></nav><button className="logout-button" onClick={onLogout} type="button">Sign out</button></aside><section className="dashboard-content"><header className="dashboard-header"><div><p className="eyebrow">{section}</p><h1>Good to see you, {user.full_name || user.username}.</h1></div><div className="profile-chip"><span className="avatar">{(user.full_name || user.username).slice(0, 1).toUpperCase()}</span><span>{user.username}</span></div></header>{children}</section></main>; }
function Overview({ onSelect }) { return <><div className="welcome-banner"><div><span className="banner-kicker">CMS is ready</span><h2>Shape the story people find online.</h2><p>Manage your portfolio content from one focused workspace.</p></div><span className="banner-symbol">✦</span></div><section className="section-heading"><div><p className="eyebrow">Content library</p><h2>Manage your portfolio</h2></div><span className="count-badge">{contentAreas.length} areas</span></section><div className="content-grid">{contentAreas.map((area) => <button className="content-card" key={area.label} type="button" onClick={() => onSelect(area.label)}><span className="content-icon">{area.icon}</span><div><h3>{area.label}</h3><p>{area.detail}</p></div><span className="arrow">→</span></button>)}</div></>; }

export default function App() {
  const [tokens, setTokens] = useState(readTokens); const [user, setUser] = useState(null); const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const handleTokenRefresh = (event) => setTokens(event.detail);
    const handleAuthExpired = () => { localStorage.removeItem(TOKEN_KEY); setTokens(null); setUser(null); };
    window.addEventListener("portfolio-cms-token-refreshed", handleTokenRefresh);
    window.addEventListener("portfolio-cms-auth-expired", handleAuthExpired);
    return () => { window.removeEventListener("portfolio-cms-token-refreshed", handleTokenRefresh); window.removeEventListener("portfolio-cms-auth-expired", handleAuthExpired); };
  }, []);
  useEffect(() => { if (!tokens?.access_token) { setIsLoading(false); return; } getCurrentUser(tokens.access_token).then(setUser).catch(() => { localStorage.removeItem(TOKEN_KEY); setTokens(null); }).finally(() => setIsLoading(false)); }, [tokens]);
  async function finishLogin(nextTokens) { setTokens(nextTokens); setUser(await getCurrentUser(nextTokens.access_token)); }
  function logout() { localStorage.removeItem(TOKEN_KEY); setTokens(null); setUser(null); }
  if (isLoading) return <div className="loading-screen">Loading workspace...</div>;
  if (!user) return <LoginScreen onLogin={finishLogin} />;
  return <Dashboard user={user} token={tokens.access_token} onLogout={logout} />;
}

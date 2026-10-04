import { useEffect, useState } from "react";
import { getCurrentUser, login } from "./api";

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
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY)) || null;
  } catch {
    return null;
  }
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const tokens = await login(username.trim(), password);
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
      await onLogin(tokens);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="brand-mark">AR</div>
        <p className="eyebrow">Portfolio CMS</p>
        <h1>Welcome back.</h1>
        <p className="muted">Sign in to manage the content behind your portfolio.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username or email</label>
          <input
            id="username"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && <p className="error-message" role="alert">{error}</p>}
          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
      <aside className="auth-aside">
        <div className="aside-topline"><span className="status-dot" /> Admin workspace</div>
        <h2>Your portfolio, in your hands.</h2>
        <p>Keep your projects, writing, experience, and media ready for the public site.</p>
        <div className="aside-rule" />
        <span className="aside-caption">FastAPI + React + PostgreSQL</span>
      </aside>
    </main>
  );
}

function Dashboard({ user, onLogout }) {
  return (
    <main className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand"><span className="brand-mark small">AR</span><span>Portfolio CMS</span></div>
        <nav aria-label="CMS sections">
          <p className="nav-label">Workspace</p>
          <button className="nav-item active" type="button"><span>▦</span> Overview</button>
          <p className="nav-label">Content</p>
          {contentAreas.slice(0, 7).map((area) => (
            <button className="nav-item" key={area.label} type="button"><span>{area.icon}</span> {area.label}</button>
          ))}
          <p className="nav-label">Assets</p>
          <button className="nav-item" type="button"><span>M</span> Media</button>
        </nav>
        <button className="logout-button" onClick={onLogout} type="button">Sign out</button>
      </aside>
      <section className="dashboard-content">
        <header className="dashboard-header">
          <div><p className="eyebrow">Overview</p><h1>Good to see you, {user.full_name || user.username}.</h1></div>
          <div className="profile-chip"><span className="avatar">{(user.full_name || user.username).slice(0, 1).toUpperCase()}</span><span>{user.username}</span></div>
        </header>
        <div className="welcome-banner"><div><span className="banner-kicker">CMS is ready</span><h2>Shape the story people find online.</h2><p>Manage your portfolio content from one focused workspace.</p></div><span className="banner-symbol">✦</span></div>
        <section className="section-heading"><div><p className="eyebrow">Content library</p><h2>Manage your portfolio</h2></div><span className="count-badge">{contentAreas.length} areas</span></section>
        <div className="content-grid">
          {contentAreas.map((area) => <article className="content-card" key={area.label}><span className="content-icon">{area.icon}</span><div><h3>{area.label}</h3><p>{area.detail}</p></div><span className="arrow">→</span></article>)}
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [tokens, setTokens] = useState(readTokens);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tokens?.access_token) {
      setIsLoading(false);
      return;
    }
    getCurrentUser(tokens.access_token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setTokens(null);
      })
      .finally(() => setIsLoading(false));
  }, [tokens]);

  async function finishLogin(nextTokens) {
    setTokens(nextTokens);
    setUser(await getCurrentUser(nextTokens.access_token));
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setTokens(null);
    setUser(null);
  }

  if (isLoading) return <div className="loading-screen">Loading workspace...</div>;
  if (!user) return <LoginScreen onLogin={finishLogin} />;
  return <Dashboard user={user} onLogout={logout} />;
}

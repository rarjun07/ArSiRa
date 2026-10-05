const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export function resolveMediaUrl(value) {
  if (!value || /^https?:\/\//i.test(value)) return value;
  const apiOrigin = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
  return `${apiOrigin}${value.startsWith("/") ? value : `/${value}`}`;
}

async function get(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) throw new Error(`Unable to load ${path}.`);
  return response.json();
}

export function getPortfolioContent() {
  return Promise.all([
    get("/about"),
    get("/skills"),
    get("/projects"),
    get("/blogs"),
    get("/testimonials"),
    get("/experience"),
    get("/education"),
  ]);
}

export async function submitContact(payload) {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || "Unable to send your message.");
  return data;
}

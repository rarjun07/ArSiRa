const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const TOKEN_KEY = "portfolio_cms_tokens";

function formatApiError(detail, fallback) {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") return item;
        const location = Array.isArray(item.loc) ? `${item.loc.join(".")}: ` : "";
        return `${location}${item.msg || "Validation error"}`;
      })
      .join(" ");
  }
  if (detail && typeof detail === "object") return detail.message || JSON.stringify(detail);
  return fallback;
}

async function request(path, options = {}) {
  const { headers = {}, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (response.status === 401 && headers.Authorization && path !== "/auth/refresh") {
    let storedTokens;
    try { storedTokens = JSON.parse(localStorage.getItem(TOKEN_KEY)); } catch { storedTokens = null; }
    if (storedTokens?.refresh_token) {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: storedTokens.refresh_token }),
      });
      if (refreshResponse.ok) {
        const refreshedTokens = await refreshResponse.json();
        localStorage.setItem(TOKEN_KEY, JSON.stringify(refreshedTokens));
        window.dispatchEvent(new CustomEvent("portfolio-cms-token-refreshed", { detail: refreshedTokens }));
        return request(path, {
          ...requestOptions,
          headers: { ...headers, Authorization: `Bearer ${refreshedTokens.access_token}` },
        });
      }
    }
    window.dispatchEvent(new Event("portfolio-cms-auth-expired"));
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(formatApiError(payload.detail, "The request could not be completed."));
  }

  if (response.status === 204) return null;
  return response.json();
}

export function login(username, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getCurrentUser(accessToken) {
  return request("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function getContent(path, accessToken) {
  return request(path, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function saveContent(path, method, payload, accessToken) {
  return request(path, {
    method,
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(payload),
  });
}

export function deleteContent(path, accessToken) {
  return request(path, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function uploadImage(file, accessToken) {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch(`${API_BASE_URL}/upload/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(formatApiError(data.detail, "Unable to upload the image."));
  return data;
}

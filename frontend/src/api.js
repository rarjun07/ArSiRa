const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || "The request could not be completed.");
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
  if (!response.ok) throw new Error(data.detail || "Unable to upload the image.");
  return data;
}

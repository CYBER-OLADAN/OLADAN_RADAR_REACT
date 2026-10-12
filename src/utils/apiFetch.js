const API_BASE = import.meta.env.VITE_API_URL || "";

export default async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token && token !== "undefined" && token !== "null"
      ? { Authorization: `Bearer ${token}` }
      : {}),
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return null;
  }
  return res;
}

export { apiFetch };
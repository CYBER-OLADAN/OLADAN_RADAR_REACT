export default async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token && token !== "undefined" && token !== "null"
      ? { Authorization: `Bearer ${token}` }
      : {}),
    ...options.headers,
  };
  const res = await fetch(path, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return null;
  }
  return res;
}

export { apiFetch };
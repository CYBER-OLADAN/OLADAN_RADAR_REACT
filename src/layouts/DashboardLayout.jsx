import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function DashboardLayout({ title, links }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  };
  const handleLogout = () => { logout(); window.location.href = "/login"; };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2 style={{ color: "var(--text)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>Oladan Radar</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                color: location.pathname === l.to ? "#fff" : "#d1d5db",
                background: location.pathname === l.to ? "#1f2937" : "transparent",
                padding: "0.55rem 0.75rem",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
              onClick={() => setSidebarOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid #334155" }}>
          <div style={{ color: "#d1d5db", padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}>
            {user?.firstName} {user?.lastName}
          </div>
          <div style={{ color: "var(--text-muted)", padding: "0 0.75rem 0.5rem", fontSize: "0.75rem" }}>
            {user?.email}
          </div>
          <button
            onClick={toggleTheme}
            className="btn btn-link text-sm"
            style={{ width: "100%", justifyContent: "flex-start", color: "#d1d5db", borderColor: "#334155", marginBottom: "0.5rem" }}
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-link text-sm"
            style={{ width: "100%", justifyContent: "flex-start", color: "#f87171", borderColor: "#334155" }}
          >
            Logout
          </button>
        </div>
      </aside>
      <div className={`dashboard-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />
      <main style={{ flex: 1, background: "var(--bg)", color: "var(--text)", minWidth: 0 }}>
        <header style={{ background: "var(--nav-bg)", color: "var(--text)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button className="hamburger-btn" onClick={() => setSidebarOpen((s) => !s)} aria-label="Toggle menu">☰</button>
          <strong className="dashboard-title">{title}</strong>
        </header>
        <div className="container"><Outlet /></div>
      </main>
    </div>
  );
}
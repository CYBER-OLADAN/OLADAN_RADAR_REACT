import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../OladanGlow.css";

export default function DashboardLayout({ title, links }) {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <h2 className="oladan-glow">
          Oladan Radar
        </h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1 }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setSidebarOpen(false)}
              style={{
                color: location.pathname === l.to ? "#fff" : "#d1d5db",
                background: location.pathname === l.to ? "#1f2937" : "transparent",
                padding: "0.55rem 0.75rem",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ paddingTop: "1rem", borderTop: "1px solid #334155" }}>
          <div style={{ color: "#d1d5db", padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}>
            {user?.firstName} {user?.lastName}
          </div>
          <div style={{ color: "#94a3b8", padding: "0 0.75rem 0.5rem", fontSize: "0.75rem" }}>
            {user?.email}
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-link text-sm"
            style={{
              width: "100%",
              justifyContent: "flex-start",
              color: "#d1d5db",
              borderColor: "#334155",
            }}
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </aside>

      <div
        className={`dashboard-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <button
            type="button"
            className="hamburger-btn"
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <strong className="dashboard-title">{title}</strong>
        </header>
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
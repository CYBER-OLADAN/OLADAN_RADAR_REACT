import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function PublicLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  };
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };
  return (
    <div>
      <nav className="public-nav">
        <Link to="/" className="logo">Oladan Radar</Link>
        <div className="nav-links">
          <Link to="/properties">Browse Properties</Link>
          {isAuthenticated ? (
            <>
              <span className="user-name">Welcome, {user ? `${user.firstName} ${user.lastName}`.trim() : "User"}</span>
              <Link to={`/${user?.role}/dashboard`} className="btn btn-link text-sm">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-link text-sm">Logout</button>
              <button
                onClick={toggleTheme}
                className="btn btn-link text-sm"
                title="Toggle theme"
                aria-label="Toggle theme"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-link text-sm">Login</Link>
              <Link to="/register" className="btn btn-link text-sm ml-2">Register</Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
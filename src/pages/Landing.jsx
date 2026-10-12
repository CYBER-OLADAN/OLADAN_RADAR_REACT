import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { isAuthenticated, role, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container">
      <section style={{ textAlign: "center", padding: "3rem 0 2rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", lineHeight: 1.2 }}>
          Find Your Perfect Home with Oladan Radar
        </h1>
        <p style={{ fontSize: "1.15rem", maxWidth: 640, margin: "0 auto 2rem", color: "var(--text-muted)" }}>
          Browse hundreds of verified listings from trusted landlords. Save your favorites,
          apply in minutes, and move in faster than ever.
        </p>
        {isAuthenticated ? (
          <>
            <p className="mt-2">Signed in as <strong>{user?.firstName} {user?.lastName}</strong> ({role})</p>
            <button className="btn btn-primary mt-4" onClick={() => navigate(`/${role}/dashboard`)}>
              Go to Your Dashboard
            </button>
          </>
        ) : (
          <div className="flex gap-4 mt-4" style={{ justifyContent: "center" }}>
            <Link to="/register" className="btn btn-primary">Get Started Free</Link>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
          </div>
        )}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "3rem" }}>
        <div className="card text-center">
          <h3>🔍 Search</h3>
          <p>Filter by location, price, and property type to find exactly what you need.</p>
        </div>
        <div className="card text-center">
          <h3>❤️ Save</h3>
          <p>Bookmark properties you love and come back to them anytime.</p>
        </div>
        <div className="card text-center">
          <h3>📝 Apply</h3>
          <p>Submit applications in seconds. Track their status in real time.</p>
        </div>
        <div className="card text-center">
          <h3>🏠 List</h3>
          <p>Landlords: post properties with photos and manage applicants in one place.</p>
        </div>
      </section>

      <section className="card" style={{ marginTop: "3rem", textAlign: "center" }}>
        <h2>Ready to find your next home?</h2>
        <p>Join tenants and landlords already using Oladan Radar.</p>
        {!isAuthenticated && (
          <Link to="/register" className="btn btn-primary mt-4">Create Your Account</Link>
        )}
      </section>
    </div>
  );
}
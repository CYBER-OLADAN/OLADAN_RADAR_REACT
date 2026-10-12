import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/apiFetch";

export default function TenantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiFetch("/api/v1/properties").then((r) => r.json()).then((data) => {
        if (cancelled) return;
        setProperties(Array.isArray(data) ? data : data.properties || []);
      }),
      apiFetch("/api/v1/applications").then((r) => r.json()).then((data) => {
        if (cancelled) return;
        setApplications(data || []);
      }),
    ]).catch((e) => !cancelled && setError(e.message)).finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p style={{ color: "#dc2626" }}>{error}</p></div>;

  return (
    <div className="container">
      <h2>Welcome, {user?.firstName ? `${user.firstName} ${user.lastName}`.trim() : "User"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "var(--bg-card)", padding: "1rem", borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏠</div>
          <strong>{properties.length}</strong>
          <div>Properties</div>
        </div>
        <div style={{ background: "var(--bg-card)", padding: "1rem", borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📝</div>
          <strong>{applications.length}</strong>
          <div>Applications</div>
        </div>
      </div>
      <h3>Recommended Properties</h3>
      {properties.length === 0 ? (
        <p>No properties available yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {properties.slice(0, 4).map((p) => (
            <div key={p._id} className="card">
              <h3>{p.title}</h3>
              <p>{p.location}</p>
              <p><strong>₦{p.price?.toLocaleString?.() || p.price}</strong></p>
              <p className="text-sm">{p.bedrooms || "?"} bed · {p.bathrooms || "?"} bath</p>
              <button className="btn btn-secondary mt-2" onClick={() => navigate(`/properties/${p._id}`)}>View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
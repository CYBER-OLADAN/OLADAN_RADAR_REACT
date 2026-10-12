import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/apiFetch";

export default function LandlordDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiFetch("/api/v1/properties/mine").then((r) => r.json()).then((data) => {
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

  const pending = applications.filter((a) => a.status === "pending").length;
  const accepted = applications.filter((a) => a.status === "accepted").length;

  return (
    <div className="container">
      <h2>Landlord Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "var(--bg-card)", padding: "1rem", borderRadius: 8, textAlign: "center" }}><strong>{properties.length}</strong><br/>Total Properties</div>
        <div style={{ background: "var(--bg-card)", padding: "1rem", borderRadius: 8, textAlign: "center" }}><strong>{pending}</strong><br/>Pending Applications</div>
        <div style={{ background: "var(--bg-card)", padding: "1rem", borderRadius: 8, textAlign: "center" }}><strong>{accepted}</strong><br/>Accepted Applications</div>
        <div style={{ background: "var(--bg-card)", padding: "1rem", borderRadius: 8, textAlign: "center" }}><strong>{applications.length}</strong><br/>Total Applications</div>
      </div>
      <button className="btn btn-primary mt-2" onClick={() => navigate("/landlord/properties/new")}>Add Property</button>
      
    </div>
  );
}
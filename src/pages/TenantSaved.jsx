import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/apiFetch";

export default function TenantSaved() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/v1/saved").then((r) => r.json()).then((data) => {
      if (cancelled) return;
      setSaved(Array.isArray(data) ? data : data.saved || []);
    }).catch((e) => !cancelled && setError(e.message)).finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="container"><p>Loading saved properties...</p></div>;
  if (error) return <div className="container"><p style={{ color: "#dc2626" }}>{error}</p></div>;

  return (
    <div className="container">
      <h1>Saved Properties</h1>
      {saved.length === 0 ? (
        <p>No saved properties yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {saved.map((s) => {
            const prop = typeof s === "object" && s.propertyId ? s : s;
            return (
              <div key={prop._id || prop.id || s._id} style={{ background: "#fff", padding: "1rem", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                <h3>{prop.title || "Unknown"}</h3>
                <p>{prop.location || ""}</p>
                <p><strong>₦{prop.price?.toLocaleString?.() || prop.price}</strong></p>
                <button className="btn btn-secondary mt-2" onClick={() => navigate("/tenant/saved")}>Remove</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
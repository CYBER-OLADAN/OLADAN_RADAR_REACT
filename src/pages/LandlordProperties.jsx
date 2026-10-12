import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

export default function LandlordProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    let cancelled = false;
    apiFetch("/api/v1/properties/mine")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setProperties(Array.isArray(data) ? data : data.properties || []);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      const res = await apiFetch(`/api/v1/properties/${id}`, { method: "DELETE" });
      if (res && res.ok) {
        setProperties((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div><p>Loading properties...</p></div>;
  if (error) return <div><p style={{ color: "#dc2626" }}>{error}</p></div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
        <h1>My Properties</h1>
        <Link to="/landlord/properties/new" className="btn btn-primary">+ Add Property</Link>
      </div>

      {properties.length === 0 ? (
        <div className="card">
          <p>You haven't added any properties yet.</p>
          <Link to="/landlord/properties/new" className="btn btn-primary mt-2">Add Your First Property</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {properties.map((p) => {
            const imgs = (p.images && p.images.length >= 2 ? p.images.slice(0, 2) : [p.images?.[0] || p.imageUrl]).filter(Boolean);
            return (
              <div key={p._id} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "grid", gridTemplateColumns: imgs.length > 1 ? "repeat(auto-fill, minmax(200px, 1fr))" : "1fr", gap: 2 }}>
                  {imgs.map((url, i) => (
                    <img key={i} src={url} alt={p.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                  ))}
                </div>
                <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ marginBottom: "0.25rem" }}>{p.title}</h3>
                  <p className="text-sm" style={{ marginBottom: "0.5rem" }}>{p.location}</p>
                  <p style={{ fontWeight: 600, color: "var(--primary)", marginBottom: "0.5rem" }}>₦{Number(p.price).toLocaleString()}</p>
                  <p className="text-sm" style={{ marginBottom: "0.75rem", textTransform: "capitalize" }}>Status: {p.status}</p>
                  <div className="flex gap-2" style={{ marginTop: "auto" }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate(`/landlord/properties/${p._id}`)}
                    >
                      View
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate(`/landlord/properties/${p._id}/edit`)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
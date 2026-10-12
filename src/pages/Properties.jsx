import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/properties")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setProperties(Array.isArray(data) ? data : data.properties || []);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="container"><p>Loading properties...</p></div>;
  if (error) return <div className="container"><p style={{ color: "#dc2626" }}>{error}</p></div>;

  return (
    <div className="container">
      <h1>Browse Properties</h1>
      {properties.length === 0 ? (
        <div className="card"><p>No properties available yet.</p></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {properties.map((p) => (
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
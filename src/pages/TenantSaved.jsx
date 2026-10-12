import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

export default function TenantSaved() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const navigate = useNavigate();

  const loadSaved = () => {
    setLoading(true);
    let cancelled = false;
    apiFetch("/api/v1/saved")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setSaved(Array.isArray(data) ? data : data.saved || []);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleRemove = async (savedId) => {
    if (!savedId) return;
    setBusy(savedId);
    try {
      const res = await apiFetch(`/api/v1/saved/${savedId}`, { method: "DELETE" });
      if (!res || !res.ok) {
        const data = res ? await res.json().catch(() => ({})) : {};
        alert(data.message || "Failed to remove");
        return;
      }
      setSaved((prev) => prev.filter((s) => s._id !== savedId));
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <div><p>Loading saved properties...</p></div>;
  if (error) return <div><p style={{ color: "#dc2626" }}>{error}</p></div>;

  return (
    <div>
      <h1>Saved Properties</h1>

      {saved.length === 0 ? (
        <div className="card">
          <p>You haven't saved any properties yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {saved.map((item) => {
            const property = item.property || {};
            const imgs = (property.images && property.images.length >= 2
              ? property.images.slice(0, 2)
              : [property.images?.[0] || property.imageUrl]).filter(Boolean);

            return (
              <div key={item._id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                {imgs.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: imgs.length > 1 ? "1fr 1fr" : "1fr", gap: 2 }}>
                    {imgs.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={property.title}
                        style={{ width: "100%", height: 160, objectFit: "cover" }}
                      />
                    ))}
                  </div>
                )}

                <div style={{ padding: "1rem" }}>
                  <h3 style={{ marginBottom: "0.25rem" }}>{property.title || "Property"}</h3>
                  <p className="text-sm" style={{ marginBottom: "0.5rem" }}>{property.location || ""}</p>
                  <p style={{ fontWeight: 600, color: "var(--primary)", marginBottom: "0.75rem" }}>
                    ₦{Number(property.price || 0).toLocaleString()}
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => navigate(`/tenant/properties/${property._id}`)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemove(item._id)}
                      disabled={busy === item._id}
                    >
                      {busy === item._id ? "..." : "Remove"}
                    </button>
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
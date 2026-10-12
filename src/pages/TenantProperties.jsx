import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

export default function TenantProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    type: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/v1/properties")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setProperties(Array.isArray(data) ? data : data.properties || []);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const loc = (p.location || "").toLowerCase();
      const title = (p.title || "").toLowerCase();
      const search = filters.location.toLowerCase();
      if (search && !loc.includes(search) && !title.includes(search)) return false;
      if (filters.minPrice && Number(p.price) < Number(filters.minPrice)) return false;
      if (filters.maxPrice && Number(p.price) > Number(filters.maxPrice)) return false;
      if (filters.type && p.type !== filters.type) return false;
      return true;
    });
  }, [properties, filters]);

  if (loading) return <div className="container"><p>Loading properties...</p></div>;
  if (error) return <div className="container"><p style={{ color: "#dc2626" }}>{error}</p></div>;

  return (
    <div>
      <h1>Browse Properties</h1>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Location</label>
            <input value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} placeholder="City or area" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Min Price</label>
            <input type="number" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} placeholder="0" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Max Price</label>
            <input type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} placeholder="Any" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Type</label>
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option value="">All Types</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="room">Room</option>
              <option value="land">Land</option>
              <option value="shop">Shop</option>
            </select>
          </div>
        </div>
        <button className="btn btn-secondary mt-2" onClick={() => setFilters({ location: "", minPrice: "", maxPrice: "", type: "" })}>
          Clear Filters
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><p>No properties match your filters.</p></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {filtered.map((p) => {
            const twoImages = (p.images && p.images.length >= 2 ? p.images.slice(0, 2) : [p.images?.[0] || p.imageUrl]).filter(Boolean);
            return (
              <div key={p._id} className="card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: twoImages.length > 1 ? "1fr 1fr" : "1fr", gap: 2 }}>
                  {twoImages.map((url, i) => (
                    <img key={i} src={url} alt={p.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                  ))}
                </div>
                <div style={{ padding: "1rem" }}>
                  <h3 style={{ marginBottom: "0.25rem" }}>{p.title}</h3>
                  <p className="text-sm" style={{ marginBottom: "0.5rem" }}>{p.location}</p>
                  <p style={{ fontWeight: 600, color: "var(--primary)", marginBottom: "0.5rem" }}>₦{Number(p.price).toLocaleString()}</p>
                  <p className="text-sm" style={{ marginBottom: "0.75rem" }}>{p.bedrooms || "?"} bed · {p.bathrooms || "?"} bath</p>
                  <div className="flex gap-2">
                    <button className="btn btn-primary" onClick={() => navigate(`/tenant/properties/${p._id}`)}>View</button>
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
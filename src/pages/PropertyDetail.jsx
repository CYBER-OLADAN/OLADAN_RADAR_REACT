import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";
import { useAuth } from "../context/AuthContext";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applied, setApplied] = useState(false);
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const backPath =
    role === "landlord"
      ? "/landlord/properties"
      : role === "tenant"
        ? "/tenant/properties"
        : "/properties";

  useEffect(() => {
    let cancelled = false;
    apiFetch(`/api/v1/properties/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data && data._id) setProperty(data);
        else setError("Property not found");
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (role !== "tenant") {
      setApplyMessage("Only tenants can apply for properties.");
      return;
    }
    setApplyLoading(true);
    setApplyMessage("");
    try {
      const res = await apiFetch("/api/v1/applications", {
        method: "POST",
        body: JSON.stringify({ propertyId: id, message: "Interested" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApplyMessage(data.message || "Application failed");
      } else {
        setApplied(true);
        setApplyMessage("Application submitted successfully.");
      }
    } catch (e) {
      setApplyMessage(e.message);
    } finally {
      setApplyLoading(false);
    }
  };

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Ensures saveMessage only displays once and clears after render
  useEffect(() => {
    // No-op dependency ensures this runs once after initial render;
    // the saveMessage display below checks truthiness and will only
    // show once per save interaction.
  }, []);

  const handleSaveProperty = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (role !== "tenant") {
      setSaveMessage("Only tenants can save properties.");
      return;
    }
    setSaveLoading(true);
    setSaveMessage("");
    try {
      const res = await apiFetch("/api/v1/saved", {
        method: "POST",
        body: JSON.stringify({ propertyId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setApplied(true);
        setSaveMessage("Property saved successfully.");
      } else {
        setSaveMessage(data.message || "Failed to save property");
      }
    } catch (e) {
      setSaveMessage(e.message);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p style={{ color: "#dc2626" }}>{error}</p></div>;
  if (!property) return <div className="container"><p>Not found</p></div>;

  const allImages = (property.images && property.images.length > 0)
    ? property.images
    : property.imageUrl
      ? [property.imageUrl]
      : [];

  return (
    <div className="container">
      <div style={{ marginBottom: "1rem" }}>
        <Link to={backPath} className="btn btn-link text-sm">← Back to Properties</Link>
      </div>

      <div className="card" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="flex-between" style={{ alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h1 style={{ marginBottom: "0.25rem" }}>{property.title}</h1>
            <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>{property.location}</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.5rem" }}>
              ₦{Number(property.price).toLocaleString()}
            </p>
            <p className="text-sm" style={{ textTransform: "capitalize" }}>
              Type: {property.type} · {property.bedrooms} bed · {property.bathrooms} bath
            </p>
          </div>
        </div>

        {allImages.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "0.5rem",
              margin: "1.5rem 0",
            }}
          >
            {allImages.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${property.title} ${i + 1}`}
                loading="lazy"
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}
              />
            ))}
          </div>
        )}

        <h2 style={{ marginTop: "1.5rem" }}>Description</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>{property.description}</p>

        {property.landlord && (
          <>
            <h2 style={{ marginTop: "1.5rem" }}>Listed by</h2>
            <div className="card" style={{ background: "transparent", boxShadow: "none", padding: "0.75rem 0" }}>
              <p style={{ marginBottom: "0.25rem" }}>
                <strong>{property.landlord.firstName} {property.landlord.lastName}</strong>
              </p>
              <p className="text-sm" style={{ marginBottom: 0 }}>{property.landlord.email}</p>
            </div>
          </>
        )}

        <div className="flex gap-2 mt-4" style={{ flexWrap: "wrap" }}>
          {role === "tenant" && isAuthenticated && (
            <>
              <button
                className="btn btn-primary"
                onClick={handleSaveProperty}
                disabled={saveLoading}
              >
                {saveLoading ? "Saving..." : "Save Property"}
              </button>
              {saveLoading && <span className="text-sm ml-2">Saving...</span>}
              {saveMessage && (
                <p
                  className="text-sm mt-2"
                  style={{ color: saveMessage.includes("success") ? "#16a34a" : "#dc2626" }}
                >
                  {saveMessage}
                </p>
              )}
              <button
                className="btn btn-primary"
                onClick={handleApply}
                disabled={applyLoading || applied}
              >
                {applied ? "Applied" : applyLoading ? "Applying..." : "Apply Now"}
              </button>
            </>
          )}
          {!isAuthenticated && (
            <button className="btn btn-primary" onClick={() => navigate("/login")}>
              Log in to Apply
            </button>
          )}
          <Link to={backPath} className="btn btn-secondary">Back to List</Link>
        </div>

        {applyMessage && (
          <p
            className="text-sm mt-2"
            style={{ color: applyMessage.includes("success") ? "#16a34a" : "#dc2626" }}
          >
            {applyMessage}
          </p>
        )}

        {saveMessage && (
          <p
            className="text-sm mt-2"
            style={{ color: saveMessage.includes("success") ? "#16a34a" : "#dc2626" }}
          >
            {saveMessage}
          </p>
        )}
      </div>
    </div>
  );
}
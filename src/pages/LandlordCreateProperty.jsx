import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../utils/apiFetch";
import ImageUploader from "../components/ImageUploader";

export default function LandlordCreateProperty() {
  const [form, setForm] = useState({ title: "", description: "", price: "", location: "", type: "sale", bedrooms: "", bathrooms: "", images: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    if (!form.title) { setError("Title is required"); return false; }
    if (!form.description) { setError("Description is required"); return false; }
    if (!form.price || Number(form.price) <= 0) { setError("Price must be a positive number"); return false; }
    if (!form.type) { setError("Type is required"); return false; }
    if (!form.location) { setError("Location is required"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    if (!validate()) { setLoading(false); return; }
    if (form.images.length < 3) {
      setError("Please upload at least 3 images");
      setLoading(false);
      return;
    }
    try {
      // Send imageUrl as first image for backward compatibility, and images array
      const submitForm = {
        ...form,
        imageUrl: form.images[0] || "",
        price: Number(form.price),
        bedrooms: Number(form.bedrooms) || undefined,
        bathrooms: Number(form.bathrooms) || undefined,
      };
      const res = await apiFetch("/api/v1/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create property");
      navigate("/landlord/properties");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Add to radar</h1>
      {error && <p style={{ color: "#dc2626" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <div style={{ marginBottom: "0.5rem" }}><label>Title</label> <input value={form.title} onChange={update("title")} required style={{ width: "100%", padding: "0.5rem" }} /></div>
        <div style={{ marginBottom: "0.5rem" }}><label>Description</label> <input value={form.description} onChange={update("description")} style={{ width: "100%", padding: "0.5rem" }} /></div>
        <div style={{ marginBottom: "0.5rem" }}><label>Price</label> <input value={form.price} onChange={update("price")} type="number" required style={{ width: "100%", padding: "0.5rem" }} /></div>
        <div style={{ marginBottom: "0.5rem" }}><label>Location</label> <input value={form.location} onChange={update("location")} required style={{ width: "100%", padding: "0.5rem" }} /></div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>Type</label>
          <select value={form.type} onChange={update("type")} style={{ width: "100%", padding: "0.5rem" }}>
            <option value="">Select type</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="room">Room</option>
            <option value="land">Land</option>
            <option value="shop">Shop</option>
          </select>
        </div>
        <div style={{ marginBottom: "0.5rem" }}><label>Bedrooms</label> <input value={form.bedrooms} onChange={update("bedrooms")} type="number" style={{ width: "100%", padding: "0.5rem" }} /></div>
        <div style={{ marginBottom: "0.5rem" }}><label>Bathrooms</label> <input value={form.bathrooms} onChange={update("bathrooms")} type="number" style={{ width: "100%", padding: "0.5rem" }} /></div>
        <ImageUploader
    values={form.images}
    onChange={(urls) => setForm({ ...form, images: urls })}
    min={3}
    max={10}
    label="Property Image"
  />
        <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} disabled={loading}>{loading ? "Creating..." : "Create Property"}</button>
      </form>
    </div>
  );
}
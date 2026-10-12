import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../utils/apiFetch";
import ImageUploader from "../components/ImageUploader";

export default function LandlordEditProperty() {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "sale",
    bedrooms: "",
    bathrooms: "",
    images: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    apiFetch(`/api/v1/properties/${id}`).then((r) => r.json()).then((data) => {
      if (data.images && data.images.length > 0) {
        form.images = data.images;
        form.imageUrl = data.images[0];
      } else if (data.imageUrl) {
        form.images = [data.imageUrl];
        form.imageUrl = data.imageUrl;
      } else {
        form.images = [];
        form.imageUrl = "";
      }
      setForm({
      title: data.title || "",
      description: data.description || "",
      price: data.price != null ? String(data.price) : "",
      location: data.location || "",
      type: data.type || "sale",
      bedrooms: data.bedrooms != null ? String(data.bedrooms) : "",
      bathrooms: data.bathrooms != null ? String(data.bathrooms) : "",
      images: Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : data.imageUrl
          ? [data.imageUrl]
          : [],
    });
      setLoading(false);
    }).catch((e) => { console.error(e); setLoading(false); });
  }, [id]);

  const validate = () => {
    if (!form.title) { setError("Title is required"); return false; }
    if (!form.price || Number(form.price) <= 0) { setError("Price must be a positive number"); return false; }
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
        price: Number(form.price) || 0,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      };
      const res = await apiFetch(`/api/v1/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update property");
      navigate("/landlord/properties");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Edit Property</h1>
      {error && <p style={{ color: "#dc2626" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <div style={{ marginBottom: "0.5rem" }}><label>Title</label> <input value={form.title || ""} onChange={update("title")} required style={{ width: "100%", padding: "0.5rem" }} /></div>
        <div style={{ marginBottom: "0.5rem" }}><label>Description</label> <input value={form.description || ""} onChange={update("description")} style={{ width: "100%", padding: "0.5rem" }} /></div>
        <div style={{ marginBottom: "0.5rem" }}><label>Price</label> <input value={form.price || ""} onChange={update("price")} type="number" required style={{ width: "100%", padding: "0.5rem" }} /></div>
        <div style={{ marginBottom: "0.5rem" }}><label>Location</label> <input value={form.location || ""} onChange={update("location")} required style={{ width: "100%", padding: "0.5rem" }} /></div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>Type</label>
          <select value={form.type || ""} onChange={update("type")} style={{ width: "100%", padding: "0.5rem" }}>
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
        <div style={{ marginBottom: "0.5rem" }}><label>Bedrooms</label> <input value={form.bedrooms || ""} onChange={update("bedrooms")} type="number" style={{ width: "100%", padding: "0.5rem" }} /></div>
        <div style={{ marginBottom: "0.5rem" }}><label>Bathrooms</label> <input value={form.bathrooms || ""} onChange={update("bathrooms")} type="number" style={{ width: "100%", padding: "0.5rem" }} /></div>
        <ImageUploader
    values={form.images}
    onChange={(urls) => setForm({ ...form, images: urls })}
    min={3}
    max={10}
    label="Property Image"
  />
        <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>Update Property</button>
      </form>
    </div>
  );
}
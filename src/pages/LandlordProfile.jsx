import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validatePassword } from "../utils/passwordValidation";
import apiFetch from "../utils/apiFetch";

export default function LandlordProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const passwordErrors = form.password ? validatePassword(form.password) : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(false); setLoading(true);
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
    };
    if (form.password.trim()) {
      payload.password = form.password;
    }
    try {
      const res = await apiFetch("/api/v1/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Profile update failed");
      setSuccess(true);
      setForm({ firstName: "", lastName: "", email: "", password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Profile</h1>
      {success && <p style={{ color: "#059669" }}>Profile updated successfully!</p>}
      {error && <p style={{ color: "#dc2626" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}><label>First Name</label> <input value={form.firstName} onChange={update("firstName")} required style={{ width: "100%", padding: "0.5rem" }} /></div>
        <div style={{ marginBottom: "1rem" }}><label>Last Name</label> <input value={form.lastName} onChange={update("lastName")} required style={{ width: "100%", padding: "0.5rem" }} /></div>
        <div style={{ marginBottom: "1rem" }}><label>Email</label> <input value={form.email} onChange={update("email")} type="email" required style={{ width: "100%", padding: "0.5rem" }} /></div>
        <div style={{ marginBottom: "1rem" }}><label>New Password (optional)</label> <input value={form.password} onChange={update("password")} type="password" minLength={6} style={{ width: "100%", padding: "0.5rem" }} /></div>
        {form.password && passwordErrors.length > 0 && (
          <ul className="text-sm" style={{ color: "#dc2626", marginTop: "0.35rem", paddingLeft: "1.25rem" }}>
            {passwordErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
        <button type="submit" className="btn-primary" style={{ width: "100%" }}>Update Profile</button>
      </form>
      <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Role: <strong>{user?.role || "landlord"}</strong></p>
    </div>
  );
}
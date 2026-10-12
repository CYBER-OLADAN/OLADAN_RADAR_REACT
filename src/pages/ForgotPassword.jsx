import React, { useState } from "react";
import { Link } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await apiFetch("/api/v1/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      setSuccess("If that email exists, we sent a reset link");
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: "2rem auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Forgot Password</h2>
        {error && <p style={{ color: "#dc2626", textAlign: "center" }}>{error}</p>}
        {success && <p style={{ color: "#059669", textAlign: "center" }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={!email}>
            Send reset link
          </button>
        </form>
        <p className="mt-2 text-center text-sm">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
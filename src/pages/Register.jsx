import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validatePassword } from "../utils/passwordValidation";

const sanitizeName = (value) => value.replace(/[^A-Za-z\s'-]/g, "");

export default function Register() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", role: "tenant" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (k) => (e) => setForm({ ...form, [k]: k === "firstName" || k === "lastName" ? sanitizeName(e.target.value) : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const pwdErrors = validatePassword(form.password);
    if (pwdErrors.length > 0) {
      setError("Password is not strong enough");
      return;
    }
    const namePattern = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;
    if (!namePattern.test(form.firstName.trim())) {
      setError("First name must be letters only (2–50 characters)");
      return;
    }
    if (!namePattern.test(form.lastName.trim())) {
      setError("Last name must be letters only (2–50 characters)");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { confirmPassword, ...payload } = form;
      const res = await apiFetch("/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      if (data.token && data.user) {
        login(data.token, data.user);
        navigate(`/${data.user.role}/dashboard`);
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 460, margin: "2rem auto" }}>
        <h1>Create an Account</h1>
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" value={form.firstName} onChange={update("firstName")} required />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" value={form.lastName} onChange={update("lastName")} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={update("email")} required autoComplete="email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={update("password")}
                required
                autoComplete="new-password"
                style={{ paddingRight: "4.5rem", width: "100%" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="btn btn-link text-sm"
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "0.25rem 0.6rem",
                  margin: 0,
                  lineHeight: 1,
                  height: "auto",
                  minWidth: "auto",
                  background: "transparent",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {form.password && validatePassword(form.password).length > 0 && (
              <ul className="text-sm" style={{ color: "#dc2626", marginTop: "0.35rem", paddingLeft: "1.25rem" }}>
                {validatePassword(form.password).map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                required
                autoComplete="new-password"
                style={{ paddingRight: "4.5rem", width: "100%" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="btn btn-link text-sm"
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "0.25rem 0.6rem",
                  margin: 0,
                  lineHeight: 1,
                  height: "auto",
                  minWidth: "auto",
                  background: "transparent",
                }}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-sm" style={{ color: "#dc2626", marginTop: "0.35rem" }}>Passwords do not match</p>
            )}
          </div>
          <div className="form-group">
            <label>I am a</label>
            <select value={form.role} onChange={update("role")}>
              <option value="tenant">Tenant (looking to rent)</option>
              <option value="landlord">Landlord (listing properties)</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-sm">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
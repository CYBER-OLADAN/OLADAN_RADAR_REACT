import React, { useState } from "react";
import "../App.css";

const AuthPage = () => {
  const [formType, setFormType] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // Role is auto-determined from email in login; shown only for signup
  const [role, setRole] = useState("tenant");
  const [error, setError] = useState("");

  // Extract role from email domain/local-part for auto-detection
  const detectRoleFromEmail = (email) => {
    if (!email) return "tenant";
    const domain = email.split("@")[1]?.toLowerCase() || "";
    // Example: landlord emails end with @landlord.com, tenants @tenant.com
    if (domain.includes("landlord")) return "landlord";
    if (domain.includes("tenant")) return "tenant";
    return "tenant"; // default
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (formType === "signup") {
        // For signup, we still show role selector
        const res = await fetch("/api/v1/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password, role }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.href = "/";
        } else {
          setError(data.message || "Signup failed");
        }
      } else {
        // For login, auto-detect role from email
        const detectedRole = detectRoleFromEmail(email);
        const res = await fetch("/api/v1/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          // Store detected role so future logins remember it
          localStorage.setItem("userRole", detectedRole);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.href = "/";
        } else {
          setError(data.message || "Login failed");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>{formType === "signup" ? "Create Account" : "Login"}</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {formType === "signup" ? (
            <>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </>
          ) : null}

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Show role selector only for signup, and pre-select based on email for login */}
          {formType === "signup" ? (
            <div className="role-select">
              <label>Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
              </select>
            </div>
          ) : (
            // For login, show detected role read-only
            <div className="role-detect">
              <label>Detected Role:</label>
              <span>{role}</span>
            </div>
          )}

          <button type="submit" className="btn-primary">
            {formType === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="toggle-link">
          {formType === "signup" ? (
            <p>Already have an account? <a href="#" onClick={(e) => setFormType("login")}>Login</a></p>
          ) : (
            <p>Don't have an account? <a href="#" onClick={(e) => setFormType("signup")}>Sign Up</a></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
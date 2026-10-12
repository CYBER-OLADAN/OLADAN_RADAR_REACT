import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validatePassword } from "../utils/passwordValidation";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    const params = useSearchParams();
    const tokenFromUrl = params.get("token");
    if (!tokenFromUrl) {
      setError("Missing or invalid reset token");
    } else {
      setToken(tokenFromUrl);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch("/api/v1/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      setSuccess("Password reset successful. You can now log in.");
      setNewPassword(""); setConfirmPassword("");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pwdErrors = validatePassword(newPassword);

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: "2rem auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Reset Password</h2>
        {error && <p style={{ color: "#dc2626", textAlign: "center" }}>{error}</p>}
        {success && <p style={{ color: "#059669", textAlign: "center" }}>{success}</p>}
        {token && !success && !error && (
          <p style={{ textAlign: "center", marginBottom: "2rem" }}>
            Missing or invalid reset token
          </p>
        )}
        <form onSubmit={handleSubmit} disabled={loading}>
          <div className="form-group">
            <label>New Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={spinner ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={{ paddingRight: "4.5rem", width: "100%" }}
              />
              <button
                type="button"
                onClick={() => setSpinner((s) => !s)}
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
                {spinner ? "Hide" : "Show"}
              </button>
            </div>
            {pwdErrors.length > 0 && (
              <ul className="text-sm" style={{ color: "#dc2626", marginTop: "0.35rem", paddingLeft: "1.25rem" }}>
                {pwdErrors.map((err) => <li key={err}>{err}</li>)}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={spinner ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={{ paddingRight: "4.5rem", width: "100%" }}
              />
              <button
                type="button"
                onClick={() => setSpinner((s) => !s)}
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
                {spinner ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {success && (
          <p className="mt-2 text-center text-sm">
            <Link to="/login">You can now log in</Link>
          </p>
        )}
        {error && (
          <p className="mt-2 text-center text-sm" style={{ color: "#dc2626" }}>
            <Link to="/login">Try again</Link>
          </p>
        )}
      </div>
    </div>
  );
}
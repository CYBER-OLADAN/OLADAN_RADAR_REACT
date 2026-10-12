import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validatePassword } from "../utils/passwordValidation";
import apiFetch from "../utils/apiFetch";

export default function LandlordProfile() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  };
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdError(""); setPwdSuccess(""); setPwdLoading(true);
    if (form.newPassword !== form.confirmPassword) {
      setPwdError("New passwords do not match");
      setPwdLoading(false);
      return;
    }
    if (form.newPassword.length < 8) {
      setPwdError("New password must be at least 8 characters");
      setPwdLoading(false);
      return;
    }
    try {
      const res = await apiFetch("/api/v1/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPwdError(data.message || "Failed to update password");
        return;
      }
      setPwdSuccess("Password updated successfully");
      setPwdLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwdError(err.message);
      setPwdLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Profile</h1>
      {success && <p style={{ color: "#059669" }}>Profile updated successfully!</p>}
      {error && <p style={{ color: "#dc2626" }}>{error}</p>}
      {pwdError && <p className="text-sm" style={{ color: "#dc2626", marginTop: "0.5rem" }}>{pwdError}</p>}
      {pwdSuccess && <p className="text-sm" style={{ color: "#16a34a", marginTop: "0.5rem" }}>{pwdSuccess}</p>}

      {/* SECTION A — Read-only account info */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Account Information</h2>

        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={user?.firstName || ""}
            readOnly
            disabled
            style={{ background: "var(--bg)", cursor: "not-allowed", opacity: 0.7 }}
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={user?.lastName || ""}
            readOnly
            disabled
            style={{ background: "var(--bg)", cursor: "not-allowed", opacity: 0.7 }}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            disabled
            style={{ background: "var(--bg)", cursor: "not-allowed", opacity: 0.7 }}
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            value={user?.role || "landlord"}
            readOnly
            disabled
            style={{ background: "var(--bg)", cursor: "not-allowed", opacity: 0.7 }}
          />
        </div>

        <p className="text-sm" style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
          To change your name, email, or role, please contact the RADAR <a href="mailto:oladan012@gmail.com">oladan012@gmail.com</a>.
        </p>
      </div>

        {/* Appearance card */}
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h2>Appearance</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Choose how the app looks. Your preference is saved on this device.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={toggleTheme}
            style={{ marginTop: "0.75rem" }}
          >
            {theme === "light" ? "🌙 Switch to Dark Mode" : "☀️ Switch to Light Mode"}
          </button>
        </div>

      {/* SECTION B — Password change form (still editable) */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Change Password</h2>

        <form onSubmit={handlePasswordSubmit} disabled={pwdLoading}>
          <div className="form-group">
            <label>Current Password</label>
            <div className="password-field">
              <input
                type={showCurrent ? "text" : "password"}
                value={form.currentPassword || ""}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent((s) => !s)}
                className="password-toggle"
                aria-label="Toggle password visibility"
              >
                {showCurrent ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>New Password</label>
            <div className="password-field">
              <input
                type={showNew ? "text" : "password"}
                value={form.newPassword || ""}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                className="password-toggle"
                aria-label="Toggle password visibility"
              >
                {showNew ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="password-field">
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword || ""}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="password-toggle"
                aria-label="Toggle password visibility"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {form.confirmPassword && form.newPassword !== form.confirmPassword && (
              <p className="text-sm" style={{ color: "#dc2626", marginTop: "0.35rem" }}>
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={pwdLoading}
          >
            {pwdLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
        {pwdError && <p className="text-sm" style={{ color: "#dc2626", marginTop: "0.5rem" }}>{pwdError}</p>}
        {pwdSuccess && <p className="text-sm" style={{ color: "#16a34a", marginTop: "0.5rem" }}>{pwdSuccess}</p>}
      </div>

      {/* SECTION C — Logout card at the bottom */}
      <div className="card">
        <h2>Session</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Logging out will end your session on this device. You can log back in anytime.
        </p>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            const { logout } = useAuth();
            logout();
            window.location.href = "/login";
          }}
          style={{ marginTop: "0.75rem" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
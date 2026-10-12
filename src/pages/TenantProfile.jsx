import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../utils/apiFetch";

export default function TenantProfile() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (newPassword !== confirmPassword) {
      setPwdError("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setPwdError("New password must be at least 8 characters");
      return;
    }

    setPwdLoading(true);
    try {
      const res = await apiFetch("/api/v1/profile", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPwdError(data.message || "Failed to update password");
        return;
      }
      setPwdSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwdError(err.message);
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Profile</h1>

      {/* Account info — read only */}
      <div className="card">
        <h2>Account Information</h2>

        <div className="form-group">
          <label>First Name</label>
          <input type="text" value={user?.firstName || ""} readOnly disabled
            style={{ background: "var(--bg)", cursor: "not-allowed", opacity: 0.7 }} />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input type="text" value={user?.lastName || ""} readOnly disabled
            style={{ background: "var(--bg)", cursor: "not-allowed", opacity: 0.7 }} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={user?.email || ""} readOnly disabled
            style={{ background: "var(--bg)", cursor: "not-allowed", opacity: 0.7 }} />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input type="text" value={user?.role || ""} readOnly disabled
            style={{ background: "var(--bg)", cursor: "not-allowed", opacity: 0.7 }} />
        </div>

        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          To change your name, email, or role, please contact the RADAR via <a href="mailto:oladan012@gmail.com">oladan012@gmail.com</a>.
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

      {/* Password change */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h2>Change Password</h2>

        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <div className="password-field">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
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
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm" style={{ color: "#dc2626", marginTop: "0.35rem" }}>
                Passwords do not match
              </p>
            )}
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm" style={{ color: "#dc2626", marginTop: "0.35rem" }}>
                Passwords do not match
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={pwdLoading}>
            {pwdLoading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {pwdError && <p className="text-sm" style={{ color: "#dc2626", marginTop: "0.5rem" }}>{pwdError}</p>}
        {pwdSuccess && <p className="text-sm" style={{ color: "#16a34a", marginTop: "0.5rem" }}>{pwdSuccess}</p>}
      </div>

      {/* Logout */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h2>Session</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Logging out will end your session on this device.
        </p>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
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
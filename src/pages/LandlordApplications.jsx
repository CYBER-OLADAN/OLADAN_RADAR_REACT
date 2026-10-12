import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../utils/apiFetch";

export default function LandlordApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/v1/applications").then((r) => r.json()).then((data) => {
      if (cancelled) return;
      setApplications(Array.isArray(data) ? data : data.items || data.applications || []);
    }).catch((e) => !cancelled && setError(e.message)).finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="container"><p>Loading applications...</p></div>;
  if (error) return <div className="container"><p style={{ color: "#dc2626" }}>{error}</p></div>;

  const getTenantName = (tenant) => {
    if (!tenant) return "";
    const name = `${tenant.firstName || ""} ${tenant.lastName || ""}`.trim();
    return name ? name : tenant.email || "";
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: "#fef3c7", color: "#92400e" },
      accepted: { bg: "#dcfce7", color: "#166534" },
      rejected: { bg: "#fee2e2", color: "#991b1b" },
    };
    const map = statusMap[status] || { bg: "#e5e7eb", color: "#374151" };
    return (
      <span
        style={{
          padding: "0.25rem 0.6rem",
          borderRadius: "999px",
          fontSize: "0.75rem",
          fontWeight: 600,
          background: map.bg,
          color: map.color,
        }}
      >
        {status}
      </span>
    );
  };

  const getAppliedOn = (createdAt) => {
    if (!createdAt) return "";
    return new Date(createdAt).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const updateStatus = async (id, status) => {
    setBusy(id);
    try {
      const res = await apiFetch(`/api/v1/applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || "Failed to update");
        return;
      }
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status, acceptedAt: status === "accepted" ? new Date().toISOString() : null } : a))
      );
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="container">
      <h1>Applications</h1>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ background: "var(--bg-card)", color: "var(--text)" }}>
              <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>Tenant Name</th>
              <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>Property</th>
              <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>Applied On</th>
              <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>Status</th>
              <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => {
              const tenant = a.tenant
                ? { firstName: a.tenant.firstName, lastName: a.tenant.lastName, email: a.tenant.email }
                : {};
              const property = a.property ? { title: a.property.title } : {};

// Accept/Reject buttons shown only for pending
              let actionBtns = null;
              if (String(a.status || "").toLowerCase() === "pending") {
                actionBtns = (
                  <div className="flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => updateStatus(a._id, "accepted")}
                      disabled={busy === a._id}
                    >
                      {busy === a._id ? "..." : "Accept"}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => updateStatus(a._id, "rejected")}
                      disabled={busy === a._id}
                    >
                      {busy === a._id ? "..." : "Reject"}
                    </button>
                  </div>
                );
              } else {
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {a.status === "accepted" ? "Accepted" : "Rejected"}
                </span>
              }

              return (
                <tr key={a._id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.5rem" }}>{getTenantName(tenant)}</td>
                  <td style={{ padding: "0.5rem" }}>{property.title || "Deleted property"}</td>
                  <td style={{ padding: "0.5rem" }}>{getAppliedOn(a.createdAt)}</td>
                  <td style={{ padding: "0.5rem" }}>{getStatusBadge(a.status)}</td>
                  <td>
                {String(a.status || "").toLowerCase() === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary text-sm"
                      onClick={() => updateStatus(a._id, "accepted")}
                      disabled={busy === a._id}
                    >
                      {busy === a._id ? "..." : "Accept"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger text-sm"
                      onClick={() => updateStatus(a._id, "rejected")}
                      disabled={busy === a._id}
                    >
                      {busy === a._id ? "..." : "Decline"}
                    </button>
                  </div>
                ) : (
                  <span
                    className="text-sm"
                    style={{
                      padding: "0.25rem 0.6rem",
                      borderRadius: "999px",
                      fontWeight: 600,
                      background: String(a.status).toLowerCase() === "accepted" ? "#dcfce7" : "#fee2e2",
                      color: String(a.status).toLowerCase() === "accepted" ? "#166534" : "#991b1b",
                    }}
                  >
                    {String(a.status).toLowerCase() === "accepted" ? "Accepted" : "Declined"}
                  </span>
                )}
              </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
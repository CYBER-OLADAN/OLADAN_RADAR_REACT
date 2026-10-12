import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../utils/apiFetch";

export default function TenantApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/v1/applications")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setApplications(data || []);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
  }, []);

  if (loading) return <div className="container"><p>Loading applications...</p></div>;
  if (error) return <div className="container"><p style={{ color: "#dc2626" }}>{error}</p></div>;

  return (
    <div className="container">
      <h1>My Applications</h1>
      {applications.length === 0 ? (
        <p>You haven't applied to any properties yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ background: "var(--bg-card)", color: "var(--text)" }}>
              <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>Property</th>
              <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>Applied On</th>
              <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>Status</th>
              <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>View</th>
              <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => (
              <tr key={a._id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <td style={{ padding: "0.5rem" }}>{a.property?.title || "—"}</td>
                <td style={{ padding: "0.5rem" }}>
                  {a.createdAt ? new Date(a.createdAt).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }) : "—"}
                </td>
<td style={{ padding: "0.5rem" }}>{a.status || "pending"}</td>
              <td>
                {a.property?._id ? (
                  <button
                    type="button"
                    className="btn btn-link text-sm"
                    onClick={() => navigate(`/tenant/properties/${a.property._id}`)}
                  >
                    View
                  </button>
                ) : (
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>—</span>
                )}
              </td>
              <td style={{ padding: "0.5rem" }}>
                  <button className="btn btn-link text-sm text-red-600" onClick={() => window.confirm("Withdraw this application?")}>Withdraw</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
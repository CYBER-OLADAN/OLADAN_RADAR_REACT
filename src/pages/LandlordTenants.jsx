import { useEffect, useState } from "react";
import apiFetch from "../utils/apiFetch";

export default function LandlordTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/v1/applications")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data.applications || [];
        const accepted = list.filter((a) => a.status === "accepted");
        setTenants(accepted);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div><p>Loading tenants...</p></div>;
  if (error) return <div><p style={{ color: "#dc2626" }}>{error}</p></div>;

  return (
    <div>
      <h1>Tenants</h1>

      {tenants.length === 0 ? (
        <div className="card">
          <p>No tenants yet. Accept applications to see tenants here.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-card)", color: "var(--text)" }}>
                <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>Tenant Name</th>
                <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>Property</th>
                <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>Accepted On</th>
                <th style={{ padding: "0.5rem", border: "1px solid var(--border)" }}>Contact</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((row) => {
                const tenant = row.tenant || {};
                const property = row.property || {};
                const fullName = [tenant.firstName, tenant.lastName].filter(Boolean).join(" ")
                  || tenant.name
                  || tenant.email
                  || "Unknown tenant";
                const acceptedAt = row.acceptedAt || row.updatedAt;

                return (
                  <tr key={row._id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.5rem" }}>{fullName}</td>
                    <td style={{ padding: "0.5rem" }}>{property.title || "Deleted property"}</td>
                    <td style={{ padding: "0.5rem" }}>
                      {acceptedAt
                        ? new Date(acceptedAt).toLocaleDateString("en-NG", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      {tenant.email ? (
                        <a href={`mailto:${tenant.email}`}>{tenant.email}</a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
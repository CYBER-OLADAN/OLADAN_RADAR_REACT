import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

export default function VerifyEmail() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = useSearchParams();
    const tokenFromUrl = params.get("token");
    if (!tokenFromUrl) {
      setError("Missing or invalid verification token");
      setLoading(false);
    } else {
      setToken(tokenFromUrl);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    apiFetch(`/api/v1/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Email verified") {
          setSuccess("Email verified");
        } else {
          setError(data.message || "Verification failed");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Verification failed");
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: "2rem auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Verify Email</h2>
        {loading && <p style={{ textAlign: "center" }}>Verifying...</p>}
        {success && <p style={{ color: "#059669", textAlign: "center" }}>{success}</p>}
        {error && <p style={{ color: "#dc2626", textAlign: "center" }}>{error}</p>}
        {!loading && !success && !error && (
          <p style={{ textAlign: "center" }}>Missing or invalid verification token</p>
        )}
        <p className="mt-2 text-center text-sm">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
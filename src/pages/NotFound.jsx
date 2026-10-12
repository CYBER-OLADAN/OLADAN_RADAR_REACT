import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="container">
      <div className="card text-center" style={{ maxWidth: 500, margin: "3rem auto" }}>
        <h1>404 — Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary mt-4">Go Home</Link>
      </div>
    </div>
  );
}
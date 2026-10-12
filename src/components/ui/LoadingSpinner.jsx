import React from "react";

export function LoadingSpinner({
  label = "Loading...",
  className,
}) {
  return (
    <div className={`loading-spinner ${className || ""}`} style={{ textAlign: "center" }}>
      <div>
        <svg
          width="40"
          height="40"
          viewBox="0 0 50 50"
          className="spinner-svg"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            strokeWidth="5"
            stroke="currentColor"
            fill="none"
          />
        </svg>
      </div>
      {label && <span>{label}</span>}
    </div>
  );
}

export default LoadingSpinner;

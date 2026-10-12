import React from "react";

const StatCard = ({
  label,
  value,
  icon,
  trend,
  className,
  ...props
}) => {
  const trendStyles = {
    up: { color: "#22c55e", icon: "trending-up" },
    down: { color: "#ef4444", icon: "trending-down" },
    neutral: { color: "#64748b" },
  }[trend] || styles.neutral;

  return (
    <div className={`stat-card ${className || ""}`}>
      <div className="stat-icon">{icon || "📊"}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {trend && (
        <span className="stat-trend">
          {trendStyles.icon ? (
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={trendStyles.color}
                aria-hidden="true"
              >
                <path d="M12 19c-5 1-5-3-7-3s-2-4 0-5c5-3 7-3 7-3s2 4 0 5z" />
              </svg>
            </span>
          ) : null}
          {trend}
        </span>
      )}
    </div>
  );
};

StatCard.defaultProps = {
  trend: "neutral",
};

export default StatCard;
export function StatCard({ label, value, icon, trend, className, ...props }) {
  const trendStyles = {
    up: { color: "#22c55e", icon: "trending-up" },
    down: { color: "#ef4444", icon: "trending-down" },
    neutral: { color: "#64748b" },
  }[trend] || styles.neutral;

  return (
    <div className={`stat-card ${className || ""}`}>
      <div className="stat-icon">{icon || "📊"}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {trend && (
        <span className="stat-trend">
          {trendStyles.icon ? (
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={trendStyles.color}
                aria-hidden="true"
              >
                <path d="M12 19c-5 1-5-3-7-3s-2-4 0-5c5-3 7-3 7-3s2 4 0 5z" />
              </svg>
            </span>
          ) : null}
          {trend}
        </span>
      )}
    </div>
  );
}
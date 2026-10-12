import React from "react";

export default EmptyState;
export function EmptyState({ icon, title, description, actionText, onAction, className }) {
  return (
    <div className={`empty-state ${className || ""}`}>
      <div className="empty-state-icon">{icon || "📁"}</div>
      <h3>{title}</h3>
      <p>{description}</p>

      {actionText && onAction && (
        <button className="btn btn-secondary">{actionText}</button>
      )}
    </div>
  );
}
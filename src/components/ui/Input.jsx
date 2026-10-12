import React from "react";

export default Input;
export function Input({ label, type = "text", error, helpText, className, ...props }) {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">{label}</label>
      )}

      <input
        type={type}
        className={`input-field ${error && "input-error"}`}
        {...props}
      />

      {error && <span className="input-error-text">{error}</span>}

      {helpText && (
        <span className="input-help-text">{helpText}</span>
      )}
    </div>
  );
}
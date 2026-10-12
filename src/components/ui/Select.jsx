import React from "react";

export function Select({ label, options = [], error, className, ...props }) {
  const optionElements = (options || []).map((option, index) => (
    <option key={index} value={option.value}>
      {option.label}
    </option>
  ));

  return (
    <div className={`input-group ${className || ""}`}>
      {label && (
        <label className="input-label">{label}</label>
      )}

      <select className={`select-field ${error ? "select-error" : ""}`} {...props}>
        <option value="" disabled>
          Select an option
        </option>
        {optionElements}
      </select>

      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}

export default Select;

import React from "react";

const sizes = {
  sm: { padding: "6px 12px", fontSize: "12px" },
  md: { padding: "8px 16px", fontSize: "14px" },
  lg: { padding: "12px 20px", fontSize: "16px" },
};

const variants = {
  primary: {
    backgroundColor: "#6366f1",
    color: "white",
    "&:hover": { backgroundColor: "#4f46e5" },
  },
  secondary: {
    backgroundColor: "transparent",
    color: "#6366f1",
    border: "2px solid #6366f1",
    "&:hover": { backgroundColor: "rgba(99, 102, 241, 0.1)" },
  },
  danger: {
    backgroundColor: "#ef4444",
    color: "white",
    "&:hover": { backgroundColor: "#f87171" },
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#6b7280",
    "&:hover": { color: "#1e293b" },
  },
};

export default Button;
export function Button({ children, variant = "primary", size = "md", className, onClick, ...props }) {
  const sizeStyles = sizes[size] || sizes.md;
  const variantStyles = variants[variant] || variants.primary;

  return (
    <button
      className={`btn ${variant} ${size} ${className || ""}`}
      style={{ ...sizeStyles, ...variantStyles }}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  variant: "primary",
  size: "md",
};
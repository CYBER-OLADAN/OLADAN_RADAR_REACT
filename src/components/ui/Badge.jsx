import React from "react";

const sizes = {
  sm: { fontSize: "12px", padding: "4px 8px" },
  md: { fontSize: "14px", padding: "6px 12px" },
};

const variants = {
  success: { backgroundColor: "#22c55e", color: "white" },
  warning: { backgroundColor: "#f59e0b", color: "white" },
  danger: { backgroundColor: "#ef4444", color: "white" },
  info: { backgroundColor: "#3b82f6", color: "white" },
};

const Badge = ({
  variant = "info",
  size = "md",
  className,
  children,
  ...props
}) => {
  const sizeStyles = sizes[size] || sizes.md;
  const variantStyles = variants[variant] || variants.info;

  return (
    <span
      className={`badge ${variant} ${size} ${className || ""}`}
      style={{ ...sizeStyles, ...variantStyles }}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.defaultProps = {
  variant: "info",
  size: "md",
};

export default Badge;
export function Badge({ variant = "info", size = "md", className, children, ...props }) {
  const sizes = {
    sm: { fontSize: "12px", padding: "4px 8px" },
    md: { fontSize: "14px", padding: "6px 12px" },
  };
  const sizeStyles = sizes[size] || sizes.md;

  const variants = {
    success: { backgroundColor: "#22c55e", color: "white" },
    warning: { backgroundColor: "#f59e0b", color: "white" },
    danger: { backgroundColor: "#ef4444", color: "white" },
    info: { backgroundColor: "#3b82f5", color: "white" },
  };
  const variantStyles = variants[variant] || variants.info;

  return (
    <span
      className={`badge ${variant} ${size} ${className || ""}`}
      style={{ ...sizeStyles, ...variantStyles }}
      {...props}
    >
      {children}
    </span>
  );
}
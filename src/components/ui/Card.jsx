import React from "react";

export default Card;
export function Card({ className, header, footer, children, ...props }) {
  return (
    <div className={`card ${className || ""}`} {...props}>
      {header && <div className="card-header">{header}</div>}

      <div className="card-body">{children}</div>

      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

Card.defaultProps = {
  header: null,
  footer: null,
};
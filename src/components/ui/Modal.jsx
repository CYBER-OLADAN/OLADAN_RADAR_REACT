import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = ({
  show,
  onHide,
  children,
  showCloseButton = true,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onHide();
      }
    };

    const handleBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        onHide();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.addEventListener("click", handleBackdropClick);
    document.body.appendChild(backdrop);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
      setIsMounted(false);
    };
  }, [onHide]);

  if (!show || !isMounted) {
    return null;
  }

  return createPortal(
    <div className="modal-overlay" onClick={onHide}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {showCloseButton && (
          <button
            className="modal-close-button"
            aria-label="Close modal"
            onClick={onHide}
          >
            ×
          </button>
        )
        <span>{children}</span>
      </div>
    </div>,
    document.body
  );
};

Modal.defaultProps = {
  show: false,
  onHide: () => {},
  showCloseButton: true,
};

export default Modal;
export function Modal({ show, onHide, children, showCloseButton = true }) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onHide();
      }
    };

    const handleBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        onHide();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.addEventListener("click", handleBackdropClick);
    document.body.appendChild(backdrop);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
      setIsMounted(false);
    };
  }, [onHide]);

  if (!show || !isMounted) {
    return null;
  }

  return React.createPortal(
    <div className="modal-overlay" onClick={onHide}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {showCloseButton && (
          <button
            className="modal-close-button"
            aria-label="Close modal"
            onClick={onHide}
          >
            ×
          </button>
        )}
        <span>{children}</span>
      </div>
    </div>,
    document.body
  );
}
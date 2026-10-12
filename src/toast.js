import React, { useState, useEffect } from "react";

const toastContainer = document.createElement("div");
toastContainer.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

document.body.appendChild(toastContainer);

const toastTimeouts = new Map();

const toast = (message, { variant = "success", duration = 4000 } = {}) => {
  const id = `toast-${Date.now()}-${Math.random()}`;
  const types = {
    success: { background: "#10b981", color: "white" },
    error: { background: "#ef4444", color: "white" },
    info: { background: "#3b82f6", color: "white" },
  };
  const style = types[variant] || types.info;

  const toastEl = document.createElement("div");
  toastEl.style.cssText = `
    background: ${style.background};
    color: ${style.color};
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 250px;
    animation: slideIn 0.3s ease-out;
  `;
  toastEl.textContent = message;
  toastContainer.appendChild(toastEl);

  // Auto-remove
  clearTimeout(toastTimeouts.get(id));
  const timeout = setTimeout(() => {
    toastEl.style.animation = "slideOut 0.3s ease-in";
    setTimeout(() => toastEl.remove(), 300);
    toastTimeouts.delete(id);
  }, duration);
  toastTimeouts.set(id, timeout);

  return id;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default toast;
export { scrollToTop };

// Add keyframe styles
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);
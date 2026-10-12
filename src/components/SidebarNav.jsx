import React from "react";
import { useLocation } from "react-router-dom";

const SidebarNav = ({ items, activeClassName = "active" }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="sidebar-nav">
      {items.map((item) => (
        <div
          key={item.path}
          className={`sidebar-item ${pathname === item.path ? activeClassName : ""}`}
        >
          <a href={item.path} onClick={(e) => e.preventDefault()}>
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.label}</span>
          </a>
        </div>
      ))}
    </nav>
  );
};

SidebarNav.defaultProps = {
  items: [],
};

export default SidebarNav;
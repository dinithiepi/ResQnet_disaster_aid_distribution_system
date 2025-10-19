import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles.css";

export default function Header() {
  const location = useLocation();

  // ✅ Define all pages
  const allLinks = [
    { to: "/", label: "Home" },
    { to: "/inventory", label: "Inventory" },
    { to: "/donate", label: "Donate" },
    { to: "/map", label: "Map" },
    { to: "/about", label: "About" },
  ];

  // ✅ Hide the link for the current page
  const visibleLinks = allLinks.filter((link) => link.to !== location.pathname);

  return (
    <header className="top-bar">
      <div className="brand">ResQNet</div>
      <nav className="top-nav" aria-label="Main navigation">
        {visibleLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

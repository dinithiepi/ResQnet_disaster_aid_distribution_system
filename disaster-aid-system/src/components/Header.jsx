import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles.css";

export default function Header() {
  const location = useLocation();

  return (
    <header className="top-bar">
      <div className="brand">ResQNet</div>
      <nav className="top-nav" aria-label="Main navigation">
        <Link
          to="/"
          className={location.pathname === "/" ? "active home-link" : "home-link"}
        >
          Home
        </Link>

        <Link
          to="/inventory"
          className={location.pathname === "/inventory" ? "active" : ""}
        >
          Inventory
        </Link>

        <Link
          to="/map"
          className={location.pathname === "/map" ? "active" : ""}
        >
          Map
        </Link>

        <Link
          to="/donate"
          className={location.pathname === "/donate" ? "active donate-link" : ""}
        >
          Donate
        </Link>
      </nav>
    </header>
  );
}

import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "./navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect scroll to add shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="logo">Cleaner</div>

        {/* Hamburger Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><a href="/" onClick={closeMenu}>History</a></li>
          <li><a href="/" onClick={closeMenu}>Cookies</a></li>
          <li><a href="/" onClick={closeMenu}>Cache</a></li>
        </ul>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme") || "light";
    const dark = savedTheme === "dark";
    setIsDark(dark);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">Major Project</div>
        <div className="nav-links-wrapper">
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            <li>
              <Link href="/" className={pathname === "/" ? "active" : ""} onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={pathname === "/about" ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                About the Project
              </Link>
            </li>
            <li>
              <Link href="/team" className={pathname === "/team" ? "active" : ""} onClick={() => setMenuOpen(false)}>
                Team Members
              </Link>
            </li>
          </ul>
          <div className="nav-actions">
            <button
              className="theme-toggle"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              type="button"
            >
              <span className="theme-toggle-slider" />
            </button>
            <button
              className={`hamburger ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

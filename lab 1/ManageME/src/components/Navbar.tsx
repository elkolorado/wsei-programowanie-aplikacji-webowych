import React from "react";
import UserProfileIsland from "./UserProfileIsland";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  {
    href: "https://github.com/elkolorado/wsei-programowanie-aplikacji-webowych",
    label: "Github",
  },
];

const Navbar: React.FC = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container">
      <a className="navbar-brand" href="/">ManageME</a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {links.map((link) => (
            <li className="nav-item" key={link.href}>
              <a className="nav-link" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
          <li className="nav-item">
            <ThemeToggle />
          </li>
        </ul>
        <span className="navbar-text ms-3">
          <UserProfileIsland />
        </span>
      </div>
    </div>
  </nav>
);

export default Navbar;

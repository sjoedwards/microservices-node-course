import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li className="nav-item" key={href}>
          <Link href={href}>
            <a href={href} className="nav-link">
              {label}
            </a>
          </Link>
        </li>
      );
    });
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a href="/" className="navbar-brand">
          GitTix
        </a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

Header.propTypes = {
  currentUser: PropTypes.object,
};

export default Header;

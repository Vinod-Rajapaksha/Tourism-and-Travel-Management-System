import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import "./TouristPortalLayout.css";

const TouristPortalLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  return (
    <div
      className="tourist-portal-wrapper d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#0f172a", color: "#f8fafc" }}
    >
      {/* Navbar identical to Public Landing Page */}
      <nav
        className={`navbar navbar-expand-lg fixed-top transition-all py-3 ${
          scrolled ? "shadow-lg py-2" : "bg-transparent"
        }`}
        style={{
          background: scrolled ? "rgba(15, 23, 42, 0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255, 255, 255, 0.15)"
            : "none",
          zIndex: 1030,
        }}
      >
        <div className="container d-flex align-items-center justify-content-between">
          {/* Brand Logo & Name */}
          <Link
            to="/dashboard"
            className="navbar-brand d-flex align-items-center gap-2 gap-md-3 text-white text-decoration-none text-nowrap"
          >
            <div
              className="position-relative d-flex align-items-center justify-content-center bg-white rounded-circle p-1 shadow-sm flex-shrink-0"
              style={{ width: "46px", height: "46px" }}
            >
              <img
                src="/logo512 v2.png"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/logo512.png";
                }}
                alt="Ceylona Travels Logo"
                style={{ width: "50px", height: "50px", objectFit: "contain" }}
              />
            </div>
            <div>
              <span
                className="fw-bold fs-4 tracking-tight d-block lh-1 text-white"
                style={{ letterSpacing: "-0.5px" }}
              >
                CEYLONA TRAVELS
              </span>
              <span
                className="text-warning small text-uppercase tracking-wider fw-semibold"
                style={{ fontSize: "10px", letterSpacing: "1.5px" }}
              >
                Wonder of Ceylon & Beyond
              </span>
            </div>
          </Link>

          {/* Interactive Mobile Toggler */}
          <button
            className="navbar-toggler border-0 text-white p-2 d-lg-none"
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation"
          >
            <i
              className={`bi ${mobileNavOpen ? "bi-x-lg" : "bi-list"} fs-2`}
            ></i>
          </button>

          {/* Nav Items */}
          <div
            className={`collapse navbar-collapse ${mobileNavOpen ? "show mt-3 p-3 rounded-4 shadow" : ""}`}
            style={
              mobileNavOpen
                ? {
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }
                : {}
            }
          >
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 gap-xl-3 fw-semibold small tracking-wider align-items-lg-center">
              <li className="nav-item">
                <NavLink
                  to="/dashboard"
                  className="nav-link text-white hover-text-warning transition-all py-2 d-flex align-items-center gap-1"
                >
                  <i className="bi bi-grid me-1 text-warning"></i> Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/packages"
                  className="nav-link text-white hover-text-warning transition-all py-2 d-flex align-items-center gap-1"
                >
                  <i className="bi bi-compass me-1 text-primary"></i> Tour
                  Catalog
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/tourist/bookings"
                  className="nav-link text-white hover-text-warning transition-all py-2 d-flex align-items-center gap-1"
                >
                  <i className="bi bi-calendar-check me-1 text-success"></i> My
                  Bookings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/tourist/wishlist"
                  className="nav-link text-white hover-text-warning transition-all py-2 d-flex align-items-center gap-1"
                >
                  <i className="bi bi-heart me-1 text-danger"></i> Wishlist
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/tourist/profile"
                  className="nav-link text-white hover-text-warning transition-all py-2 d-flex align-items-center gap-1"
                >
                  <i className="bi bi-person me-1 text-info"></i> Profile
                </NavLink>
              </li>
            </ul>

            {/* Auth Actions */}
            <div className="d-flex align-items-center gap-3 pt-3 pt-lg-0 border-top border-secondary border-opacity-25 border-lg-0">
              <div className="text-end d-none d-xl-block text-nowrap">
                <small
                  className="text-white-50 d-block lh-1"
                  style={{ fontSize: "11px" }}
                >
                  Logged in as
                </small>
                <span className="text-white fw-bold small">
                  {user?.email || user?.firstName || "Traveler"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "38px", height: "38px" }}
                title="Sign Out"
              >
                <i className="bi bi-box-arrow-right fs-6"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area where portal pages render */}
      <main className="flex-grow-1" style={{ paddingTop: "100px" }}>
        <Outlet />
      </main>

      {/* Footer identical to Public Landing Page */}
      <footer
        className="text-white pt-5 pb-4 border-top border-secondary border-opacity-25 mt-auto"
        style={{ backgroundColor: "#0f172a" }}
      >
        <div className="container pt-3">
          <div className="row g-4 justify-content-between mb-5">
            <div className="col-12 col-lg-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="bg-white rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "40px", height: "40px" }}
                >
                  <img
                    src="/logo512 v2.png"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/logo512.png";
                    }}
                    alt="Ceylona Travels Logo"
                    style={{
                      width: "46px",
                      height: "46px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <span className="fw-bold fs-4 tracking-tight text-white">
                  CEYLONA TRAVELS
                </span>
              </div>
              <p className="text-white-50 small pe-lg-4 mb-4">
                Sri Lanka's premier luxury tourism and travel management system,
                delivering extraordinary travel adventures with unmatched
                hospitality and safety.
              </p>
              <div className="d-flex gap-3">
                <a
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  className="btn btn-outline-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  className="btn btn-outline-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                >
                  <i className="bi bi-instagram"></i>
                </a>
                <a
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  className="btn btn-outline-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                >
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a
                  href="#social"
                  onClick={(e) => e.preventDefault()}
                  className="btn btn-outline-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                >
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>

            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3">
                Quick Links
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li>
                  <Link
                    to="/packages"
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-chevron-right small text-warning"></i>{" "}
                    Tour Catalog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tourist/bookings"
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-chevron-right small text-warning"></i>{" "}
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tourist/wishlist"
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-chevron-right small text-warning"></i>{" "}
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tourist/profile"
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-chevron-right small text-warning"></i>{" "}
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3">
                Portals
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li>
                  <Link
                    to="/guide/login"
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-person-badge text-success"></i> Guide
                    Portal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/staff/login"
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-shield-lock text-info"></i> Staff Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-white-50 text-decoration-none hover-text-white transition-all d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-person-plus text-primary"></i> Register
                    Tourist
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3">
                Newsletter
              </h6>
              <p className="text-white-50 small mb-3">
                Subscribe for exclusive Sri Lanka travel guides and seasonal
                promotions.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  Swal.fire(
                    "Subscribed!",
                    "Thank you for subscribing to Ceylona Travels newsletter.",
                    "success",
                  );
                }}
              >
                <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border border-secondary border-opacity-50">
                  <input
                    type="email"
                    className="form-control border-0 text-white ps-4 fs-6"
                    style={{ backgroundColor: "#1e293b" }}
                    placeholder="Your email address..."
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary px-4 border-0 fw-bold transition-all hover-scale"
                  >
                    <i className="bi bi-send-fill"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="border-top border-secondary border-opacity-25 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-white-50 small">
            <div>
              © {new Date().getFullYear()} Ceylona Travels. All rights reserved.
            </div>
            <div className="d-flex gap-4">
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  Swal.fire(
                    "Privacy Policy",
                    "We respect your data privacy and adhere to international tourism data security standards.",
                    "info",
                  );
                }}
                className="text-white-50 text-decoration-none hover-text-white transition-all"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  Swal.fire(
                    "Terms of Service",
                    "Standard booking terms and refund policies apply for all Ceylona tour packages.",
                    "info",
                  );
                }}
                className="text-white-50 text-decoration-none hover-text-white transition-all"
              >
                Terms of Service
              </a>
              <a
                href="#support"
                onClick={(e) => {
                  e.preventDefault();
                  Swal.fire(
                    "24/7 Support",
                    "Contact our Customer Service desk at support@ceylonatravels.com or call +94 11 234 5678.",
                    "info",
                  );
                }}
                className="text-white-50 text-decoration-none hover-text-white transition-all"
              >
                Support Desk
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TouristPortalLayout;

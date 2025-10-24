import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../assets/main.css";
import profileSvg from "../assets/img/undraw_profile.svg";

const Topbar = ({
  userName,
  onToggleSidebar,
  onLogout,
  rightItems,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [profile, setProfile] = useState(null);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      const target = e.target;
      if (btnRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Fetch profile data once
  useEffect(() => {
    const token = localStorage.getItem("token");
    const API_BASE = "http://localhost:8080";

    if (!token || !API_BASE) return;

    axios
      .get(`${API_BASE}/api/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error("Error fetching profile", err);
        Swal.fire("Error", "Couldn't load your profile.", "error");
      });
  }, []);

  const displayName = profile?.fname || userName  ;

  return (
    <nav
      className="navbar navbar-expand navbar-light bg-white topbar shadow-sm px-3"
      role="navigation"
      aria-label="Top bar"
    >
      {/* Sidebar Toggle Button */}
      <button
        id="sidebarToggleTop"
        type="button"
        className="Tbtn btn-link rounded-circle me-2"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <i className="fa fa-bars" aria-hidden="true" />
      </button>

      <div className="flex-grow-1" />

      <ul className="navbar-nav ms-auto align-items-center">
        {rightItems && <li className="nav-item me-2">{rightItems}</li>}

        <div className="topbar-divider d-none d-sm-block" aria-hidden="true" />

        {/* Dropdown */}
        <li className="nav-item dropdown no-arrow position-relative">
          <button
            ref={btnRef}
            type="button"
            className="nav-link dropdown-toggle btn-link text-decoration-none d-flex align-items-center"
            onClick={toggle}
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls="topbar-user-menu"
          >
            <span className="me-2 d-none d-lg-inline text-dark small" style={{ fontWeight: '500' }}>
              {displayName}
            </span>
            <img
              className="img-profile rounded-circle"
              src={profileSvg}
              alt={`${displayName} profile`}
              width={32}
              height={32}
            />
          </button>

          <div
            ref={menuRef}
            id="topbar-user-menu"
            className={
              "dropdown-menu dropdown-menu-right shadow animated--grow-in " +
              (open ? "show" : "")
            }
            style={{ position: "absolute" }}
            role="menu"
          >
            <button
              type="button"
              className="dropdown-item"
              onClick={() => {
                close();
                navigate("/profile");
              }}
              role="menuitem"
            >
              <i className="fas fa-user fa-sm fa-fw me-2 text-dark" />
              Profile
            </button>

            <div className="dropdown-divider" />

            <button
              type="button"
              className="dropdown-item text-danger"
              onClick={() => {
                close();
                if (typeof onLogout === "function") onLogout();
                else navigate("/logout");
              }}
              role="menuitem"
            >
              <i className="fas fa-sign-out-alt fa-sm fa-fw me-2 text-dark" />
              Logout
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Topbar;

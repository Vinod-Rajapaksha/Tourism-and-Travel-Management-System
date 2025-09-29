import React from "react";
import { NavLink } from "react-router-dom";
import "../assets/admin.css";
import { useLoader } from "../context/LoaderContext"; 

export default function SideNav({ currentRole, toggled = false, onItemClick }) {
  const { setLoading } = useLoader(); 

  const items = [
    { header: "Interface" },
    { to: "/dashboard", icon: "fas fa-fw fa-tachometer-alt", label: "Dashboard", end: true },
    { divider: true },
    { header: "Management" },
    { to: "/admins", icon: "fas fa-fw fa-user-shield", label: "Admin Management", roles: ["GENERAL_MANAGER"] },
    { to: "/users", icon: "fas fa-fw fa-users", label: "User Management", roles: ["GENERAL_MANAGER","SENIOR_TRAVEL_CONSULTANT","CUSTOMER_SERVICE_EXECUTIVE"] },
    { to: "/guides", icon: "fas fa-fw fa-person-hiking", label: "Your Guide Management", roles: ["GENERAL_MANAGER","SENIOR_TRAVEL_CONSULTANT"] },
    { to: "/packages", icon: "fas fa-fw fa-box-open", label: "Tour Package Management", roles: ["GENERAL_MANAGER","MARKETING_MANAGER","SENIOR_TRAVEL_CONSULTANT"] },
    { to: "/reservation", icon: "fas fa-fw fa-calendar", label: "Reservation Management", roles: ["GENERAL_MANAGER","CUSTOMER_SERVICE_EXECUTIVE","SENIOR_TRAVEL_CONSULTANT"] },
    { to: "/payments", icon: "fas fa-fw fa-credit-card", label: "Payment Management", roles: ["GENERAL_MANAGER","CUSTOMER_SERVICE_EXECUTIVE"] },
    { divider: true },
    { header: "Analytics" },
    { to: "/analytics", icon: "fas fa-fw fa-chart-line", label: "Analytics / Reports", roles: ["GENERAL_MANAGER","MARKETING_MANAGER"] },
    { divider: true, dmdblock: true },
  ];

  const visible = (it) => !it.roles || !currentRole || it.roles.includes(currentRole);

  const handleNavClick = (onItemClick) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 800);

    if (onItemClick) onItemClick();
  };

  return (
    <ul
      id="accordionSidebar"
      className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${toggled ? "toggled" : ""}`}
    >
      {/* Brand */}
      <div className="sidebar-brand d-flex align-items-center justify-content-center">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fa-solid fa-person-hiking"></i>
        </div>
      </div>

      <hr className="sidebar-divider my-0" />

      {/* Menu */}
      {items.map((it, i) => {
        if (it.divider) {
          return (
            <hr
              key={`div-${i}`}
              className={`sidebar-divider ${it.dmdblock ? "d-none d-md-block" : ""}`}
            />
          );
        }
        if (it.header) {
          return (
            <div key={`hd-${i}`} className="sidebar-heading">
              {it.header}
            </div>
          );
        }
        if (!visible(it)) return null;

        return (
          <li key={it.to} className="nav-item">
            <NavLink
              to={it.to}
              end={it.end}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={() => handleNavClick(onItemClick)}
            >
              <i className={it.icon}></i>
              <span className="ms-1">{it.label}</span>
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

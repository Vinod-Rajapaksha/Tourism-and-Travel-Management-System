import { NavLink } from "react-router-dom";
import "../assets/admin.css";
import { useLoader } from "../context/LoaderContext";
import { useAuth } from "../hooks/useAuth";

export default function SideNav({ currentRole, toggled = false, onItemClick }) {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const effectiveRole = currentRole || user?.roles?.[0];

  const items = [
    { header: "Interface" },
    {
      to: "/staff/dashboard",
      icon: "fas fa-fw fa-tachometer-alt",
      label: "Staff Dashboard",
      end: false,
      roles: [
        "GENERAL_MANAGER",
        "ADMIN",
        "SENIOR_TRAVEL_CONSULTANT",
        "CUSTOMER_SERVICE_EXECUTIVE",
        "MARKETING_MANAGER",
      ],
    },
    {
      to: "/dashboard",
      icon: "fas fa-fw fa-tachometer-alt",
      label: "My Dashboard",
      end: true,
      roles: ["TOURIST"],
    },
    {
      to: "/guide/dashboard",
      icon: "fas fa-fw fa-tachometer-alt",
      label: "Guide Dashboard",
      end: true,
      roles: ["GUIDE"],
    },
    { divider: true },
    {
      header: "Management",
      roles: [
        "GENERAL_MANAGER",
        "ADMIN",
        "SENIOR_TRAVEL_CONSULTANT",
        "CUSTOMER_SERVICE_EXECUTIVE",
        "MARKETING_MANAGER",
      ],
    },
    {
      to: "/staff/admins",
      icon: "fas fa-fw fa-user-shield",
      label: "Admin Management",
      roles: ["GENERAL_MANAGER", "ADMIN"],
    },
    {
      to: "/staff/users",
      icon: "fas fa-fw fa-users",
      label: "User Management",
      roles: [
        "GENERAL_MANAGER",
        "ADMIN",
        "SENIOR_TRAVEL_CONSULTANT",
        "CUSTOMER_SERVICE_EXECUTIVE",
      ],
    },
    {
      to: "/staff/guides",
      icon: "fas fa-fw fa-person-hiking",
      label: "Guide Management",
      roles: ["GENERAL_MANAGER", "ADMIN", "SENIOR_TRAVEL_CONSULTANT"],
    },
    {
      to: "/staff/tourpackages",
      icon: "fas fa-fw fa-box-open",
      label: "Tour Package Management",
      roles: [
        "GENERAL_MANAGER",
        "ADMIN",
        "MARKETING_MANAGER",
        "SENIOR_TRAVEL_CONSULTANT",
      ],
    },
    {
      to: "/staff/availability",
      icon: "fas fa-fw fa-calendar-check",
      label: "Tour Package Availability",
      roles: [
        "GENERAL_MANAGER",
        "ADMIN",
        "MARKETING_MANAGER",
        "SENIOR_TRAVEL_CONSULTANT",
      ],
    },
    {
      to: "/staff/calendar",
      icon: "fas fa-fw fa-calendar-alt",
      label: "Promotions Calendar",
      roles: ["GENERAL_MANAGER", "ADMIN", "MARKETING_MANAGER"],
    },
    { divider: true, dmdblock: true },
  ];

  const visible = (it) =>
    !it.roles || !effectiveRole || it.roles.includes(effectiveRole);

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
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
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

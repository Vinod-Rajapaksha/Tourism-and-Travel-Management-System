import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import "../assets/main.css";

export default function BaseLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth < 768;
  });

  const location = useLocation();

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setSidebarMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarMobileOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSidebarMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!isNarrow) {
      setSidebarMobileOpen(false);
      setSidebarCollapsed(true);
    } else {
      setSidebarMobileOpen(false);
    }
  }, [isNarrow]);

  const toggleSidebar = useCallback(() => {
    if (isNarrow) setSidebarMobileOpen((s) => !s);
    else setSidebarCollapsed((c) => !c);
  }, [isNarrow]);

  const userName = localStorage.getItem("userName") || "Admin";

  return (
    <div className="app-wrapper d-flex">
      {/* Desktop sidebar */}
      <nav
        className="d-none d-md-block"
        role="navigation"
        aria-label="Primary"
        aria-expanded={!sidebarCollapsed}
      >
        <SideNav
          toggled={sidebarCollapsed}
          onItemClick={null}
        />
      </nav>

      {/* Mobile sidebar */}
      <div className="d-md-none" role="navigation" aria-label="Primary">
        <div
          className={`mobile-overlay ${sidebarMobileOpen ? "show" : ""}`}
          onClick={() => setSidebarMobileOpen(false)}
          aria-hidden={!sidebarMobileOpen}
        />
        <div
          className={`mobile-sidebar ${sidebarMobileOpen ? "show" : ""}`}
          id="mobileSidebar"
          aria-hidden={!sidebarMobileOpen}
        >
          <SideNav
            toggled={false}
            onItemClick={() => setSidebarMobileOpen(false)}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="app-content flex-grow-1 d-flex flex-column">
        <TopNav
          userName={userName}
          onToggleSidebar={toggleSidebar}
          onLogout={() => window.location.assign("/logout")}
        />
        <main className="p-3 flex-grow-1 scrollable">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

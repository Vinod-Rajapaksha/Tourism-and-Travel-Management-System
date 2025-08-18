import TopNav from "../components/TopNav";
import SideNav from "../components/SideNav";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <SideNav />
      <div className="flex-grow-1">
        <TopNav />
        <main className="container-fluid p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
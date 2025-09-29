import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";

import TravelLoader from "./components/Loading";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import GeneralManagerDashboard from "./pages/dashboard/GeneralManagerDashboard";
import SeniorTravelConsultantDashboard from "./pages/dashboard/SeniorTravelConsultantDashboard";
import CustomerServiceExecutiveDashboard from "./pages/dashboard/CustomerServiceExecutiveDashboard";
import MarketingManagerDashboard from "./pages/dashboard/MarketingManagerDashboard";

import UserManagement from "./pages/usermanagement/UserManagement";
import AdminManagement from "./pages/adminmanagement/AdminManagement";

import AdminProfile from "./pages/adminprofile/AdminProfile";
import EditProfile from "./pages/adminprofile/EditProfile";

import BaseLayout from "./layouts/BaseLayout";
import RoleBasedDashboardRedirect from "./components/RoleBasedDashboardRedirect";

import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <TravelLoader />;
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route index element={<Navigate to="/login" replace />} />

      {/* Public pages: login/logout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Route>

      {/* Protected pages: wrapped with ProtectedRoute + BaseLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <BaseLayout />
          </ProtectedRoute>
        }
      >
        {/* Dynamic redirect based on role */}
        <Route path="dashboard" element={<RoleBasedDashboardRedirect />} />

        {/* Role-based dashboards */}
        <Route
          path="dashboard/general-manager"
          element={
            <RoleRoute roles={["GENERAL_MANAGER"]}>
              <GeneralManagerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="dashboard/senior-travel-consultant"
          element={
            <RoleRoute roles={["SENIOR_TRAVEL_CONSULTANT"]}>
              <SeniorTravelConsultantDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="dashboard/customer-service-executive"
          element={
            <RoleRoute roles={["CUSTOMER_SERVICE_EXECUTIVE"]}>
              <CustomerServiceExecutiveDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="dashboard/marketing-manager"
          element={
            <RoleRoute roles={["MARKETING_MANAGER"]}>
              <MarketingManagerDashboard />
            </RoleRoute>
          }
        />
        
        {/* Management */}
        <Route path="/users" element={<UserManagement />} />
        <Route path="/admins" element={<AdminManagement />} />

        {/* Profile */}
        <Route path="profile" element={<AdminProfile />} />
        <Route path="edit-profile" element={<EditProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

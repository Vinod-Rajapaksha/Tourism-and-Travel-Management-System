import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import TouristLogin from "./pages/auth/TouristLogin";
import TouristRegister from "./pages/auth/TouristRegister";
import GuideLogin from "./pages/auth/GuideLogin";
import GuideRegister from "./pages/auth/GuideRegister";
import GuideWaitingApproval from "./pages/auth/GuideWaitingApproval";
import LandingPage from "./pages/public/LandingPage";

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

import Calendar from "./components/MarketingManager/Calendar";
import AdminPanel from "./components/MarketingManager/AdminPanel";
import PackageDetails from "./components/MarketingManager/PackageDetails";
import PaymentGateway from "./components/MarketingManager/PaymentGateway";
import apiService from "./api/Promotion";

import PackagesList from "./pages/client/PackagesList";
import TouristDashboard from "./pages/client/TouristDashboard";
import TouristBookings from "./pages/client/TouristBookings";
import TouristWishlist from "./pages/client/TouristWishlist";
import TouristProfile from "./pages/client/TouristProfile";
import TouristPortalLayout from "./layouts/TouristPortalLayout";
import GuideDashboard from "./pages/guide/GuideDashboard";

import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);

  const [promotions, setPromotions] = useState([]);
  const [calendarSettings, setCalendarSettings] = useState({
    backgroundImage: "",
    backgroundOpacity: 0.3,
    backgroundBlur: 0,
    siteBackgroundImage: "",
    siteBackgroundOpacity: 0.2,
    siteBackgroundBlur: 0,
    theme: "light",
  });

  const [payments] = useState([]);

  const fetchPromotions = async () => {
    try {
      const data = await apiService.getPromotions();
      setPromotions(data);
    } catch (err) {
      console.error("Error fetching promotions:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handlePromotionsChange = (newPromotions) => {
    setPromotions(newPromotions);
  };

  const handleCalendarSettingsChange = (newSettings) => {
    setCalendarSettings(newSettings);
  };

  const activePromotions = promotions.filter((promotion) => promotion.isActive);

  const siteBgStyle = calendarSettings.siteBackgroundImage
    ? {
        backgroundImage: `url(${calendarSettings.siteBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {};

  const siteOverlayStyle = {
    backgroundColor: `rgba(255, 255, 255, ${1 - (calendarSettings.siteBackgroundOpacity ?? 0.2)})`,
    backdropFilter: calendarSettings.siteBackgroundBlur
      ? `blur(${calendarSettings.siteBackgroundBlur}px)`
      : "none",
  };

  if (loading) return <TravelLoader />;
  return (
    <Routes>
      {}
      <Route path="/" element={<LandingPage />} />

      {}
      <Route element={<AuthLayout />}>
        <Route path="/staff/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/staff/logout" element={<Logout />} />
        <Route path="/admin/logout" element={<Logout />} />
        <Route path="/logout" element={<Logout />} />
      </Route>

      {}
      <Route path="/login" element={<TouristLogin />} />
      <Route path="/register" element={<TouristRegister />} />
      <Route path="/tourist/login" element={<Navigate to="/login" replace />} />
      <Route
        path="/tourist/register"
        element={<Navigate to="/register" replace />}
      />

      {}
      <Route path="/guide/login" element={<GuideLogin />} />
      <Route path="/guide/register" element={<GuideRegister />} />
      <Route
        path="/guide/waiting-approval"
        element={<GuideWaitingApproval />}
      />

      {}
      <Route element={<TouristPortalLayout />}>
        <Route path="/packages" element={<PackagesList />} />
        <Route
          path="/package-details/:packageId"
          element={<PackageDetails />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["TOURIST"]}>
                <TouristDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tourist-dashboard"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["TOURIST"]}>
                <PaymentGateway promotions={promotions} />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tourist/bookings"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["TOURIST"]}>
                <TouristBookings />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tourist/wishlist"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["TOURIST"]}>
                <TouristWishlist />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tourist/profile"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["TOURIST"]}>
                <TouristProfile />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      </Route>

      {}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <BaseLayout />
          </ProtectedRoute>
        }
      >
        {}
        <Route
          path="guide/dashboard"
          element={
            <RoleRoute roles={["GUIDE"]}>
              <GuideDashboard />
            </RoleRoute>
          }
        />

        {}
        <Route
          path="staff/dashboard"
          element={<RoleBasedDashboardRedirect />}
        />
        <Route
          path="admin/dashboard"
          element={<RoleBasedDashboardRedirect />}
        />

        {}
        <Route
          path="staff/dashboard/general-manager"
          element={
            <RoleRoute roles={["GENERAL_MANAGER", "ADMIN"]}>
              <GeneralManagerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="admin/dashboard/general-manager"
          element={<Navigate to="/staff/dashboard/general-manager" replace />}
        />
        <Route
          path="dashboard/general-manager"
          element={<Navigate to="/staff/dashboard/general-manager" replace />}
        />

        <Route
          path="staff/dashboard/senior-travel-consultant"
          element={
            <RoleRoute roles={["SENIOR_TRAVEL_CONSULTANT", "ADMIN"]}>
              <SeniorTravelConsultantDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="admin/dashboard/senior-travel-consultant"
          element={
            <Navigate to="/staff/dashboard/senior-travel-consultant" replace />
          }
        />
        <Route
          path="dashboard/senior-travel-consultant"
          element={
            <Navigate to="/staff/dashboard/senior-travel-consultant" replace />
          }
        />

        <Route
          path="staff/dashboard/customer-service-executive"
          element={
            <RoleRoute roles={["CUSTOMER_SERVICE_EXECUTIVE", "ADMIN"]}>
              <CustomerServiceExecutiveDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="admin/dashboard/customer-service-executive"
          element={
            <Navigate
              to="/staff/dashboard/customer-service-executive"
              replace
            />
          }
        />
        <Route
          path="dashboard/customer-service-executive"
          element={
            <Navigate
              to="/staff/dashboard/customer-service-executive"
              replace
            />
          }
        />

        <Route
          path="staff/dashboard/marketing-manager"
          element={
            <RoleRoute roles={["MARKETING_MANAGER", "ADMIN"]}>
              <MarketingManagerDashboard
                promotions={promotions}
                onPromotionsChange={handlePromotionsChange}
                calendarSettings={calendarSettings}
                onCalendarSettingsChange={handleCalendarSettingsChange}
                payments={payments}
                onRefreshPromotions={fetchPromotions}
              />
            </RoleRoute>
          }
        />
        <Route
          path="admin/dashboard/marketing-manager"
          element={<Navigate to="/staff/dashboard/marketing-manager" replace />}
        />
        <Route
          path="dashboard/marketing-manager"
          element={<Navigate to="/staff/dashboard/marketing-manager" replace />}
        />

        {}
        <Route
          path="staff/users"
          element={
            <RoleRoute
              roles={[
                "GENERAL_MANAGER",
                "ADMIN",
                "SENIOR_TRAVEL_CONSULTANT",
                "CUSTOMER_SERVICE_EXECUTIVE",
              ]}
            >
              <UserManagement />
            </RoleRoute>
          }
        />
        <Route
          path="admin/users"
          element={<Navigate to="/staff/users" replace />}
        />
        <Route path="users" element={<Navigate to="/staff/users" replace />} />

        <Route
          path="staff/admins"
          element={
            <RoleRoute roles={["GENERAL_MANAGER", "ADMIN"]}>
              <AdminManagement />
            </RoleRoute>
          }
        />
        <Route
          path="admin/admins"
          element={<Navigate to="/staff/admins" replace />}
        />
        <Route
          path="admins"
          element={<Navigate to="/staff/admins" replace />}
        />

        {}
        <Route
          path="staff/profile"
          element={
            <RoleRoute
              roles={[
                "GENERAL_MANAGER",
                "ADMIN",
                "SENIOR_TRAVEL_CONSULTANT",
                "CUSTOMER_SERVICE_EXECUTIVE",
                "MARKETING_MANAGER",
              ]}
            >
              <AdminProfile />
            </RoleRoute>
          }
        />
        <Route
          path="admin/profile"
          element={<Navigate to="/staff/profile" replace />}
        />
        <Route
          path="profile"
          element={<Navigate to="/staff/profile" replace />}
        />

        <Route
          path="staff/edit-profile"
          element={
            <RoleRoute
              roles={[
                "GENERAL_MANAGER",
                "ADMIN",
                "SENIOR_TRAVEL_CONSULTANT",
                "CUSTOMER_SERVICE_EXECUTIVE",
                "MARKETING_MANAGER",
              ]}
            >
              <EditProfile />
            </RoleRoute>
          }
        />
        <Route
          path="admin/edit-profile"
          element={<Navigate to="/staff/edit-profile" replace />}
        />
        <Route
          path="edit-profile"
          element={<Navigate to="/staff/edit-profile" replace />}
        />

        {}
        <Route
          path="staff/calendar"
          element={
            <RoleRoute
              roles={["GENERAL_MANAGER", "ADMIN", "MARKETING_MANAGER"]}
            >
              <Calendar
                promotions={activePromotions}
                calendarSettings={calendarSettings}
              />
            </RoleRoute>
          }
        />
        <Route
          path="admin/calendar"
          element={<Navigate to="/staff/calendar" replace />}
        />
        <Route
          path="calendar"
          element={<Navigate to="/staff/calendar" replace />}
        />

        <Route
          path="staff/tourpackages"
          element={
            <RoleRoute
              roles={[
                "GENERAL_MANAGER",
                "ADMIN",
                "MARKETING_MANAGER",
                "SENIOR_TRAVEL_CONSULTANT",
              ]}
            >
              <SeniorTravelConsultantDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="admin/tourpackages"
          element={<Navigate to="/staff/tourpackages" replace />}
        />
        <Route
          path="tourpackages"
          element={<Navigate to="/staff/tourpackages" replace />}
        />

        <Route
          path="staff/guides"
          element={
            <RoleRoute
              roles={["GENERAL_MANAGER", "ADMIN", "SENIOR_TRAVEL_CONSULTANT"]}
            >
              <SeniorTravelConsultantDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="admin/guides"
          element={<Navigate to="/staff/guides" replace />}
        />
        <Route
          path="guides"
          element={<Navigate to="/staff/guides" replace />}
        />

        <Route
          path="staff/availability"
          element={
            <RoleRoute
              roles={[
                "GENERAL_MANAGER",
                "ADMIN",
                "MARKETING_MANAGER",
                "SENIOR_TRAVEL_CONSULTANT",
              ]}
            >
              <SeniorTravelConsultantDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="admin/availability"
          element={<Navigate to="/staff/availability" replace />}
        />
        <Route
          path="availability"
          element={<Navigate to="/staff/availability" replace />}
        />
      </Route>

      {}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

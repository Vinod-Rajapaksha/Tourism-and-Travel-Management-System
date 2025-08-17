import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import GeneralManagerDashboard from "./pages/dashboard/GeneralManagerDashboard";
import SeniorTravelConsultantDashboard from "./pages/dashboard/SeniorTravelConsultantDashboard";
import CustomerServiceExecutiveDashboard from "./pages/dashboard/CustomerServiceExecutiveDashboard";
import MarketingManagerDashboard from "./pages/dashboard/MarketingManagerDashboard";
import ReservationList from "./pages/reservation/List";
import ReservationDetails from "./pages/reservation/Details";
import ClientList from "./pages/client/List";
import ClientDetails from "./pages/client/Details";

function App() {
  return (
    <Routes>
      {/* public/auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Route>

      {/* protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* role home redirects */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<GeneralManagerDashboard />} />
        <Route
          path="/dashboard/general-manager"
          element={
            <RoleRoute roles={["GENERAL_MANAGER"]}>
              <GeneralManagerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/dashboard/senior-travel-consultant"
          element={
            <RoleRoute roles={["SENIOR_TRAVEL_CONSULTANT"]}>
              <SeniorTravelConsultantDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/dashboard/customer-service-executive"
          element={
            <RoleRoute roles={["CUSTOMER_SERVICE_EXECUTIVE"]}>
              <CustomerServiceExecutiveDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/dashboard/marketing-manager"
          element={
            <RoleRoute roles={["MARKETING_MANAGER"]}>
              <MarketingManagerDashboard />
            </RoleRoute>
          }
        />

        {/* feature modules */}
        <Route path="/reservation" element={<ReservationList />} />
        <Route path="/reservation/:id" element={<ReservationDetails />} />

        <Route path="/customers" element={<ClientList />} />
        <Route path="/customers/:id" element={<ClientDetails />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

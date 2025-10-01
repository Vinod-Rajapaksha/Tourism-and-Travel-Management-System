import { Routes, Route, Navigate } from "react-router-dom";
import SeniorTravelConsultantDashboard from "./pages/dashboard/SeniorTravelConsultantDashboard";
import PackagesList from "./pages/client/PackagesList";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import RoleBasedDashboardRedirect from "./components/RoleBasedDashboardRedirect";
import RoleRoute from "./routes/RoleRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Customer side */}
      <Route path="/packages" element={<PackagesList />} />
      {/* Public login */}

      <Route path="/login" element={<Login />} />

      {/* protected entry point: auto redirects by role */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedDashboardRedirect />
          </ProtectedRoute>
        }
      />  

      {/* Example: Senior Travel Consultant role only */}
      <Route
        path="/dashboard/senior-travel-consultant"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["SENIOR_TRAVEL_CONSULTANT"]}>
              <SeniorTravelConsultantDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Default: if no route matches, go to customer packages */}
      <Route path="*" element={<Navigate to="/packages" replace />} />
    </Routes>
  );
}

export default App;

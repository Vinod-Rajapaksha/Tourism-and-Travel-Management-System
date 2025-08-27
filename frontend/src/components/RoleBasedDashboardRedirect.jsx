// components/RoleBasedDashboardRedirect.jsx
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function RoleBasedDashboardRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading dashboard...</p>;

  const role = user?.roles?.[0];
  switch (role) {
    case "GENERAL_MANAGER":
      return <Navigate to="/dashboard/general-manager" replace />;
    case "SENIOR_TRAVEL_CONSULTANT":
      return <Navigate to="/dashboard/senior-travel-consultant" replace />;
    case "CUSTOMER_SERVICE_EXECUTIVE":
      return <Navigate to="/dashboard/customer-service-executive" replace />;
    case "MARKETING_MANAGER":
      return <Navigate to="/dashboard/marketing-manager" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

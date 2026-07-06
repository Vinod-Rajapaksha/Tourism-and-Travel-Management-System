import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function RoleBasedDashboardRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading dashboard...</p>;

  const role = user?.roles?.[0];
  switch (role) {
    case "GENERAL_MANAGER":
    case "ADMIN":
      return <Navigate to="/staff/dashboard/general-manager" replace />;
    case "SENIOR_TRAVEL_CONSULTANT":
      return (
        <Navigate to="/staff/dashboard/senior-travel-consultant" replace />
      );
    case "CUSTOMER_SERVICE_EXECUTIVE":
      return (
        <Navigate to="/staff/dashboard/customer-service-executive" replace />
      );
    case "MARKETING_MANAGER":
      return <Navigate to="/staff/dashboard/marketing-manager" replace />;
    case "TOURIST":
      return <Navigate to="/dashboard" replace />;
    case "GUIDE":
      return <Navigate to="/guide/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

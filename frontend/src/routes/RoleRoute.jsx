import { Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";

export default function RoleRoute({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!roles.length) return children;

  const userRoles = user?.roles || [];
  const allowed = roles.some((r) => userRoles.includes(r));
  if (allowed) return children;

  const primaryRole = userRoles[0];
  if (primaryRole === "GENERAL_MANAGER" || primaryRole === "ADMIN")
    return <Navigate to="/staff/dashboard/general-manager" replace />;
  if (primaryRole === "SENIOR_TRAVEL_CONSULTANT")
    return <Navigate to="/staff/dashboard/senior-travel-consultant" replace />;
  if (primaryRole === "CUSTOMER_SERVICE_EXECUTIVE")
    return (
      <Navigate to="/staff/dashboard/customer-service-executive" replace />
    );
  if (primaryRole === "MARKETING_MANAGER")
    return <Navigate to="/staff/dashboard/marketing-manager" replace />;
  if (primaryRole === "GUIDE")
    return <Navigate to="/guide/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

import { Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";

export default function RoleRoute({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!roles.length) return children;

  const userRoles = user?.roles || [];
  const allowed = roles.some((r) => userRoles.includes(r));
  return allowed ? children : <Navigate to="/dashboard" replace />;
}

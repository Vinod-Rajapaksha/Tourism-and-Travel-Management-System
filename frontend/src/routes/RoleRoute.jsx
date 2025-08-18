import { Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import useAuth from "../hooks/useAuth";

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

  const hasRole = roles.some((r) => user.roles?.includes(r));
  return hasRole ? children : <Navigate to="/dashboard" replace />;
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await logout();    
      } finally {
        navigate("/login", { replace: true });
      }
    })();
  }, [logout, navigate]);
}

import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";

export default function Logout() {
  const { logout } = useAuth();
  useEffect(() => { logout(); }, [logout]);
  return <div className="text-center py-5">You have been signed out.</div>;
}
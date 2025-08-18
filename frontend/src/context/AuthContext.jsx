import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProfile, login as loginApi, logout as logoutApi } from "../services/auth";
import { getItem, setItem, removeItem } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getItem("token"));
  const [loading, setLoading] = useState(!!getItem("token"));

  useEffect(() => {
    async function bootstrap() {
      if (!token || !token.includes('.')) return;
      try {
        const me = await getProfile(token);
        setUser(me);
      } catch {
        setToken(null);
        removeItem("token");
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, [token]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    async login(credentials) {
      const { Token } = await loginApi(credentials);
      setToken(Token);
      setItem("token", Token);
      const { email, roles: [role] } = await getProfile(Token);
      setUser({ email, roles: [role] });

    },
    async logout() {
      try { await logoutApi(token); } catch {}
      setUser(null);
      setToken(null);
      removeItem("token");
    }
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
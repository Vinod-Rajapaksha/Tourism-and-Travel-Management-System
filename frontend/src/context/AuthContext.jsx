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
      if (!token || !token.includes(".")) {
        setLoading(false);
        return;
      }
      try {
        const me = await getProfile(token);
        const normalized = me && (me.roles || me.role)
          ? {
              email: me.email,
              roles: Array.isArray(me.roles)
                ? me.roles
                : me.role
                ? [me.role]
                : [],
            }
          : null;
        if (!normalized || !normalized.roles.length) {
          setUser(null);
          setToken(null);
          removeItem("token");
        } else {
          setUser(normalized);
        }
      } catch {
        setUser(null);
        setToken(null);
        removeItem("token");
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token,
      async login(credentials) {
        const { token } = await loginApi(credentials);
        setToken(token);
        setItem("token", token);

        const me = await getProfile(token);
        const normalized = me && (me.roles || me.role)
          ? {
              email: me.email,
              roles: Array.isArray(me.roles)
                ? me.roles
                : me.role
                ? [me.role]
                : [],
            }
          : null;
        if (!normalized || !normalized.roles.length) {
          setUser(null);
          setToken(null);
          removeItem("token");
          throw new Error("Invalid user data returned from server");
        } else {
          setUser(normalized);
        }
      },
      async logout() {
        try {
          await logoutApi(token);
        } catch {}
        setUser(null);
        setToken(null);
        removeItem("token");
      },
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const value = useMemo(
    () => ({
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,
      login: async () => {},
      logout: async () => {},
    }),
    []
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
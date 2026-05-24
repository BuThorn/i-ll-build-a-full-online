import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { api } from "../api/client";

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("accessToken")));

  async function login(username: string, password: string) {
    const { data } = await api.post("/auth/token/", { username, password });
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    setIsAuthenticated(true);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      login,
      async register(payload) {
        await api.post("/auth/register/", payload);
        await login(payload.username, payload.password);
      },
      logout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

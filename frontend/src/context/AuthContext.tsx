import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getCurrentUser, loginRequest, registerUser } from "../api/auth";
import { clearAuthTokens, setAuthTokens } from "../api/client";
import type { RegisterPayload, User } from "../types";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("accessToken")));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreUser() {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch {
        clearAuthTokens();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    restoreUser();
  }, []);

  async function login(username: string, password: string) {
    const { access, refresh } = await loginRequest(username, password);
    setAuthTokens(access, refresh);
    setIsAuthenticated(true);

    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }

  async function register(payload: RegisterPayload) {
    await registerUser(payload);
    await login(payload.username, payload.password);
  }

  function logout() {
    clearAuthTokens();
    setUser(null);
    setIsAuthenticated(false);
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

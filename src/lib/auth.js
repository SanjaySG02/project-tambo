"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CREDENTIALS = [
  { username: "admin", password: "Admin@123", role: "admin" },
  { username: "user101", password: "User@101", role: "user", unit: "101" },
  { username: "user201", password: "User@201", role: "user", unit: "201" },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const login = useCallback((username, password) => {
    const match = CREDENTIALS.find(
      (entry) => entry.username === username && entry.password === password,
    );

    if (!match) {
      return { ok: false, message: "Invalid credentials" };
    }

    const nextUser = {
      username: match.username,
      role: match.role,
      unit: match.unit || null,
    };

    setUser(nextUser);
    return { ok: true, user: nextUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isReady,
      login,
      logout,
      credentials: CREDENTIALS,
    }),
    [user, isReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

import { createContext, useEffect, useMemo, useState } from "react";
import api, { setAccessToken } from "../services/api.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        setUser(data.user);
        setAccessToken(data.accessToken);
      } catch {
        setUser(null);
        setAccessToken("");
      } finally {
        setBooting(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    setUser(data.user);
    setAccessToken(data.accessToken);
  };

  const signup = async (payload) => {
    await api.post("/auth/register", payload);
    await login({ email: payload.email, password: payload.password });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      setAccessToken("");
    }
  };

  const value = useMemo(
    () => ({
      user,
      booting,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      setUser
    }),
    [user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginWeb, loginPos } from "../services/authService";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("eazyrx_token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("eazyrx_user");
    return raw ? JSON.parse(raw) : null;
  });

  const isAuthed = !!token;

  useEffect(() => {
    if (token) localStorage.setItem("eazyrx_token", token);
    else localStorage.removeItem("eazyrx_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("eazyrx_user", JSON.stringify(user));
    else localStorage.removeItem("eazyrx_user");
  }, [user]);

  const signInWeb = async (payload) => {
    const data = await loginWeb(payload);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signInPos = async (payload) => {
    const data = await loginPos(payload);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signOut = () => {
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, isAuthed, signInWeb, signInPos, signOut }),
    [token, user, isAuthed]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

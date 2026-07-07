import { createContext, useContext, useState } from "react";
import * as dataService from "../api/dataService";

const AuthContext = createContext(null);

const STORAGE_KEY = "hm_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  });

  const login = async (username, password) => {
    const loggedIn = await dataService.login(username, password);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn));
    setUser(loggedIn);
    return loggedIn;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

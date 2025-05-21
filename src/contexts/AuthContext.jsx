import { createContext, useContext, useEffect, useState } from "react";
import axios from "../configs/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const AUTH_TOKEN_STORAGE_KEY = "auth-token";

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) {
      const isCordova = typeof window !== "undefined" && window.cordova;
  
      if (isCordova) {
        // Fake user for Cordova on reload
        setUser({
          name: "Cordova Dev User",
          email: "dev@mobile.app",
          roles: ["admin"],
          id: 9999,
        });
      } else {
        creadetioalUser();
      }
    }
  }, []);

  const login = (token, fakeUser = null) => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  
    if (fakeUser) {
      // Directly set user if passed (Cordova or mock login)
      setUser(fakeUser);
    } else {
      // Normal login – fetch from backend
      creadetioalUser();
    }
  };
  const creadetioalUser = async () => {
    axios.get("/user").then((response) => {
      setUser(response.data.data.user);
    });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

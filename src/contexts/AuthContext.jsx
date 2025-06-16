import { createContext, useContext, useEffect, useState } from "react";
import axios from "../configs/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const AUTH_TOKEN_STORAGE_KEY = "auth-token";

  useEffect(() => {
    if (localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)) {
      creadetioalUser();
    }
  }, []);

  const login = (token) => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    creadetioalUser();
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

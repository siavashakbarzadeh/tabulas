import { createContext, useContext, useEffect, useState } from "react";
import axios from "../configs/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const AUTH_TOKEN_STORAGE_KEY = "auth-token";

  // useEffect(() => {
  //   if (localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)) {
  //     creadetioalUser();
  //   }
  // }, []);
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  
    if (!token) {
      // Always fake-login for now
      const fakeToken = "dev-token";
      const fakeUser = {
        name: "Cordova Dev User",
        email: "dev@mobile.app",
        roles: ["admin"],
        id: 9999,
      };
  
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, fakeToken);
      setUser(fakeUser);
    } else {
      // If a token exists, assume already logged in
      const fakeUser = {
        name: "Cordova Dev User",
        email: "dev@mobile.app",
        roles: ["admin"],
        id: 9999,
      };
  
      setUser(fakeUser);
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

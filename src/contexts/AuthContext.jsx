import { createContext, useContext, useEffect, useState } from "react";
import axios from "../configs/axiosConfig";

const AuthContext = createContext();
const AUTH_TOKEN_STORAGE_KEY = "auth-token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const isWeb = typeof window !== "undefined";

  useEffect(() => {
    // Desktop web login
    if (isWeb && localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)) {
      credentialUser();
    }

    // Mobile app: Listen for token from React Native WebView
    if (isWeb) {
      window.addEventListener("message", receiveTokenFromApp);
      return () => window.removeEventListener("message", receiveTokenFromApp);
    }
  }, []);

  const receiveTokenFromApp = (event) => {
    try {
      const { token } = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      if (token) {
        login(token);
      }
    } catch (err) {
      console.warn("Invalid token message from app", err);
    }
  };

  const login = (token) => {
    if (isWeb) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    }
    credentialUser();
  };

  const credentialUser = () => {
    axios
      .get("/user")
      .then((response) => {
        setUser(response.data.data.user);
      })
      .catch(() => {
        logout(); // optional: cleanup on error
      });
  };

  const logout = () => {
    if (isWeb) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

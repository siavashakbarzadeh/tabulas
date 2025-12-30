import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

/**
 * Decode a JWT token to extract the payload
 */
const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const AUTH_TOKEN_STORAGE_KEY = "auth-token";

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) {
      loadUserFromToken(token);
    }
  }, []);

  /**
   * Extract user info from the Azure JWT token
   */
  const loadUserFromToken = (token) => {
    const payload = decodeJwt(token);
    if (payload) {
      // Extract user info from Azure AD JWT claims
      const userData = {
        id: payload.oid || payload.sub, // Object ID or Subject
        name: payload.name || payload.preferred_username,
        email: payload.email || payload.preferred_username || payload.upn,
        roles: payload.roles || [],
        // Token expiry
        exp: payload.exp,
      };

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        console.warn("Token expired, logging out");
        logout();
        return;
      }

      setUser(userData);
      setIsAuthenticated(true);
    } else {
      // Invalid token, clear it
      logout();
    }
  };

  const login = (token) => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    loadUserFromToken(token);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

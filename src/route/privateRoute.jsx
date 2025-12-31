import { Navigate, Outlet } from "react-router-dom";

/**
 * Check if the auth token is valid and not expired
 */
const isTokenValid = () => {
  const token = localStorage.getItem("auth-token");
  if (!token) return false;
  
  try {
    // Decode JWT to check expiry
    const base64Url = token.split('.')[1];
    if (!base64Url) return false;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.warn('[PrivateRoute] Token expired, clearing and redirecting to login');
      localStorage.removeItem("auth-token");
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('[PrivateRoute] Invalid token format:', e);
    localStorage.removeItem("auth-token");
    return false;
  }
};

function PrivateRoute() {
  return isTokenValid() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default PrivateRoute;

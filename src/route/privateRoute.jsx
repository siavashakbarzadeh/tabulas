import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * Check if the auth token is valid and not expired
 * Returns: { valid: boolean, needsCleanup: boolean }
 */
const checkToken = () => {
  const token = localStorage.getItem("auth-token");
  if (!token) return { valid: false, needsCleanup: false };
  
  try {
    // Decode JWT to check expiry
    const base64Url = token.split('.')[1];
    if (!base64Url) return { valid: false, needsCleanup: true };
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.warn('[PrivateRoute] Token expired');
      return { valid: false, needsCleanup: true };
    }
    
    return { valid: true, needsCleanup: false };
  } catch (e) {
    console.error('[PrivateRoute] Invalid token format:', e);
    return { valid: false, needsCleanup: true };
  }
};

function PrivateRoute() {
  const [authState, setAuthState] = useState(() => {
    const result = checkToken();
    return { isValid: result.valid, needsCleanup: result.needsCleanup, checked: true };
  });

  // Handle cleanup in useEffect (side effects must not happen during render)
  useEffect(() => {
    if (authState.needsCleanup) {
      console.log('[PrivateRoute] Cleaning up invalid/expired token');
      localStorage.removeItem("auth-token");
    }
  }, [authState.needsCleanup]);

  // Always make a clear decision - never render nothing
  if (authState.isValid) {
    return <Outlet />;
  }
  
  return <Navigate to="/login" replace />;
}

export default PrivateRoute;

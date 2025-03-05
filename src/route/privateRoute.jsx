import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  return localStorage.getItem("auth-token") ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoute;

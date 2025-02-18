import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  return localStorage.getItem("auth-token") ? (
    <Outlet />
  ) : (
    <Navigate to="/test/login" />
  );
}

export default PrivateRoute;

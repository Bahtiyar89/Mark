import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { getItemFromStorage } from "utils/localStorage";
// import { useAuthContext } from "../context/AuthProvider";

function PrivateRouter() {
  const location = useLocation();
  if (!getItemFromStorage("access_token")) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export default PrivateRouter;

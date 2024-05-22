import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuthContext } from "../context/AuthProvider";

function PublicRouter() {
  const location = useLocation();
  const fromPage = location.state?.from?.pathname || "/";
  // const { authRouter }: any = useAuthContext();

  if (!true) {
    return <Navigate to={fromPage} replace />;
  }

  return <Outlet />;
}

export default PublicRouter;

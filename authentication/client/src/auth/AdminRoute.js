import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuth } from "./helpers";

const AdminRoute = () => {
  return isAuth() && isAuth()?.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
};

export default AdminRoute;

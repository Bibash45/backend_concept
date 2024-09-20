import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuth } from "./helpers"; // Assuming this function checks if a user is authenticated

const PrivateRoute = () => {
  return isAuth() ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;

import React, { Fragment } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { isAuth, signout } from "../auth/helpers";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? { color: "#000", fontWeight: "600" }
      : { color: "#fff" };
  };

  const nav = () => {
    const auth = isAuth();

    return (
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <Link to="/" className="nav-link" style={isActive("/")}>
            Home
          </Link>
        </li>

        {auth && auth.role === "admin" && (
          <li className="nav-item">
            <Link
              to="/admin"
              className="nav-link text-"
              style={isActive("/admin")}
            >
              {auth.name}
            </Link>
          </li>
        )}
        {auth && auth.role === "subscriber" && (
          <li className="nav-item">
            <Link
              to="/private"
              className="nav-link text-"
              style={isActive("/private")}
            >
              {auth.name}
            </Link>
          </li>
        )}

        {!auth ? (
          <>
            <li className="nav-item">
              <Link
                to="/signin"
                className="nav-link"
                style={isActive("/signin")}
              >
                Signin
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/signup"
                className="nav-link"
                style={isActive("/signup")}
              >
                Signup
              </Link>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <Link
              onClick={() => {
                signout(() => {
                  navigate("/");
                });
              }}
              className="nav-link btn btn-link text-light"
              style={isActive("/")}
            >
              Signout
            </Link>
          </li>
        )}
      </ul>
    );
  };

  return (
    <Fragment>
      {nav()}
      <div className="container">
        <Outlet />
      </div>
    </Fragment>
  );
};

export default Layout;

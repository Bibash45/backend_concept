import React, { Fragment } from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  const nav = () => {
    return (
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item ">
          <Link to="/" className="text-light nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item ">
          <Link to="/signup" className="text-light nav-link">
            Signup
          </Link>
        </li>
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

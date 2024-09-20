import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Layout from "./core/Layout";
import Home from "./core/Home";
import Error from "./components/Error";
import Signup from "./auth/Signup";
import Signin from "./auth/Signin";
import Activate from "./auth/Activate";
import Private from "./core/Private";
import PrivateRoute from "./auth/PrivateRoute";
import AdminRoute from "./auth/AdminRoute";
import Admin from "./core/Admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "auth/activate/:token",
        element: <Activate />,
      },
      {
        path: "private",
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <Private />,
          },
        ],
      },
      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: <Admin />,
          },
        ],
      },
    ],
  },
]);

const MyRouter = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default MyRouter;

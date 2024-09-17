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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement:<Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path:"/signup",
        element:<Signup />
      }
    ],
  },
]);

const MyRouter = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default MyRouter;

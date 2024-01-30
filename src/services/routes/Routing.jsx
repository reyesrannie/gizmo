import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Login from "../../screen/login/Login";
import AppBar from "../../components/customs/AppBar";
import Dashboard from "../../screen/dashboard/Dashboard";
import { decodeUser } from "../functions/saveUser";
import UserAccounts from "../../screen/user/accounts/UserAccounts";
import UserManagement from "../../screen/user/UserManagement";

const Routing = () => {
  const user = decodeUser();
  const routes = useRoutes([
    {
      path: "/login",
      element: !user ? <Login /> : <Navigate to={"/"} />,
    },
    {
      path: "/",
      element: user ? <AppBar /> : <Navigate to={"/login"} />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "account",
          element: <UserManagement />,
          children: [
            {
              path: "users",
              element: <UserAccounts />,
            },
          ],
        },
      ],
    },
  ]);

  return routes;
};

export default Routing;

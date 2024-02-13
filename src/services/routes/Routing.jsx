import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Login from "../../screen/login/Login";
import AppBar from "../../components/customs/AppBar";
import Dashboard from "../../screen/dashboard/Dashboard";
import { decodeUser } from "../functions/saveUser";
import UserAccounts from "../../screen/user/accounts/UserAccounts";
import UserManagement from "../../screen/user/UserManagement";
import RoleManagement from "../../screen/user/accounts/RoleManagement";
import Masterlist from "../../screen/masterlist/Masterlist";
import Company from "../../screen/masterlist/charging/Company";
import Department from "../../screen/masterlist/charging/Department";
import Location from "../../screen/masterlist/charging/Location";
import AccountsPayable from "../../screen/masterlist/ap/AccountsPayable";
import { hasAccess } from "../functions/access";

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
          element: hasAccess(["dashboard"]) ? <Dashboard /> : <></>,
        },
      ],
    },
    {
      path: "/account",
      element: user ? <AppBar /> : <Navigate to={"/login"} />,
      children: [
        {
          path: "",
          element: hasAccess(["user", "role"]) ? (
            <UserManagement />
          ) : (
            <Navigate to={"/"} />
          ),
        },
        {
          path: "users",
          element: hasAccess(["user"]) ? (
            <UserAccounts />
          ) : (
            <Navigate to={"/account"} />
          ),
        },
        {
          path: "roles",
          element: hasAccess(["role"]) ? (
            <RoleManagement />
          ) : (
            <Navigate to={"/account"} />
          ),
        },
      ],
    },
    {
      path: "/masterlist",
      element: user ? <AppBar /> : <Navigate to={"/login"} />,
      children: [
        {
          path: "",
          element: hasAccess(["company", "department", "location", "ap"]) ? (
            <Masterlist />
          ) : (
            <Navigate to={"/"} />
          ),
        },
        {
          path: "company",
          element: hasAccess(["company"]) ? (
            <Company />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
        {
          path: "department",
          element: hasAccess(["department"]) ? (
            <Department />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
        {
          path: "location",
          element: hasAccess(["location"]) ? (
            <Location />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
        {
          path: "ap",
          element: hasAccess(["ap"]) ? (
            <AccountsPayable />
          ) : (
            <Navigate to={"/masterlist"} />
          ),
        },
      ],
    },
  ]);

  return routes;
};

export default Routing;

import { Breadcrumbs, Link, Typography } from "@mui/material";
import React from "react";

import { useLocation, useNavigate } from "react-router";
import "../styles/Breadcrums.scss";

const Breadcrums = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routes = [
    {
      path: "/account",
      name: "User Management",
      children: [
        {
          path: "/account/roles",
          name: "Role Management",
        },
        {
          path: "/account/users",
          name: "User Accounts",
        },
      ],
    },
  ];

  const renderBreadcrumbLinks = (route) => {
    const breadcrumbLinks = [
      <Link
        key={route.path}
        href={route.path}
        onClick={(e) => {
          e.preventDefault();
          navigate(route.path);
        }}
        underline="hover"
      >
        {route.name}
      </Link>,
    ];

    if (route.children) {
      route.children.forEach((childRoute) => {
        location.pathname === childRoute.path &&
          breadcrumbLinks.push(
            <Typography className="last-item-breadcrumbs">
              {childRoute.name}
            </Typography>
          );
      });
    }

    return breadcrumbLinks;
  };

  return (
    <Breadcrumbs className="breadcrums-text">
      <Link
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
        underline="hover"
      >
        Home
      </Link>
      {routes.map(
        (route) =>
          location.pathname.split("/").slice(0, 2).join("/") === route.path &&
          renderBreadcrumbLinks(route)
      )}
    </Breadcrumbs>
  );
};

export default Breadcrums;

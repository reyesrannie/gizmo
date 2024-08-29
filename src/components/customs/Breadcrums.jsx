import { Breadcrumbs, Link, Typography } from "@mui/material";
import React from "react";

import { useLocation, useNavigate } from "react-router";
import "../styles/Breadcrums.scss";
import { routes } from "../../services/constants/items";
import { useDispatch } from "react-redux";
import { resetMenu } from "../../services/slice/menuSlice";
import { resetTransaction } from "../../services/slice/transactionSlice";
import { resetHeader } from "../../services/slice/headerSlice";

const Breadcrums = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const renderBreadcrumbLinks = (route) => {
    const breadcrumbLinks = [
      <Link
        key={route.path}
        href={route.path}
        onClick={(e) => {
          e.preventDefault();
          dispatch(resetMenu());
          dispatch(resetTransaction());
          dispatch(resetHeader());

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
          dispatch(resetTransaction());
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

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import React from "react";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";

import "../styles/MenuDrawer.scss";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { setDrawer } from "../../services/slice/menuSlice";

const MenuDrawer = () => {
  const openDrawer = useSelector((state) => state.menu.drawer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      desc: "Dashboard",
      icon: <DashboardOutlinedIcon />,
      path: "/",
      children: [],
    },
    {
      desc: "User Management",
      icon: <SupervisorAccountOutlinedIcon />,
      path: "/account",
      children: [
        {
          desc: "Role Management",
          icon: <SettingsAccessibilityIcon />,
          path: "/account/roles",
        },
        {
          desc: "User Accounts",
          icon: <ManageAccountsOutlinedIcon />,
          path: "/account/users",
        },
      ],
    },
    {
      desc: "Masterlist",
      icon: <ListAltOutlinedIcon />,
      path: "/masterlist",
      children: [],
    },
    {
      desc: "Items",
      icon: <DashboardOutlinedIcon />,
      path: "/item",
      children: [],
    },
  ];

  const isTablet = useMediaQuery("(max-width:768px)");

  return (
    <Drawer
      variant="permanent"
      className={`menuDrawer ${openDrawer === true ? "open" : ""}`}
    >
      <Toolbar />

      <List className={`menuList ${openDrawer === true ? "open" : ""} `}>
        {menu.map((menus) => (
          <React.Fragment key={menus.path}>
            {menus?.children?.length !== 0 && openDrawer ? (
              <Accordion
                key={menus.desc}
                expanded={
                  location.pathname === menus.path ||
                  location.pathname.split("/").slice(0, 2).join("/") ===
                    menus.path
                }
                className="accordion-drawer"
                elevation={0}
              >
                <ListItemButton
                  className={`selectedList ${
                    location.pathname === menus.path ||
                    location.pathname.split("/").slice(0, 2).join("/") ===
                      menus.path
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    navigate(menus.path);
                    isTablet && dispatch(setDrawer(false));
                  }}
                >
                  <ListItemIcon
                    className={`list-icon ${
                      location.pathname === menus.path ||
                      location.pathname.split("/").slice(0, 2).join("/") ===
                        menus.path
                        ? "selected"
                        : ""
                    } `}
                  >
                    {menus.icon}
                  </ListItemIcon>
                  <ListItemText
                    className={`listText ${
                      location.pathname === menus.path ||
                      location.pathname.split("/").slice(0, 2).join("/") ===
                        menus.path
                        ? "selected"
                        : ""
                    }`}
                    primary={menus.desc}
                  />
                </ListItemButton>
                {menus?.children?.map((child) => (
                  <ListItemButton
                    className={`selectedChildList ${
                      location.pathname === child.path ? "selected" : ""
                    }`}
                    onClick={() => {
                      navigate(child.path);
                      isTablet && dispatch(setDrawer(false));
                    }}
                    key={child.path}
                  >
                    <ListItemIcon
                      className={`list-icon ${
                        location.pathname === child.path ? "selected" : ""
                      } `}
                    >
                      {child.icon}
                    </ListItemIcon>
                    <ListItemText
                      className={`listText ${
                        location.pathname === child.path ? "selected" : ""
                      }`}
                      primary={child.desc}
                    />
                  </ListItemButton>
                ))}

                <Divider />
              </Accordion>
            ) : (
              <ListItemButton
                className={`selectedList ${
                  location.pathname === menus.path ||
                  location.pathname.split("/").slice(0, 2).join("/") ===
                    menus.path
                    ? "selected"
                    : ""
                }`}
                onClick={() => {
                  navigate(menus.path);
                  isTablet && dispatch(setDrawer(false));
                }}
              >
                <ListItemIcon
                  className={`list-icon ${
                    location.pathname === menus.path ||
                    location.pathname.split("/").slice(0, 2).join("/") ===
                      menus.path
                      ? "selected"
                      : ""
                  } `}
                >
                  {menus.icon}
                </ListItemIcon>
                <ListItemText
                  className={`listText ${
                    location.pathname === menus.path ? "selected" : ""
                  }`}
                  primary={menus.desc}
                />
              </ListItemButton>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default MenuDrawer;

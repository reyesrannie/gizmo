import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect } from "react";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";

import "../styles/MenuDrawer.scss";
import { useDispatch, useSelector } from "react-redux";
import { setDrawer } from "../../services/slice/menuSlice";
import { useLocation, useNavigate } from "react-router";

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
      children: [],
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
  useEffect(() => {
    if (isTablet) {
      dispatch(setDrawer(false));
    }
  }, [isTablet, dispatch]);

  return (
    <Drawer
      variant="permanent"
      className={`menuDrawer ${openDrawer === true ? "open" : ""}`}
    >
      <Toolbar />

      <List className={`menuList ${openDrawer ? "open" : ""} `}>
        {menu.map((menus) => (
          <ListItemButton
            className={`selectedList ${
              location.pathname === menus.path ? "selected" : ""
            }`}
            key={menus.desc}
            onClick={() => {
              navigate(menus.path);
            }}
          >
            <ListItemIcon
              className={`list-icon ${
                location.pathname === menus.path ? "selected" : ""
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
        ))}
      </List>
    </Drawer>
  );
};

export default MenuDrawer;

import {
  Divider,
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

import logo from "../../assets/logo-name.png";
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
      path: "/dashboard",
      children: [],
    },
    {
      desc: "Masterlist",
      icon: <ListAltOutlinedIcon />,
      path: "/masterlist",
      children: [],
    },
  ];

  const isTablet = useMediaQuery("(max-width:768px)");
  useEffect(() => {
    if (isTablet) {
      dispatch(setDrawer(false));
    }
  }, [isTablet]);

  return (
    <Drawer
      variant="permanent"
      className={`menuDrawer ${openDrawer === true ? "open" : ""}`}
    >
      <Toolbar className="toolBarMenu">
        {openDrawer && <img src={logo} alt="logo" className="appBarLogo" />}
      </Toolbar>

      <List className={`menuList ${openDrawer ? "open" : ""} `}>
        {menu.map((menus) => (
          <ListItemButton
            className={`selectedList ${
              location.pathname === menus.path ? "select" : ""
            }`}
            key={menus.desc}
            onClick={() => {
              navigate(menus.path);
            }}
          >
            <ListItemIcon>{menus.icon}</ListItemIcon>
            {openDrawer && (
              <ListItemText className="listText" primary={menus.desc} />
            )}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default MenuDrawer;

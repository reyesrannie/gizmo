import {
  Accordion,
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
import "../styles/MenuDrawer.scss";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { setDrawer } from "../../services/slice/menuSlice";
import { menu } from "../../services/constants/items";

const MenuDrawer = () => {
  const openDrawer = useSelector((state) => state.menu.drawer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isTablet = useMediaQuery("(max-width:768px)");

  return (
    <Drawer
      variant="permanent"
      className={`menuDrawer ${openDrawer === true ? "open" : ""}`}
    >
      <Toolbar className="toolbar-menu-bar" />

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

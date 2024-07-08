import {
  Accordion,
  Badge,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect } from "react";
import "../styles/MenuDrawer.scss";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  resetMenuWithoutDrawer,
  setDrawer,
} from "../../services/slice/menuSlice";
import { menu } from "../../services/constants/items";
import { hasAccess } from "../../services/functions/access";
import { resetTransaction } from "../../services/slice/transactionSlice";
import CountDistribute from "../../services/functions/CountDistribute";
import { resetHeader, setHeader } from "../../services/slice/headerSlice";
import logo from "../../assets/misLogo.png";

const MenuDrawer = () => {
  const { menuCount, childMenuCount, countGrandChildcheck } = CountDistribute();
  const openDrawer = useSelector((state) => state.menu.drawer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isTablet = useMediaQuery("(max-width:768px)");
  const header = useSelector((state) => state.headers.header);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.classList.value === "") dispatch(setDrawer(false));
    };

    if (openDrawer) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [dispatch, openDrawer]);

  return (
    <Drawer
      variant="permanent"
      className={`menuDrawer ${openDrawer === true ? "open" : ""}`}
    >
      <Toolbar className="toolbar-menu-bar" />

      <List className={`menuList ${openDrawer === true ? "open" : ""} `}>
        {menu?.map((menus) => (
          <React.Fragment key={menus.path}>
            {hasAccess(menus?.permission) && (
              <>
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
                        dispatch(resetHeader());
                        dispatch(resetMenuWithoutDrawer());
                        dispatch(resetTransaction());
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
                        <Badge
                          badgeContent={menus ? menuCount(menus.desc) : 0}
                          color="error"
                          max={10}
                        >
                          {menus.icon}
                        </Badge>
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

                    {menus?.children?.map((child, index) => {
                      return hasAccess(child?.permission) && child?.child ? (
                        <Accordion
                          key={index}
                          expanded={
                            location.pathname === child.path ||
                            location.pathname
                              .split("/")
                              .slice(0, 2)
                              .join("/") === child.path
                          }
                          className="accordion-drawer"
                          elevation={0}
                        >
                          <ListItemButton
                            className={`selectedChildList-child ${
                              location.pathname === child.path ? "selected" : ""
                            }`}
                            onClick={() => {
                              dispatch(resetTransaction());
                              dispatch(resetMenuWithoutDrawer());
                              dispatch(resetHeader());
                              navigate(child.path);
                              isTablet && dispatch(setDrawer(false));
                            }}
                          >
                            <ListItemIcon
                              className={`list-icon ${
                                location.pathname === child.path
                                  ? "selected"
                                  : ""
                              } `}
                            >
                              <Badge
                                badgeContent={
                                  menus ? childMenuCount(child.desc) : 0
                                }
                                color="error"
                                max={10}
                              >
                                {child.icon}
                              </Badge>
                            </ListItemIcon>
                            <ListItemText
                              className={`listText ${
                                location.pathname === child.path
                                  ? "selected"
                                  : ""
                              }`}
                              primary={child.desc}
                            />
                          </ListItemButton>
                          {child?.child?.map((grandChild, index) => {
                            return (
                              <ListItemButton
                                className={`selectedChildList ${
                                  header === grandChild.desc ? "selected" : ""
                                }`}
                                onClick={() => {
                                  dispatch(setHeader(grandChild?.desc));
                                  dispatch(resetMenuWithoutDrawer());
                                  isTablet && dispatch(setDrawer(false));
                                }}
                                key={index}
                              >
                                <ListItemIcon
                                  className={`list-icon ${
                                    header === grandChild.desc ? "selected" : ""
                                  } `}
                                >
                                  <Badge
                                    badgeContent={
                                      menus
                                        ? countGrandChildcheck(
                                            grandChild?.desc,
                                            child?.desc
                                          )
                                        : 0
                                    }
                                    color="error"
                                    max={10}
                                  >
                                    {grandChild.icon}
                                  </Badge>
                                </ListItemIcon>
                                <ListItemText
                                  className={`listText ${
                                    header === grandChild.desc ? "selected" : ""
                                  }`}
                                  primary={grandChild.desc}
                                />
                              </ListItemButton>
                            );
                          })}
                        </Accordion>
                      ) : (
                        hasAccess(child?.permission) && (
                          <ListItemButton
                            className={`selectedChildList ${
                              location.pathname === child.path ? "selected" : ""
                            }`}
                            onClick={() => {
                              dispatch(resetTransaction());
                              dispatch(resetMenuWithoutDrawer());
                              navigate(child.path);
                              isTablet && dispatch(setDrawer(false));
                            }}
                            key={index}
                          >
                            <ListItemIcon
                              className={`list-icon ${
                                location.pathname === child.path
                                  ? "selected"
                                  : ""
                              } `}
                            >
                              <Badge
                                badgeContent={
                                  menus ? childMenuCount(child.desc) : 0
                                }
                                color="error"
                                max={10}
                              >
                                {child.icon}
                              </Badge>
                            </ListItemIcon>
                            <ListItemText
                              className={`listText ${
                                location.pathname === child.path
                                  ? "selected"
                                  : ""
                              }`}
                              primary={child.desc}
                            />
                          </ListItemButton>
                        )
                      );
                    })}

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
                      dispatch(resetMenuWithoutDrawer());
                      dispatch(resetTransaction());
                      dispatch(resetHeader());
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
                      <Badge
                        badgeContent={menus ? menuCount(menus.desc) : 0}
                        color="error"
                        max={10}
                      >
                        {menus.icon}
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      className={`listText ${
                        location.pathname === menus.path ? "selected" : ""
                      }`}
                      primary={menus.desc}
                    />
                  </ListItemButton>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </List>
      <Box className="end-of-drawer">
        <img src={logo} alt="logo" className="misLogo" draggable="false" />
        <Typography className={`misRights ${!openDrawer ? `close` : ""}`}>
          Powered By MIS All rights reserved
        </Typography>
        {openDrawer && (
          <Typography className={`misRights ${!openDrawer ? `close` : ""}`}>
            Copyrights &copy; 2024
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default MenuDrawer;

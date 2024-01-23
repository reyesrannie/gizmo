import React from "react";
import {
  Box,
  IconButton,
  AppBar as MuiAppBar,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setDrawer } from "../../services/slice/menuSlice";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import "../styles/AppBar.scss";

import logo from "../../assets/logo-appBar.png";
import { useState } from "react";
import MenuDrawer from "./MenuDrawer";
import { Outlet } from "react-router-dom";

const AppBar = () => {
  const dispatch = useDispatch();
  const openDrawer = useSelector((state) => state.menu.drawer);
  const [anchorEl, setAnchorEl] = useState(null);

  const isTablet = useMediaQuery("(max-width:768px)");

  return (
    <Box className="appbar-container open">
      <MuiAppBar className="appBar" color="secondary">
        <Box className={`menuBarBox ${openDrawer ? "open" : ""}`}>
          {!openDrawer && (
            <IconButton
              onClick={() =>
                isTablet
                  ? dispatch(setDrawer(false))
                  : dispatch(setDrawer(true))
              }
            >
              <MenuOutlinedIcon />
            </IconButton>
          )}
          <Box>
            {!openDrawer && (
              <img src={logo} alt="logo" className="appBarLogo" />
            )}
            {openDrawer && (
              <IconButton onClick={() => dispatch(setDrawer(false))}>
                <ChevronLeftIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        <Box>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <AccountCircleOutlinedIcon />
          </IconButton>
        </Box>
      </MuiAppBar>
      <MenuDrawer />
      <Outlet />
    </Box>
  );
};

export default AppBar;

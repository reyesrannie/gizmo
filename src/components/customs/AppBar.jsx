import React from "react";
import {
  Box,
  IconButton,
  AppBar as MuiAppBar,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setDrawer } from "../../services/slice/menuSlice";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
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
        <Box className={`menuBarBox`}>
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
          {openDrawer && (
            <IconButton onClick={() => dispatch(setDrawer(false))}>
              <MenuOutlinedIcon />
            </IconButton>
          )}
          <Box>
            <img src={logo} alt="logo" className="appBarLogo" />
          </Box>
        </Box>
        <Box>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <AccountCircleOutlinedIcon />
          </IconButton>
        </Box>
      </MuiAppBar>
      <MenuDrawer />
      <Paper
        elevation={0}
        className={`body-container ${openDrawer ? "open" : ""}`}
      >
        <Outlet />
      </Paper>
    </Box>
  );
};

export default AppBar;

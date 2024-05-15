import React, { Suspense, useEffect } from "react";
import {
  Box,
  Dialog,
  IconButton,
  Menu,
  AppBar as MuiAppBar,
  Paper,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setAccountMenu, setDrawer } from "../../services/slice/menuSlice";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import "../styles/AppBar.scss";
import loading from "../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";
import logo from "../../assets/logo-appBar.png";
import { useState } from "react";
import MenuDrawer from "./MenuDrawer";
import { Outlet } from "react-router-dom";
import { decodeUser } from "../../services/functions/saveUser";
import AccountMenu from "./AccountMenu";
import ChangePassword from "./modal/ChangePassword";
import socket from "../../services/functions/serverSocket";
import { useSnackbar } from "notistack";
import { jsonServerAPI } from "../../services/store/request";
import { events } from "../../services/constants/socketItems";

const AppBar = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const changePass = useSelector((state) => state.auth.changePass);
  const openDrawer = useSelector((state) => state.menu.drawer);
  const openAccountMenu = useSelector((state) => state.menu.accountMenu);
  const userData = decodeUser();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const updateHandler = (value, data) => {
      if (
        userData?.scope_tagging?.some(
          (item) => item?.ap_id === data?.ap_tagging_id
        )
      ) {
        enqueueSnackbar(data?.message, { variant: "success" });
      }
      if (
        value?.event === "transaction_received" &&
        userData?.role?.access_permission?.includes("tagging")
      ) {
        enqueueSnackbar(data?.message, { variant: "success" });
      }
      if (
        value?.event === "transaction_archived" &&
        userData?.role?.access_permission?.includes("tagging")
      ) {
        enqueueSnackbar(data?.message, { variant: "success" });
      }
      if (
        value?.event === "transaction_approval" &&
        userData?.role?.access_permission?.includes("approver")
      ) {
        enqueueSnackbar(data?.message, { variant: "success" });
      }

      dispatch(jsonServerAPI?.util?.invalidateTags(value?.tags));
    };

    const eventListeners = {};
    Object.entries(events).forEach(([key, value]) => {
      eventListeners[key] = (data) => updateHandler(value, data);
      socket.on(value?.event, eventListeners[key]);
    });

    return () => {
      Object.entries(events).forEach(([key, value]) => {
        socket.off(value?.event, eventListeners[key]);
      });
    };
  }, [socket, userData]);

  return (
    <Box className="appbar-container open">
      <MuiAppBar className="appBar" color="secondary">
        <Box className={`menuBarBox`}>
          {/* {!openDrawer && (
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
          {openDrawer && ( */}
          <IconButton onClick={() => dispatch(setDrawer(!openDrawer))}>
            <MenuOutlinedIcon />
          </IconButton>
          {/* )} */}
          <Box>
            <img src={logo} alt="logo" className="appBarLogo" />
          </Box>
        </Box>
        <Box>
          <IconButton
            onClick={(e) => {
              dispatch(setAccountMenu(true));
              setAnchorEl(e.currentTarget);
            }}
          >
            <Box className="appBar-account-settings">
              <Typography className="account-first-letter" color="secondary">
                {userData?.account?.first_name?.charAt(0)}
              </Typography>
            </Box>
          </IconButton>
        </Box>
      </MuiAppBar>
      <MenuDrawer />
      <Paper
        elevation={0}
        className={`body-container ${openDrawer ? "open" : ""}`}
      >
        <Suspense
          fallback={
            <Box className="loadingComponentFallBack">
              <Lottie animationData={loading} loop />
            </Box>
          }
        >
          <Outlet />
        </Suspense>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={openAccountMenu}
        onClose={() => {
          dispatch(setAccountMenu(false));
          setAnchorEl(null);
        }}
      >
        <AccountMenu
          onClose={() => {
            dispatch(setAccountMenu(false));
            setAnchorEl(null);
          }}
        />
      </Menu>
      <Dialog open={changePass}>
        <ChangePassword logged />
      </Dialog>
    </Box>
  );
};

export default AppBar;

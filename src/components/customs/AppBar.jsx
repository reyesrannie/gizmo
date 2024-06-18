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
import moment from "moment";

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
import {
  jsonServerAPI,
  useAccountNumberQuery,
  useApQuery,
  useCutOffQuery,
  useDocumentTypeQuery,
  useLocationQuery,
  useSchedTransactionQuery,
  useSupplierQuery,
} from "../../services/store/request";
import { events } from "../../services/constants/socketItems";
import NotificationSchedule from "./NotificationSchedule";
import { setOpenNotification } from "../../services/slice/promptSlice";
import DateChecker from "../../services/functions/DateChecker";
import { hasAccess } from "../../services/functions/access";

const AppBar = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const changePass = useSelector((state) => state.auth.changePass);
  const openDrawer = useSelector((state) => state.menu.drawer);
  const openAccountMenu = useSelector((state) => state.menu.accountMenu);
  const openNotification = useSelector(
    (state) => state.prompt.openNotification
  );
  const userData = decodeUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const { isCoverageToday } = DateChecker();

  const {
    data: scheduledTransaction,
    isSuccess: successSched,
    isError: errorSched,
  } = useSchedTransactionQuery({
    pagination: "none",
    state: "approved",
    access: "ap",
  });

  const {
    data: tin,
    isLoading: loadingTIN,
    isSuccess: supplySuccess,
  } = useSupplierQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: document,
    isLoading: loadingDocument,
    isSuccess: documentSuccess,
  } = useDocumentTypeQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: ap,
    isLoading: loadingAp,
    isSuccess: apSuccess,
  } = useApQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: accountNumber,
    isLoading: loadingAccountNumber,
    isSuccess: accountSuccess,
  } = useAccountNumberQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: location,
    isLoading: loadingLocation,
    isSuccess: locationSuccess,
  } = useLocationQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: cutOff,
    isLoading: loadingCutOff,
    isSuccess: cutOffSuccess,
  } = useCutOffQuery({
    status: "active",
    pagination: "none",
  });

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

  useEffect(() => {
    if (successSched) {
      const isToday = isCoverageToday(scheduledTransaction?.result);
      dispatch(setOpenNotification(isToday));
    }
    if (errorSched) {
      dispatch(setOpenNotification(false));
    }
  }, [successSched, scheduledTransaction, errorSched]);

  return (
    <Box className="appbar-container open">
      <MuiAppBar className="appBar" color="secondary">
        <Box className={`menuBarBox`}>
          <IconButton onClick={() => dispatch(setDrawer(!openDrawer))}>
            <MenuOutlinedIcon />
          </IconButton>
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
        {openNotification && hasAccess(["ap_tag"]) && <NotificationSchedule />}
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

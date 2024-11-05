import React, { Suspense, useEffect, useRef } from "react";
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
import NotificationSchedule from "./NotificationSchedule";
import { setOpenNotification } from "../../services/slice/promptSlice";
import DateChecker from "../../services/functions/DateChecker";
import { hasAccess } from "../../services/functions/access";
import EchoInstance from "../../services/functions/backendSocket";
import { socketEvents } from "../../services/constants/socketEvents";
import { seconAPIRequest } from "../../services/store/seconAPIRequest";

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

  const { isCoverageToday, autoGenerateVoucher } = DateChecker();

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

  const channelListenersRef = useRef({});

  useEffect(() => {
    socketEvents?.forEach(({ channel, event, tags, action }) => {
      const echoChannel = EchoInstance?.channel(channel);
      channelListenersRef.current[channel] = echoChannel
        .subscribed((event) => {})
        .listen(event, (data) => {
          if (action?.some((act) => act === "dispatch")) {
            dispatch(jsonServerAPI?.util?.invalidateTags(tags));
            dispatch(seconAPIRequest?.util?.invalidateTags(tags));
          } else if (action?.some((act) => act === "AP")) {
            if (
              data?.gas_status === "pending" ||
              userData?.scope_tagging?.some(
                (tag) => tag?.ap_id === data?.ap_tagging_id
              )
            ) {
              dispatch(jsonServerAPI?.util?.invalidateTags(tags));
              dispatch(seconAPIRequest?.util?.invalidateTags(tags));
            }

            if (data?.state === "For Computation" && hasAccess(["tagging"])) {
              dispatch(jsonServerAPI?.util?.invalidateTags(tags));
              dispatch(seconAPIRequest?.util?.invalidateTags(tags));
            }

            if (data?.state === "For Approval" && hasAccess(["approver"])) {
              dispatch(jsonServerAPI?.util?.invalidateTags(tags));
              dispatch(seconAPIRequest?.util?.invalidateTags(tags));
            }
            if (
              data?.state === "approved" &&
              userData?.scope_tagging?.some(
                (tag) => tag?.ap_id === data?.ap_tagging_id
              )
            ) {
              dispatch(jsonServerAPI?.util?.invalidateTags(tags));
              dispatch(seconAPIRequest?.util?.invalidateTags(tags));
            }
          } else if (action?.some((act) => act === "Treasury")) {
            if (
              hasAccess(["preparation", "releasing", "clearing"]) ||
              userData?.scope_tagging?.some((tag) =>
                data?.ap_tagging_id?.includes(tag?.ap_id)
              )
            ) {
              dispatch(jsonServerAPI?.util?.invalidateTags(tags));
              dispatch(seconAPIRequest?.util?.invalidateTags(tags));
            }
          } else {
            enqueueSnackbar(data?.message, { variant: "success" });
          }
        });
    });
    return () => {
      Object.entries(channelListenersRef.current).forEach(
        ([channel, listener]) => {
          listener.stopListening(channel);
          EchoInstance.leaveChannel(channel);
        }
      );
    };
  }, [socketEvents, EchoInstance, userData]);

  useEffect(() => {
    if (successSched) {
      const isToday = isCoverageToday(scheduledTransaction?.result);
      autoGenerateVoucher(scheduledTransaction?.result);
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

      <Dialog
        open={openNotification && hasAccess("sched_transact_generate")}
        className="loading-Generate"
      >
        <Lottie animationData={loading} loop />
        <Typography>Generating scheduled transaction......</Typography>
      </Dialog>
    </Box>
  );
};

export default AppBar;

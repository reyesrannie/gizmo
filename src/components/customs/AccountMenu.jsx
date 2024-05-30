import {
  Divider,
  ListItemIcon,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import React from "react";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";

import "../styles/AccountMenu.scss";
import { useDispatch } from "react-redux";
import { resetAuth, setChangePass } from "../../services/slice/authSlice";
import { decodeUser } from "../../services/functions/saveUser";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../services/store/request";
import { resetLogs } from "../../services/slice/logSlice";
import { resetOption } from "../../services/slice/optionsSlice";
import { resetTransaction } from "../../services/slice/transactionSlice";
import { resetPrompt } from "../../services/slice/promptSlice";

const AccountMenu = ({ onClose }) => {
  const userData = decodeUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("GIZMO");
    localStorage.removeItem("GIZMO_token");
    dispatch(resetAuth());
    dispatch(resetLogs());
    dispatch(resetOption());
    dispatch(resetTransaction());
    dispatch(resetPrompt());
    navigate("/");
  };

  return (
    <MenuList className="account-menu-container">
      <MenuItem onClick={onClose}>
        <ListItemIcon>
          <AccountCircleOutlinedIcon className="account-menu-icons" />
        </ListItemIcon>
        <Typography className="account-menu-name">
          {userData?.username}
        </Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClose}>
        <ListItemIcon>
          <ManageAccountsOutlinedIcon className="account-menu-icons" />
        </ListItemIcon>
        <Typography className="account-menu-text">Update Account</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClose();
          dispatch(setChangePass(true));
        }}
      >
        <ListItemIcon>
          <PasswordOutlinedIcon className="account-menu-icons" />
        </ListItemIcon>
        <Typography className="account-menu-text">Change Password</Typography>
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={() => {
          handleLogout();
          onClose();
        }}
      >
        <ListItemIcon>
          <PowerSettingsNewOutlinedIcon className="account-menu-icons" />
        </ListItemIcon>
        <Typography className="account-menu-text">Logout</Typography>
      </MenuItem>
    </MenuList>
  );
};

export default AccountMenu;

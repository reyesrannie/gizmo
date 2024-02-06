import React from "react";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import NavigationOutlinedIcon from "@mui/icons-material/NavigationOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";

import "../../components/styles/CardNavigation.scss";
const items = [
  {
    path: "/account/roles",
    desc: "Assign specific permissions to roles to control access to various features.",
    name: "Role Management",
    firstIcon: (
      <SettingsAccessibilityIcon
        color="secondary"
        className="icon-card-details"
      />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/account/users",
    desc: " Stores and manages essential information about each user.",
    name: "User Management",
    firstIcon: (
      <ManageAccountsOutlinedIcon
        color="secondary"
        className="icon-card-details"
      />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
];

export default items;

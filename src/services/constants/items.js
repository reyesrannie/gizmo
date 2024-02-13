import React from "react";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import NavigationOutlinedIcon from "@mui/icons-material/NavigationOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import EmojiTransportationOutlinedIcon from "@mui/icons-material/EmojiTransportationOutlined";
import Diversity2OutlinedIcon from "@mui/icons-material/Diversity2Outlined";
import ShareLocationOutlinedIcon from "@mui/icons-material/ShareLocationOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

import "../../components/styles/CardNavigation.scss";
const user = [
  {
    path: "/account/roles",
    desc: "Assign specific permissions to roles to control access to various features.",
    name: "Role Management",
    permission: ["role"],
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
    permission: ["user"],
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

const masterlist = [
  {
    path: "/masterlist/company",
    desc: "A centralized repository of information related to the management structure.",
    name: "Company",
    permission: ["company"],
    firstIcon: (
      <EmojiTransportationOutlinedIcon
        color="secondary"
        className="icon-card-details"
      />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/masterlist/department",
    desc: "A module for  managing essential information about different departments.",
    name: "Department",
    permission: ["department"],

    firstIcon: (
      <Diversity2OutlinedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/masterlist/location",
    desc: "A module for storing information about locations or branches of the company.",
    name: "Location",
    permission: ["location"],

    firstIcon: (
      <ShareLocationOutlinedIcon
        color="secondary"
        className="icon-card-details"
      />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/masterlist/ap",
    desc: "A module for managing essential information about Accounts Payable .",
    name: "Accounts Payable",
    permission: ["ap"],
    firstIcon: (
      <MonetizationOnOutlinedIcon
        color="secondary"
        className="icon-card-details"
      />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
];

const menu = [
  {
    desc: "Dashboard",
    icon: <DashboardOutlinedIcon />,
    path: "/",
    permission: ["dashboard"],
    children: [],
  },
  {
    desc: "User Management",
    icon: <SupervisorAccountOutlinedIcon />,
    path: "/account",
    permission: ["role", "user"],
    children: [
      {
        desc: "Role Management",
        icon: <SettingsAccessibilityIcon />,
        path: "/account/roles",
        permission: ["role"],
      },
      {
        desc: "User Accounts",
        icon: <ManageAccountsOutlinedIcon />,
        path: "/account/users",
        permission: ["user"],
      },
    ],
  },
  {
    desc: "Masterlist",
    icon: <ListAltOutlinedIcon />,
    path: "/masterlist",
    permission: ["company", "location", "department", "ap"],
    children: [
      {
        desc: "Company",
        icon: <EmojiTransportationOutlinedIcon />,
        path: "/masterlist/company",
        permission: ["company"],
      },
      {
        desc: "Department",
        icon: <Diversity2OutlinedIcon />,
        path: "/masterlist/department",
        permission: ["department"],
      },
      {
        desc: "Location",
        icon: <ShareLocationOutlinedIcon />,
        path: "/masterlist/location",
        permission: ["location"],
      },
      {
        desc: "Accounts Payable",
        icon: <MonetizationOnOutlinedIcon />,
        path: "/masterlist/ap",
        permission: ["ap"],
      },
    ],
  },
];

const routes = [
  {
    path: "/account",
    name: "User Management",
    children: [
      {
        path: "/account/roles",
        name: "Role Management",
      },
      {
        path: "/account/users",
        name: "User Accounts",
      },
    ],
  },
  {
    path: "/masterlist",
    name: "Masterlist",
    children: [
      {
        path: "/masterlist/company",
        name: "Company",
      },
      {
        path: "/masterlist/department",
        name: "Department",
      },
      {
        path: "/masterlist/location",
        name: "Location",
      },
      {
        path: "/masterlist/ap",
        name: "Accounts Payable",
      },
    ],
  },
];

export { user, masterlist, menu, routes };

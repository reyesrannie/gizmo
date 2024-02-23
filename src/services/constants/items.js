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
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import PowerInputOutlinedIcon from "@mui/icons-material/PowerInputOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

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
  {
    path: "/masterlist/supplier",
    desc: "A module for managing Suppliers .",
    name: "Supplier",
    permission: ["supplier"],
    firstIcon: (
      <PrecisionManufacturingOutlinedIcon
        color="secondary"
        className="icon-card-details"
      />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/masterlist/vat",
    desc: "A module for managing value added Tax .",
    name: "VAT",
    permission: ["vat"],
    firstIcon: (
      <InventoryOutlinedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/masterlist/atc",
    desc: "A module for managing ATC .",
    name: "ATC",
    permission: ["atc"],
    firstIcon: (
      <HubOutlinedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/masterlist/suppliertype",
    desc: "A module for managing Supplier Type .",
    name: "Supplier Type",
    permission: ["s-type"],
    firstIcon: (
      <PowerInputOutlinedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
];

const tagging = [
  {
    path: "/tagging/tagtransact",
    desc: "Tagging of transaction to appropriate Account Payable.",
    name: "Tag Transaction",
    permission: ["tagging"],
    firstIcon: (
      <LocalOfferOutlinedIcon color="secondary" className="icon-card-details" />
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
    permission: [
      "company",
      "location",
      "department",
      "ap",
      "supplier",
      "vat",
      "atc",
      "s-type",
    ],
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
      {
        desc: "Supplier",
        icon: <PrecisionManufacturingOutlinedIcon />,
        path: "/masterlist/supplier",
        permission: ["supplier"],
      },

      {
        desc: "VAT",
        icon: <InventoryOutlinedIcon />,
        path: "/masterlist/vat",
        permission: ["vat"],
      },
      {
        desc: "ATC",
        icon: <HubOutlinedIcon />,
        path: "/masterlist/atc",
        permission: ["atc"],
      },
      {
        desc: "Supplier Type",
        icon: <PowerInputOutlinedIcon />,
        path: "/masterlist/suppliertype",
        permission: ["s-type"],
      },
    ],
  },
  {
    desc: "Tagging",
    icon: <StyleOutlinedIcon />,
    path: "/tagging",
    permission: ["tagging"],
    children: [
      {
        desc: "Tag Transaction",
        icon: <LocalOfferOutlinedIcon />,
        path: "/tagging/tagtransact",
        permission: ["tagging"],
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
      {
        path: "/masterlist/vat",
        name: "VAT",
      },
      {
        path: "/masterlist/supplier",
        name: "Supplier",
      },
      {
        path: "/masterlist/atc",
        name: "ATC",
      },
      {
        path: "/masterlist/suppliertype",
        name: "Supplier Type",
      },
    ],
  },
  {
    path: "/tagging",
    name: "Tagging",
    children: [
      {
        path: "/tagging/transaction",
        name: "Tag Transaction",
      },
    ],
  },
];

export { user, masterlist, tagging, menu, routes };

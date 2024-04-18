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
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import DonutSmallOutlinedIcon from "@mui/icons-material/DonutSmallOutlined";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";

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
    name: "AP Allocation",
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
  {
    path: "/masterlist/documenttype",
    desc: "A module for managing Document Type .",
    name: "Document Type",
    permission: ["d-type"],
    firstIcon: (
      <ArticleOutlinedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/masterlist/account-number",
    desc: "A module for managing Account Number .",
    name: "Account Number",
    permission: ["account-number"],
    firstIcon: (
      <AccountCircleOutlinedIcon
        color="secondary"
        className="icon-card-details"
      />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/masterlist/account-titles",
    desc: "A module for managing Account Titles .",
    name: "Account Titles",
    permission: ["account-titles"],
    firstIcon: (
      <DonutSmallOutlinedIcon color="secondary" className="icon-card-details" />
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

const apTransaction = [
  {
    path: "/ap/pending",
    desc: "Pending transaction",
    name: "Pending",
    permission: ["ap_tag"],
    firstIcon: (
      <PointOfSaleOutlinedIcon
        color="secondary"
        className="icon-card-details"
      />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/ap/check",
    desc: "Check Voucher transaction",
    name: "Check Voucher",
    permission: ["ap_tag"],
    firstIcon: (
      <CreditScoreOutlinedIcon
        color="secondary"
        className="icon-card-details"
      />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/ap/journal",
    desc: "Journal Voucher transaction",
    name: "Journal Voucher",
    permission: ["ap_tag"],
    firstIcon: (
      <NewspaperOutlinedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
];
const approver = [
  {
    path: "/approver/approvecheck",
    desc: "Approving of check entries to appropriate Approver.",
    name: "Check Approval",
    permission: ["approver"],
    firstIcon: (
      <PlaylistAddCheckOutlinedIcon
        color="secondary"
        className="icon-card-details"
      />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/approver/approvejournal",
    desc: "Approving of journal entries to appropriate Approver.",
    name: "Journal Approval",
    permission: ["approver"],
    firstIcon: (
      <TaskOutlinedIcon color="secondary" className="icon-card-details" />
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
      "d-type",
      "account-number",
      "account-titles",
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
        desc: "AP Allocation",
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
      {
        desc: "Document Type",
        icon: <ArticleOutlinedIcon />,
        path: "/masterlist/documenttype",
        permission: ["d-type"],
      },
      {
        desc: "Account Number",
        icon: <AccountCircleOutlinedIcon />,
        path: "/masterlist/account-number",
        permission: ["account-number"],
      },
      {
        desc: "Account Titles",
        icon: <DonutSmallOutlinedIcon />,
        path: "/masterlist/account-number",
        permission: ["account-titles"],
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

  {
    desc: "Accounts Payable",
    icon: <PointOfSaleOutlinedIcon />,
    path: "/ap",
    permission: ["ap_tag"],
    children: [
      {
        desc: "Pending",
        icon: <LocalOfferOutlinedIcon />,
        path: "/ap/pending",
        permission: ["ap_tag"],
      },
      {
        desc: "Check Voucher",
        icon: <CreditScoreOutlinedIcon />,
        path: "/ap/check",
        permission: ["ap_tag"],
      },
      {
        desc: "Journal Voucher",
        icon: <NewspaperOutlinedIcon />,
        path: "/ap/journal",
        permission: ["ap_tag"],
      },
    ],
  },
  {
    desc: "Approver",
    icon: <FactCheckOutlinedIcon />,
    path: "/approver",
    permission: ["approver"],
    children: [
      {
        desc: "Check Approval",
        icon: <PlaylistAddCheckOutlinedIcon />,
        path: "/approver/approvecheck",
        permission: ["approver"],
      },
      {
        desc: "Journal Approval",
        icon: <TaskOutlinedIcon />,
        path: "/approver/approvejournal",
        permission: ["approver"],
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
        name: "AP Allocation",
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
      {
        path: "/masterlist/documenttype",
        name: "Document Type",
      },
      {
        path: "/masterlist/account-number",
        name: "Account Number",
      },
      {
        path: "/masterlist/account-titles",
        name: "Account Titles",
      },
    ],
  },
  {
    path: "/tagging",
    name: "Tagging",
    children: [
      {
        path: "/tagging/tagtransact",
        name: "Tag Transaction",
      },
    ],
  },
  {
    path: "/ap",
    name: "Accounts Payable",
    children: [
      {
        path: "/ap/pending",
        name: "Pending Transaction",
      },
      {
        path: "/ap/check",
        name: "Check Voucher",
      },
      {
        path: "/ap/journal",
        name: "Journal Voucher",
      },
    ],
  },
  {
    path: "/approver",
    name: "Approver",
    children: [
      {
        path: "/approver/approvecheck",
        name: "Check Approval",
      },
      {
        path: "/approver/approvejournal",
        name: "Journal Approval",
      },
    ],
  },
];

export { user, masterlist, tagging, apTransaction, approver, menu, routes };

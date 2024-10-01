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
import MediationOutlinedIcon from "@mui/icons-material/MediationOutlined";
import LockPersonOutlinedIcon from "@mui/icons-material/LockPersonOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import DeviceHubOutlinedIcon from "@mui/icons-material/DeviceHubOutlined";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import CreditScoreRoundedIcon from "@mui/icons-material/CreditScoreRounded";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";

import "../../components/styles/CardNavigation.scss";
import {
  apGJheader,
  apHeader,
  apHistoryHeader,
  approverHeader,
  approverScheduleHeader,
  checkHeader,
  schedAPHeader,
  schedTaggingHeader,
  taggingHeader,
  treasuryHeader,
} from "./headers";
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
    name: "AP Tagging",
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
    desc: "A module for managing VAT Percent .",
    name: "VAT Percent",
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
    path: "/masterlist/titles",
    desc: "A module for managing Account Titles .",
    name: "Titles",
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
    desc: "Voucher's Payable transaction",
    name: "Voucher's Payable",
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
  // {
  //   path: "/ap/journal",
  //   desc: "Journal Voucher transaction",
  //   name: "Journal Voucher",
  //   permission: ["ap_tag"],
  //   firstIcon: (
  //     <NewspaperOutlinedIcon color="secondary" className="icon-card-details" />
  //   ),
  //   lastIcon: (
  //     <NavigationOutlinedIcon className="icon-last" color="secondary" />
  //   ),
  // },
  {
    path: "/ap/general-journal",
    desc: "General Journal transaction",
    name: "General Journal",
    permission: ["ap_tag"],
    firstIcon: (
      <NewspaperOutlinedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/ap/history",
    desc: "History of transaction by year and month",
    name: "History",
    permission: ["ap_tag"],
    firstIcon: (
      <FolderOpenOutlinedIcon color="secondary" className="icon-card-details" />
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
    name: "Voucher Approval",
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
    path: "/approver/general-journal",
    desc: "General Journal transaction",
    name: "General Journal",
    permission: ["approver"],
    firstIcon: (
      <NewspaperOutlinedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  // {
  //   path: "/approver/approvejournal",
  //   desc: "Approving of journal entries to appropriate Approver.",
  //   name: "Journal Approval",
  //   permission: ["approver"],
  //   firstIcon: (
  //     <TaskOutlinedIcon color="secondary" className="icon-card-details" />
  //   ),
  //   lastIcon: (
  //     <NavigationOutlinedIcon className="icon-last" color="secondary" />
  //   ),
  // },
];

const treasury = [
  {
    path: "/treasury/check",
    desc: "Preparation of Check to clearing of check process",
    name: "Check Voucher",
    permission: ["preparation", "releasing", "clearing", "check_approval"],
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
    path: "/treasury/checknumber",
    desc: "Checks status",
    name: "Check Number",
    permission: ["preparation", "releasing", "clearing"],
    firstIcon: (
      <CreditScoreRoundedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/treasury/debit-memo",
    desc: "Debit memo list",
    name: "Debit Memo",
    permission: ["preparation", "releasing", "clearing"],
    firstIcon: (
      <SummarizeOutlinedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/treasury/offset",
    desc: "Masterlist of Checks available",
    name: "Offset list",
    permission: ["preparation", "releasing", "clearing"],
    firstIcon: (
      <LocalOfferOutlinedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
];

const schedule = [
  {
    path: "/sched_transact/request",
    desc: "Request Schedule Transaction",
    name: "Request Schedule",
    permission: ["sched_transact_requestor"],
    firstIcon: (
      <LocalOfferOutlinedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/sched_transact/ap",
    desc: "AP Scheduled Transaction",
    name: "AP Schedule",
    permission: ["sched_transact_ap"],
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
    path: "/sched_transact/approve",
    desc: "Approve Schedule Transaction",
    name: "Approve Schedule",
    permission: ["sched_transact_approver"],
    firstIcon: (
      <NewspaperOutlinedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
];

const report = [
  {
    path: "/report/transaction",
    desc: "Reports that is sorted by per transaction",
    name: "Transaction",
    permission: ["report"],
    firstIcon: (
      <ReceiptLongOutlinedIcon
        color="secondary"
        className="icon-card-details"
      />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/report/atc",
    desc: "Reports that is sorted by per ATC",
    name: "ATC",
    permission: ["report"],
    firstIcon: (
      <DeviceHubOutlinedIcon color="secondary" className="icon-card-details" />
    ),
    lastIcon: (
      <NavigationOutlinedIcon className="icon-last" color="secondary" />
    ),
  },
  {
    path: "/report/supplier",
    desc: "Reports that is sorted by per supplier",
    name: "Supplier",
    permission: ["report"],
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
        desc: "AP Tagging",
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
        desc: "VAT Percent",
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
        path: "/masterlist/titles",
        permission: ["account-titles"],
        child: [
          {
            permission: "account-titles",
            desc: "Great Grandparent",
            icon: <MediationOutlinedIcon />,
          },
          {
            permission: "account-titles",
            desc: "Grandparent",
            icon: <MediationOutlinedIcon />,
          },
          {
            permission: "account-titles",
            desc: "Parent",
            icon: <MediationOutlinedIcon />,
          },
          {
            permission: "account-titles",
            desc: "Child",
            icon: <MediationOutlinedIcon />,
          },
          {
            permission: "account-titles",
            desc: "Grandchild",
            icon: <MediationOutlinedIcon />,
          },
        ],
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
        child: taggingHeader?.map((item) => {
          return {
            permission: item?.permission,
            desc: item?.name,
            icon: <MediationOutlinedIcon />,
          };
        }),
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
        desc: "Voucher's Payable",
        icon: <CreditScoreOutlinedIcon />,
        path: "/ap/check",
        permission: ["ap_tag"],
        child: apHeader?.map((item) => {
          return {
            permission: item?.permission,
            desc: item?.name,
            icon: <MediationOutlinedIcon />,
          };
        }),
      },
      // {
      //   desc: "Journal Voucher",
      //   icon: <NewspaperOutlinedIcon />,
      //   path: "/ap/journal",
      //   permission: ["ap_tag"],
      //   child: apHeader?.map((item) => {
      //     return {
      //       permission: item?.permission,
      //       desc: item?.name,
      //       icon: <MediationOutlinedIcon />,
      //     };
      //   }),
      // },
      {
        desc: "General Journal",
        icon: <NewspaperOutlinedIcon />,
        path: "/ap/general-journal",
        permission: ["ap_tag"],
        child: apGJheader?.map((item) => {
          return {
            permission: item?.permission,
            desc: item?.name,
            icon: <MediationOutlinedIcon />,
          };
        }),
      },
      {
        desc: "History",
        icon: <FolderOpenOutlinedIcon />,
        path: "/ap/history",
        permission: ["ap_tag"],
        child: apHistoryHeader?.map((item) => {
          return {
            permission: item?.permission,
            desc: item?.name,
            icon: <MediationOutlinedIcon />,
          };
        }),
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
        desc: "Voucher Approval",
        icon: <PlaylistAddCheckOutlinedIcon />,
        path: "/approver/approvecheck",
        permission: ["approver"],
        child: approverHeader?.map((item) => {
          return {
            permission: item?.permission,
            desc: item?.name,
            icon: <MediationOutlinedIcon />,
          };
        }),
      },
      {
        desc: "General Journal",
        icon: <NewspaperOutlinedIcon />,
        path: "/ap/general-journal",
        permission: ["approver"],
        child: apGJheader?.map((item) => {
          return {
            permission: item?.permission,
            desc: item?.name,
            icon: <MediationOutlinedIcon />,
          };
        }),
      },
      // {
      //   desc: "Journal Approval",
      //   icon: <TaskOutlinedIcon />,
      //   path: "/approver/approvejournal",
      //   permission: ["approver"],
      //   child: approverHeader?.map((item) => {
      //     return {
      //       permission: item?.permission,
      //       desc: item?.name,
      //       icon: <MediationOutlinedIcon />,
      //     };
      //   }),
      // },
    ],
  },
  {
    desc: "Treasury",
    icon: <AccountBalanceRoundedIcon />,
    path: "/treasury",
    permission: ["preparation", "releasing", "clearing", "check_approval"],
    children: [
      {
        desc: "Check Voucher",
        icon: <PlaylistAddCheckOutlinedIcon />,
        path: "/treasury/check",
        permission: ["preparation", "releasing", "clearing", "check_approval"],
        child: treasuryHeader?.map((item) => {
          return {
            permission: item?.permission,
            desc: item?.name,
            icon: <MediationOutlinedIcon />,
          };
        }),
      },
      {
        desc: "Check Number",
        icon: <CreditScoreRoundedIcon />,
        path: "/treasury/checknumber",
        permission: ["preparation", "releasing", "clearing"],
      },
      {
        desc: "Debit Memo",
        icon: <SummarizeOutlinedIcon />,
        path: "/treasury/debit-memo",
        permission: ["preparation", "releasing", "clearing"],
      },
      {
        desc: "Offset",
        icon: <LocalOfferOutlinedIcon />,
        path: "/treasury/offset",
        permission: ["preparation", "releasing", "clearing"],
      },
    ],
  },

  {
    desc: "Scheduled",
    icon: <PendingActionsOutlinedIcon />,
    path: "/sched_transact",
    permission: [
      "sched_transact_requestor",
      "sched_transact_ap",
      "sched_transact_approver",
    ],
    children: [
      {
        desc: "Request Schedule",
        icon: <LocalOfferOutlinedIcon />,
        permission: ["sched_transact_requestor"],
        path: "/sched_transact/request",
        child: schedTaggingHeader?.map((item) => {
          return {
            permission: "sched_transact_requestor",
            desc: item?.name,
            icon: <MediationOutlinedIcon />,
          };
        }),
      },
      {
        desc: "AP Schedule",
        icon: <CreditScoreOutlinedIcon />,
        permission: ["sched_transact_ap"],
        path: "/sched_transact/ap",
        child: schedAPHeader?.map((item) => {
          return {
            permission: "sched_transact_ap",
            desc: item?.name,
            icon: <MediationOutlinedIcon />,
          };
        }),
      },
      {
        desc: "Approve Schedule",
        icon: <NewspaperOutlinedIcon />,
        permission: ["sched_transact_approver"],
        path: "/sched_transact/approve",
        child: approverScheduleHeader?.map((item) => {
          return {
            permission: "sched_transact_approver",
            desc: item?.name,
            icon: <MediationOutlinedIcon />,
          };
        }),
      },
    ],
  },
  {
    desc: "Cutoff",
    icon: <LockPersonOutlinedIcon />,
    path: "/cutoff",
    permission: ["cutOff_requestor", "cutOff_approver"],
    children: [],
  },
  {
    desc: "Report",
    icon: <AssessmentOutlinedIcon />,
    path: "/report",
    permission: ["report"],
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
        name: "AP Tagging",
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
        name: "VAT Percent",
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
        path: "/masterlist/titles",
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
        name: "Voucher's Payable",
      },
      // {
      //   path: "/ap/journal",
      //   name: "Journal Voucher",
      // },
      {
        path: "/ap/general-journal",
        name: "General Journal",
      },
      {
        path: "/ap/history",
        name: "History",
      },
    ],
  },
  {
    path: "/approver",
    name: "Approver",
    children: [
      {
        path: "/approver/approvecheck",
        name: "Voucher Approval",
      },

      {
        path: "/approver/general-journal",
        name: "General Journal",
      },
    ],
  },
  {
    path: "/sched_transact",
    name: "Scheduled",
    children: [
      {
        path: "/sched_transact/request",
        name: "Request Schedule",
      },
      {
        path: "/sched_transact/ap",
        name: "AP Schedule",
      },
      {
        path: "/sched_transact/approve",
        name: "Approve Schedule",
      },
    ],
  },
  {
    path: "/report",
    name: "Report",
    children: [
      {
        path: "/report/transaction",
        name: "Transaction",
      },
      {
        path: "/report/atc",
        name: "ATC",
      },
      {
        path: "/report/supplier",
        name: "Supplier",
      },
    ],
  },

  {
    path: "/treasury",
    name: "Treasury",
    children: [
      {
        path: "/treasury/check",
        name: "Check Voucher",
      },
      {
        path: "/treasury/checknumber",
        name: "Check Number",
      },
      {
        path: "/treasury/debit-memo",
        name: "Debit Memo",
      },
      {
        path: "/treasury/offset",
        name: "Offset",
      },
    ],
  },
];

export {
  user,
  masterlist,
  tagging,
  apTransaction,
  approver,
  menu,
  routes,
  schedule,
  report,
  treasury,
};

const taggingHeader = [
  { name: "Pending", status: "pending", permission: "tagging" },
  { name: "Returned", status: "returned", permission: "tagging" },
  { name: "Archived", status: "archived", permission: "tagging" },
  { name: "History", status: "", permission: "tagging" },
];

const apHeader = [
  { name: "Received", status: "For Computation", permission: "ap_tag" },
  { name: "For Approval", status: "For Approval", permission: "ap_tag" },
  { name: "Returned", status: "returned", permission: "ap_tag" },
  { name: "Approved", status: "approved", permission: "ap_tag" },
  { name: "Void", status: "voided", permission: "ap_tag" },
  { name: "Filing", status: "Released", permission: "filing" },
];

const apGJheader = [
  { name: "Pending", status: "For Computation", permission: "ap_tag" },
  { name: "For Approval", status: "For Approval", permission: "ap_tag" },
  { name: "Returned", status: "returned", permission: "ap_tag" },
  { name: "Approved", status: "approved", permission: "ap_tag" },
  { name: "Void", status: "voided", permission: "ap_tag" },
];

const apHistoryHeader = [
  { name: "Voucher's Payable", status: "", permission: "ap_tag" },
  { name: "General Journal", status: "", permission: "ap_tag" },
];

const approverHeader = [
  { name: "Approval", status: "For Approval", permission: "approver" },
  { name: "Returned", status: "returned", permission: "approver" },
  { name: "Void", status: "voided", permission: "approver" },
  { name: "Pending Void", status: "For Voiding", permission: "approver" },
  { name: "History", status: "", permission: "approver" },
];

const approverGJHeader = [
  { name: "Approval", status: "For Approval", permission: "approver" },
  { name: "Returned", status: "returned", permission: "approver" },
  { name: "Void", status: "voided", permission: "approver" },
  { name: "Pending Void", status: "For Voiding", permission: "approver" },
];

const treasuryHeader = [
  { name: "Preparation", status: "For Preparation", permission: "preparation" },
  // {
  //   name: "For Approval",
  //   status: "Check Approval",
  //   permission: ["releasing", "check_approval"],
  // },
  { name: "For Releasing", status: "For Releasing", permission: "releasing" },
  { name: "Clearing", status: "Released", permission: "clearing" },
];

const checkHeader = [
  { name: "Available", status: "Available" },
  { name: "Released", status: "Released" },
  { name: "Cleared", status: "Cleared" },
  { name: "Cancelled", status: "Cancelled" },
];

const coaHeader = [
  { name: "Account Titles" },
  { name: "Great Grandparent" },
  { name: "Grandparent" },
  { name: "Parent" },
  { name: "Child" },
  { name: "Grandchild" },
];

const schedTaggingHeader = [
  { name: "Pending", status: "pending" },
  { name: "History", status: "" },
];

const schedAPHeader = [
  { name: "Pending", status: "pending" },
  { name: "Received", status: "For Computation" },
  { name: "For Approval", status: "For Approval" },
  { name: "Returned", status: "returned" },
  { name: "Approved", status: "approved" },
  { name: "History", status: "" },
];

const approverScheduleHeader = [
  { name: "For Approval", status: "For Approval" },
  { name: "Returned", status: "returned" },
  { name: "History", status: "" },
];

const columnTotal = ["M", "N", "O", "Q", "R"];
const titleFirstHeader = [
  "",
  "expanded",
  "expanded",
  "expanded",
  "vat & ITR",
  "vat & ITR",
  "vat & ITR",
  "vat & ITR",
  "vat & ITR",
  "",
  "",
  "expanded",
  "",
];
const titleHeader = [
  {
    min: 20,
    name: "Source",
  },
  {
    min: 20,
    name: "TIN NUMBER",
  },
  {
    min: 50,
    name: "PAYEE",
  },
  {
    min: 60,
    name: "ADDRESS",
  },
  {
    min: 20,
    name: "SUB-TITLE",
  },
  {
    min: 20,
    name: "D E S C R I P T I O N S",
  },
  {
    min: 20,
    name: "INV. NUMBER",
  },
  {
    min: 20,
    name: "DATE INVOICE",
  },
  {
    min: 20,
    name: "LOCATION",
  },
  {
    min: 20,
    name: "TAG NUMBER",
  },
  {
    min: 20,
    name: "VOUCHER NUMBER",
  },
  {
    min: 20,
    name: "ATC CODE",
  },
  {
    min: 20,
    name: "AMOUNT",
  },
  {
    min: 20,
    name: "TAX BASE",
  },
  {
    min: 20,
    name: "EXPANDED W/TAX",
  },
  {
    min: 20,
    name: "TAX RATES",
  },
  {
    min: 20,
    name: "AMOUNT",
  },
  {
    min: 20,
    name: "W/TAX",
  },
];

const footer = [
  "Total",
  ".",
  ".",
  ".",
  ".",
  ".",
  ".",
  ".",
  ".",
  ".",
  ".",
  ".",
  "SUM",
  "SUM",
  "SUM",
  ".",
  "SUM",
  "SUM",
];

const footerAtc = ["Total", "SUM", "SUM", ".", "."];

const titleHeaderATC = [
  {
    min: 20,
    name: "ATC",
  },
  {
    min: 20,
    name: "TAX BASE",
  },
  {
    min: 20,
    name: "W/TAX",
  },
  {
    min: 20,
    name: "",
  },
  {
    min: 20,
    name: "",
  },
];

const debitType = [
  { name: "Debit Memo", value: "dm" },
  { name: "Credit Memo", value: "cm" },
  { name: "Manager's Check", value: "mc" },
  { name: "Telegraphic", value: "telegraphic" },
];

const apDash = [
  {
    name: "Pending",
    status: "pending",
    permission: "ap_tag",
    path: "/ap/pending",
  },
  {
    name: "Received",
    status: "For Computation",
    permission: "ap_tag",
    path: "/ap/check",
  },

  {
    name: "Returned",
    status: "returned",
    permission: "ap_tag",
    path: "/ap/check",
  },
  {
    name: "Approved",
    status: "approved",
    permission: "ap_tag",
    path: "/ap/check",
  },
  { name: "Void", status: "voided", permission: "ap_tag", path: "/ap/check" },
  {
    name: "Filing",
    status: "Released",
    permission: "filing",
    path: "/ap/check",
  },
];

const approverDash = [
  {
    name: "Approval",
    status: "For Approval",
    permission: "approver",
    path: "/approver/approvecheck",
  },
  {
    name: "Pending Void",
    status: "For Voiding",
    permission: "approver",
    path: "/approver/approvecheck",
  },
];

export {
  titleFirstHeader,
  titleHeader,
  taggingHeader,
  apHeader,
  apHistoryHeader,
  approverHeader,
  coaHeader,
  schedTaggingHeader,
  schedAPHeader,
  approverScheduleHeader,
  columnTotal,
  footer,
  titleHeaderATC,
  footerAtc,
  treasuryHeader,
  checkHeader,
  apGJheader,
  approverGJHeader,
  debitType,
  apDash,
  approverDash,
};

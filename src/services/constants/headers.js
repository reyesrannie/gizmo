const taggingHeader = [
  { name: "Tag Transaction", status: "pending" },
  { name: "Returned", status: "returned" },
  { name: "Archived", status: "archived" },
  { name: "History", status: "" },
];

const apHeader = [
  { name: "Received", status: "For Computation" },
  { name: "For Approval", status: "For Approval" },
  { name: "Returned", status: "returned" },
  { name: "Approved", status: "approved" },
  { name: "Void", status: "voided" },
  { name: "History", status: "" },
];

const approverHeader = [
  { name: "For Approval", status: "For Approval" },
  { name: "Returned", status: "returned" },
  { name: "Void", status: "voided" },
  { name: "Pending Void", status: "For Voiding" },
  { name: "History", status: "" },
];

const treasuryHeader = [
  { name: "Preparation", status: "For Approval" },
  { name: "Releasing", status: "returned" },
  { name: "Clearing", status: "voided" },
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

export {
  titleFirstHeader,
  titleHeader,
  taggingHeader,
  apHeader,
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
};

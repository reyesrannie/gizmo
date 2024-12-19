import {
  generateExcelReport,
  generateExcelReportPerATC,
  generateExcelReportPerSup,
} from "../functions/exportFile";

export const reportOptions = [
  { name: "Transaction", function: generateExcelReport },
  { name: "Atc", function: generateExcelReportPerATC },
  { name: "Supplier", function: generateExcelReportPerSup },
];

export const reports = [
  { name: "Transaction", value: "expanded" },
  { name: "Atc", value: "expanded-atc" },
  { name: "Supplier", value: "expanded-supplier" },
  { name: "Vat", value: "vat" },
  { name: "Disbursement", value: "disbursement" },
];

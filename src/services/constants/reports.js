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

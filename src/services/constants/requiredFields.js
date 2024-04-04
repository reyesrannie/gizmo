export const requiredFields = [
  {
    id: 1,
    name: "amount_withheld",
    type: "number",
    label: "Amount Withheld",
  },
  {
    id: 2,
    name: "amount_check",
    type: "number",
    label: "Amount of Check",
  },
  {
    id: 3,
    name: "vat",
    type: "string",
    label: "VAT",
  },
  {
    id: 4,
    name: "cost",
    type: "string",
    label: "Cost",
  },
  {
    id: 5,
    name: "store",
    type: "string",
    label: "Store",
  },
  {
    id: 6,
    name: "coverage",
    type: "string",
    label: "Coverage",
  },
  {
    id: 7,
    name: "account_number",
    type: "string",
    label: "Account_number",
  },
  {
    id: 8,
    name: "invoice_no",
    type: "string",
    label: "Invoice Number",
  },
];

export const supplierTypeReqFields = [
  {
    id: 1,
    name: "vat_local",
    type: "number",
    label: "Vat Local",
    divide: 1.12,
    vit: 0.12,
  },
  {
    id: 2,
    name: "vat_service",
    type: "number",
    label: "Vat Service",
    divide: 1.12,
    vit: 0.12,
  },
  {
    id: 3,
    name: "nvat_local",
    type: "number",
    label: "NON-VAT Local",
    divide: 1,
    vit: 0,
  },
  {
    id: 4,
    name: "nvat_service",
    type: "string",
    label: "NON-VAT Service",
    divide: 1,
    vit: 0,
  },
];

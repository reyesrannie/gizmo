export const transactionDefaultValue = () => {
  const defaultValues = {
    type: "",
    tag_no: "",
    is_offset: false,
    description: "",
    supplier: "",
    proprietor: "",
    company_address: "",
    name_in_receipt: "",
    invoice_no: "",
    reference_no: "",
    amount_withheld: "",
    amount_check: "",
    amount: "",
    vat: "",
    cost: "",
    g_tag_number: "",
    supplier_type_id: "",
    atc_id: "",
    ap: null,
    tin: null,
    date_invoice: null,
    tag_month_year: null,
    document_type: null,
    account_number: null,
    store: null,
    coverage_from: null,
    coverage_to: null,
    addedDocuments: null,
    month_total: "",
    month_amount: "",
    EB: "",
    PRM: "",
    BS: "",
    SOA: "",
    LIQUIDATION: "",
    PI: "",
    INV: "",
    SI: "",
    "CASH SALES INV": "",
    "CASH INV": "",
    CI: "",
    CSI: "",
    BI: "",
    "SERVICE INV": "",
    SB: "",
    DR: "",
    OR: "",
    PAD: "",
    AR: "",
    BILLING: "",
    JO: "",
    WB: "",
    "SUMMARY BILLING": "",
  };

  return defaultValues;
};

export const clearValue = () => {
  const defaultValues = {
    supplier: "",
    proprietor: "",
    company_address: "",
    name_in_receipt: "",
    invoice_no: "",
    ref_no: "",
    amount_withheld: "",
    amount_check: "",
    amount: "",
    vat: "",
    cost: "",
    supplier_type_id: "",
    atc_id: "",
    document_type: null,
    account_number: null,
    store: null,
    coverage_from: null,
    coverage_to: null,
    is_offset: false,
  };
  return defaultValues;
};

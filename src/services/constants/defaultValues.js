export const transactionDefaultValue = () => {
  const defaultValues = {
    is_offset: false,
    description: "",
    supplier: "",
    proprietor: "",
    company_address: "",
    name_in_receipt: "",
    invoice_no: "",
    ref_no: "",
    delivery_invoice: "",
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

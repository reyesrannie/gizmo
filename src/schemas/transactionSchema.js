import * as Yup from "yup";

const transactionSchema = Yup.object({
  ap: Yup.object().required("AP number required").typeError("AP is required"),
  tag_no: Yup.string().nullable(),
  tin: Yup.object().required("TIN is required"),
  name_in_receipt: Yup.string().required("Name is required"),
  proprietor: Yup.string().nullable(),
  description: Yup.string(),
  document_type: Yup.object().required("Document type is required"),
  supplier_type_id: Yup.string().nullable(),
  atc_id: Yup.string().nullable(),
  ref_no: Yup.string().nullable(),
  company_address: Yup.string().required("Supplier address is required"),
  g_tag_number: Yup.string().nullable(),
  delivery_invoice: Yup.string().nullable(),
  amount: Yup.string().required("Amount is required"),
  amount_withheld: Yup.string().nullable(),
  amount_check: Yup.string().nullable(),
  invoice_no: Yup.string().required("Invoice No is required"),
  vat: Yup.string().nullable(),
  cost: Yup.string().nullable(),
  store: Yup.object().nullable(),
  account_number: Yup.object().nullable(),
  coverage_from: Yup.date().nullable(),
  coverage_to: Yup.date().nullable(),
  date_invoice: Yup.date()
    .typeError("Date invoice is required")
    .required("Date invoice is required"),
  tag_month_year: Yup.date()
    .typeError("Tag year month is required")
    .required("Tag year month is required"),
});

export default transactionSchema;

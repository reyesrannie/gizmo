import * as Yup from "yup";

const apTransactionSchema = Yup.object({
  tag_no: Yup.string().required("Tag number is required"),
  tin: Yup.object().required("TIN is required"),
  proprietor: Yup.string().nullable(),
  description: Yup.string(),
  document_type: Yup.object().required("Document type is required"),
  company_address: Yup.string().required("Supplier address is required"),
  amount: Yup.string().required("Amount is required"),
  supplier_type: Yup.string().required("Supplier type is required"),
  invoice_no: Yup.string().required("Amount of check is required"),
  vat_local: Yup.string().required("Vat local is required"),
  vat_service: Yup.string().required("Vat service is required"),
  nvat_local: Yup.string().required("Non-Vat local is required"),
  nvat_service: Yup.string().required("Non-Vat service is required"),
  vat_input_tax: Yup.string().required("Vat input tax is required"),
  wtax_payable_cr: Yup.string().required("Wtax payable tax is required"),

  date_invoice: Yup.date()
    .typeError("Date invoice is required")
    .required("Date invoice is required"),
  date_recieved: Yup.date()
    .typeError("Date receive is required")
    .required("Date receive is required"),
});

export default apTransactionSchema;

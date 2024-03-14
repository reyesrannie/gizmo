import * as Yup from "yup";

const apTransactionSchema = Yup.object({
  tag_no: Yup.string().required("Tag number is required"),
  tin: Yup.object().required("TIN is required"),
  proprietor: Yup.string().nullable(),
  description: Yup.string(),

  company_address: Yup.string().required("Supplier address is required"),
  amount: Yup.string().required("Amount is required"),
  invoice_no: Yup.string().required("Invoice number is required"),
  location_id: Yup.object()
    .typeError("Location is required")
    .required("Location is required")
    .typeError("Location is required"),
  atc_id: Yup.object()
    .typeError("Location is required")
    .required("Location is required")
    .typeError("Location is required"),
  date_invoice: Yup.date()
    .typeError("Date invoice is required")
    .required("Date invoice is required"),
});

export default apTransactionSchema;

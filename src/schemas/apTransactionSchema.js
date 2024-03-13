import * as Yup from "yup";

const apTransactionSchema = Yup.object({
  tag_no: Yup.string().required("Tag number is required"),
  tin: Yup.object().required("TIN is required"),
  proprietor: Yup.string().nullable(),
  description: Yup.string(),

  company_address: Yup.string().required("Supplier address is required"),
  amount: Yup.string().required("Amount is required"),
  supplier_type: Yup.string().required("Supplier type is required"),
  invoice_no: Yup.string().required("Amount of check is required"),
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
  date_recieved: Yup.date()
    .typeError("Date receive is required")
    .required("Date receive is required"),
});

export default apTransactionSchema;

import * as Yup from "yup";

const scheduleTransactionAPSchema = Yup.object({
  tin: Yup.object().required("TIN is required"),
  proprietor: Yup.string().nullable(),
  description: Yup.string().nullable(),
  cip_no: Yup.string().nullable(),
  voucherType: Yup.string().nullable(),
  company_address: Yup.string().required("Supplier address is required"),
  amount: Yup.string().required("Amount is required"),
  invoice_no: Yup.string().required("Invoice number is required"),
  location_id: Yup.object()
    .typeError("Location is required")
    .required("Location is required")
    .typeError("Location is required"),
  atc_id: Yup.object().typeError("ATC is required").required("ATC is required"),
});

export default scheduleTransactionAPSchema;

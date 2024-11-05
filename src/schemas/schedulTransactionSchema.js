import * as Yup from "yup";

const schedulTransactionSchema = Yup.object({
  ap: Yup.object().required("AP number required").typeError("AP is required"),
  tin: Yup.object().required("TIN is required"),
  name_in_receipt: Yup.string().required("Name is required"),
  proprietor: Yup.string().nullable(),
  description: Yup.string(),
  document_type: Yup.object().required("Document type is required"),
  supplier_type_id: Yup.string().nullable(),
  atc_id: Yup.string().nullable(),
  company_address: Yup.string().required("Supplier address is required"),
  g_tag_number: Yup.string().nullable(),
  delivery_invoice: Yup.string().nullable(),
  amount: Yup.string().required("Amount is required"),
  amount_withheld: Yup.string().nullable(),
  amount_check: Yup.string().nullable(),
  invoice_no: Yup.string().required("Invoice No. is required"),
  vat: Yup.string().nullable(),
  cost: Yup.string().nullable(),
  store: Yup.object().nullable(),
  account_number: Yup.object().when("document_type", {
    is: (document_type) =>
      document_type?.required_fields?.includes("account_number"),
    then: () =>
      Yup.object()
        .required("Account number is required")
        .typeError("Account number is required"),
    otherwise: () => Yup.object().nullable(),
  }),
  coverage_from: Yup.date()
    .required("Coverage is required")
    .typeError("Coverage is required"),
  coverage_to: Yup.date()
    .required("Coverage is required")
    .typeError("Coverage is required"),
  start_date: Yup.date()
    .required("Start date is required")
    .typeError("Start date is required"),
  end_date: Yup.date()
    .required("End date is required")
    .typeError("End date is required"),
});

export default schedulTransactionSchema;

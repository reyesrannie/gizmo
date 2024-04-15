import * as Yup from "yup";

const transactionSchema = Yup.object({
  is_offset: Yup.boolean(),
  tag_no: Yup.string().when("is_offset", {
    is: (is_offset) => !is_offset,
    then: () => Yup.string().required("Tag number is required"),
    otherwise: () => Yup.string().nullable(),
  }),

  ap: Yup.object().required("AP number required").typeError("AP is required"),

  tin: Yup.object().required("TIN is required"),
  name_in_receipt: Yup.string().required("Name is required"),
  proprietor: Yup.string().nullable(),
  description: Yup.string(),
  document_type: Yup.object().required("Document type is required"),
  supplier_type_id: Yup.string().nullable(),
  atc_id: Yup.string().nullable(),
  ref_no: Yup.string().nullable(),
  company_address: Yup.string().required("Supplier address is required"),
  g_tag_number: Yup.string().required("Tag Number address is required"),
  delivery_invoice: Yup.string().nullable(),

  amount: Yup.string().required("Amount is required"),
  amount_withheld: Yup.string().nullable(),
  amount_check: Yup.string().nullable(),
  invoice_no: Yup.string().nullable(),
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
  coverage_from: Yup.date().when("document_type", {
    is: (document_type) => document_type?.required_fields?.includes("coverage"),
    then: () =>
      Yup.date()
        .required("Coverage is required")
        .typeError("Coverage is required"),
    otherwise: () => Yup.date().nullable(),
  }),
  coverage_to: Yup.date().when("document_type", {
    is: (document_type) => document_type?.required_fields?.includes("coverage"),
    then: () =>
      Yup.date()
        .required("Coverage is required")
        .typeError("Coverage is required"),
    otherwise: () => Yup.date().nullable(),
  }),
  date_invoice: Yup.date()
    .typeError("Date invoice is required")
    .required("Date invoice is required"),
  date_recieved: Yup.date()
    .typeError("Date receive is required")
    .required("Date receive is required"),
  tag_month_year: Yup.date()
    .typeError("Tag year month is required")
    .required("Tag year month is required"),
});

export default transactionSchema;

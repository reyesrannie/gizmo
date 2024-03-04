import * as Yup from "yup";

const transactionSchema = Yup.object({
  tag_no: Yup.string().required("Tag number is required"),
  tin: Yup.object().required("TIN is required"),
  name_in_receipt: Yup.string().required("Name is required"),
  proprietor: Yup.string().nullable(),
  document_type: Yup.object().required("Document type is required"),
  ref_no: Yup.string().when("document_type", {
    is: (document_type) => document_type?.required_fields?.includes("ref_no"),
    then: () => Yup.string().required("Ref number is required"),
  }),
  company_address: Yup.string().required("Supplier address is required"),
  g_tag_number: Yup.string().required("Tag Number address is required"),
  delivery_invoice: Yup.string().when("document_type", {
    is: (document_type) =>
      document_type?.required_fields?.includes("delivery_invoice"),
    then: () => Yup.string().required("Delivery Invoice is required"),
  }),
  sales_invoice: Yup.string().when("document_type", {
    is: (document_type) =>
      document_type?.required_fields?.includes("sales_invoice"),
    then: () => Yup.string().required("Sales Invoice is required"),
  }),
  charge_invoice: Yup.string().when("document_type", {
    is: (document_type) =>
      document_type?.required_fields?.includes("charge_invoice"),
    then: () => Yup.string().required("Charge Invoice is required"),
  }),
  amount: Yup.string().required("Amount is required"),
  amount_withheld: Yup.string().when("document_type", {
    is: (document_type) =>
      document_type?.required_fields?.includes("amount_withheld"),
    then: () => Yup.string().required("Amount Withheld is required"),
  }),
  amount_check: Yup.string().when("document_type", {
    is: (document_type) =>
      document_type?.required_fields?.includes("amount_check"),
    then: () => Yup.string().required("Amount of check is required"),
  }),
  vat: Yup.string().when("document_type", {
    is: (document_type) => document_type?.required_fields?.includes("vat"),
    then: () => Yup.string().required("Vat is required"),
  }),
  cost: Yup.string().when("document_type", {
    is: (document_type) => document_type?.required_fields?.includes("cost"),
    then: () => Yup.string().required("Cost is required"),
  }),
  store: Yup.object().when("document_type", {
    is: (document_type) => document_type?.required_fields?.includes("store"),
    then: () =>
      Yup.object().required("Store is required").typeError("Store is required"),
    otherwise: () => Yup.object().nullable(),
  }),
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

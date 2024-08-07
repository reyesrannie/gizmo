import * as Yup from "yup";

const taxComputationSchema = Yup.object({
  isTaxBased: Yup.boolean(),
  amount: Yup.string().required("Amount is required"),
  vat_input_tax: Yup.string().required("Vat input tax is required"),
  wtax_payable_cr: Yup.string().required("Wtax payable tax is required"),
  account: Yup.string().required("Amount is required"),

  mode: Yup.string().required("Mode payable tax is required"),
  remarks: Yup.string().nullable(),
  stype_id: Yup.object()
    .typeError("Supplier Type  is required")
    .required("Supplier Type  is required")
    .typeError("Supplier Type  is required"),

  location_id: Yup.object()
    .typeError("Location is required")
    .required("Location is required")
    .typeError("Location is required"),

  vat_local: Yup.string().when("stype_id", {
    is: (stype_id) => stype_id?.required_fields?.includes("vat_local"),
    then: () => Yup.string().required("Vat Local is required"),
  }),
  vat_service: Yup.string().when("stype_id", {
    is: (stype_id) => stype_id?.required_fields?.includes("vat_service"),
    then: () => Yup.string().required("Vat Service is required"),
  }),
  nvat_local: Yup.string().when("stype_id", {
    is: (stype_id) => stype_id?.required_fields?.includes("nvat_local"),
    then: () => Yup.string().required("Non-Vat Local is required"),
  }),
  nvat_service: Yup.string().when("stype_id", {
    is: (stype_id) => stype_id?.required_fields?.includes("nvat_service"),
    then: () => Yup.string().required("Non-Vat Service required"),
  }),

  coa_id: Yup.object()
    .typeError("Account Title is required")
    .required("Account Title is required"),

  atc_id: Yup.object().typeError("ATC is required").required("ATC is required"),
});

export default taxComputationSchema;

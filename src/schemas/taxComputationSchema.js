import * as Yup from "yup";

const taxComputationSchema = Yup.object({
  amount: Yup.string().required("Amount is required"),
  vat_local: Yup.string().required("Vat local is required"),
  vat_service: Yup.string().required("Vat service is required"),
  nvat_local: Yup.string().required("Non-Vat local is required"),
  nvat_service: Yup.string().required("Non-Vat service is required"),
  vat_input_tax: Yup.string().required("Vat input tax is required"),
  wtax_payable_cr: Yup.string().required("Wtax payable tax is required"),

  stype_id: Yup.object()
    .typeError("Supplier Type  is required")
    .required("Supplier Type  is required"),
  coa_id: Yup.object()
    .typeError("Account Title is required")
    .required("Account Title is required"),
});

export default taxComputationSchema;

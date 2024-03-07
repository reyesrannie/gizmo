import * as Yup from "yup";

const accountNumberSchema = Yup.object({
  account_no: Yup.string().required("Code name is required"),
  supplier_id: Yup.object()
    .required("Supplier is required")
    .typeError("Supplier is required"),
  location_id: Yup.object()
    .required("Location is required")
    .typeError("Location is required"),
}).required();

export default accountNumberSchema;

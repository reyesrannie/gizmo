import * as Yup from "yup";

const checkNumberSchema = Yup.object({
  check_no: Yup.string().required("Check number is required"),
  coa_id: Yup.object()
    .required("Bank name is required")
    .typeError("Bank name is required"),
}).required();

export default checkNumberSchema;

import * as Yup from "yup";

const balanceSchema = Yup.object({
  amount: Yup.string().required("Amount number is required"),
  bank_id: Yup.object()
    .required("Bank name is required")
    .typeError("Bank name is required"),
}).required();

export default balanceSchema;

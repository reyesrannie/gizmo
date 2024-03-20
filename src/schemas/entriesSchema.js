import * as Yup from "yup";

const entriesSchema = Yup.object({
  voucher: Yup.string().required("Voucher is required"),
  amount: Yup.string().required("Amount name is required"),
}).required();

export default entriesSchema;

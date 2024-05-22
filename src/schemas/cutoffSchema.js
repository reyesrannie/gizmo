import * as Yup from "yup";

const cutoffSchema = Yup.object({
  date: Yup.date().required("Date is required"),
}).required();

export default cutoffSchema;

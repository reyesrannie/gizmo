import * as Yup from "yup";

const supplierTypeSchema = Yup.object({
  code: Yup.string().required("Code name is required"),
  wtax: Yup.string().required("W-Tax name is required"),
}).required();

export default supplierTypeSchema;

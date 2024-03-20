import * as Yup from "yup";

const apSchema = Yup.object({
  company_code: Yup.string().required("Name name is required"),
  description: Yup.string().required("Code name is required"),
  vp: Yup.string().required("Allocation code is required"),
}).required();

export default apSchema;

import * as Yup from "yup";

const companySchema = Yup.object({
  name: Yup.string().required("Name name is required"),
  code: Yup.string().required("Code name is required"),
}).required();

export default companySchema;

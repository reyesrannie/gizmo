import * as Yup from "yup";

const vatSchema = Yup.object({
  name: Yup.string().required("Name name is required"),
  code: Yup.string().required("Code name is required"),
}).required();

export default vatSchema;

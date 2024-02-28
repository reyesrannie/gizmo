import * as Yup from "yup";

const documentTypeSchema = Yup.object({
  code: Yup.string().required("Code name is required"),
  name: Yup.string().required("Name is required"),
  required_fields: Yup.array()
    .typeError("Fields is required")
    .required("Fields is required"),
}).required();

export default documentTypeSchema;

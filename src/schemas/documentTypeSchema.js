import * as Yup from "yup";

const documentTypeSchema = Yup.object({
  code: Yup.string().required("Code name is required"),
  name: Yup.string().required("Name is required"),
  required_fields: Yup.array()
    .typeError("Field is required")
    .required("Field is required"),
}).required();

export default documentTypeSchema;

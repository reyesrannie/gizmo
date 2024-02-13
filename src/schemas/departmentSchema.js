import * as Yup from "yup";

const departmentSchema = Yup.object({
  name: Yup.string().required("Name name is required"),
  code: Yup.string().required("Code name is required"),
  scope_location: Yup.array()
    .min(1, "Location must have at least 1 item")
    .required("Location is required")
    .typeError("Location is required"),
}).required();

export default departmentSchema;

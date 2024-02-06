import * as Yup from "yup";

const rolesSchema = Yup.object({
  name: Yup.string().required("Role name is required"),
  access_permission: Yup.array()
    .required("Access is required")
    .typeError("Access is required"),
  access: Yup.array()
    .required("Access is required")
    .typeError("Access is required"),
}).required();

export default rolesSchema;

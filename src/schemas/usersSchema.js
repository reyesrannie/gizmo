import * as Yup from "yup";

const usersSchema = Yup.object({
  id_no: Yup.object()
    .required("ID no. is required")
    .typeError("ID no. is required"),
  company: Yup.object()
    .required("Company is required")
    .typeError("Company is required"),
  department: Yup.object()
    .required("Department is required")
    .typeError("Department is required"),
  location: Yup.object()
    .required("Location is required")
    .typeError("Location is required"),
  role_id: Yup.object()
    .required("Role is required")
    .typeError("Role is required"),
  username: Yup.string().required("Username is required"),
  first_name: Yup.string().required("Firstname is required"),
  last_name: Yup.string().required("Lastname is required"),
  middle_name: Yup.string().required("Middle name is required"),
  suffix: Yup.string().nullable(),
  position: Yup.string().required("Position is required"),

  ap_tagging: Yup.object().nullable(),
}).required();

export default usersSchema;

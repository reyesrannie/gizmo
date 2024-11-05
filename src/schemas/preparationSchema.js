import * as Yup from "yup";

const preparationSchema = Yup.object({
  bank: Yup.string().required("This is required"),
  check_no: Yup.string().required("This is required"),
  check_date: Yup.date()
    .required("This is required")
    .typeError("This is required"),
}).required();

export default preparationSchema;

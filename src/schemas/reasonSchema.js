import * as Yup from "yup";

const reasonSchema = Yup.object({
  reason: Yup.string().required("Reason is required"),
  category: Yup.string().nullable(),
}).required();

export default reasonSchema;

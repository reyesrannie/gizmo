import * as Yup from "yup";

const reasonSchema = Yup.object({
  reason: Yup.string().required("Reason is required"),
}).required();

export default reasonSchema;

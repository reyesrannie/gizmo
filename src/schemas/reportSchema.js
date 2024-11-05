import * as Yup from "yup";

const reportSchema = Yup.object({
  report: Yup.object().nullable(),
}).required();

export default reportSchema;

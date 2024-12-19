import * as Yup from "yup";

const reportSchema = Yup.object({
  report_type: Yup.object().nullable(),
}).required();

export default reportSchema;

import * as Yup from "yup";

const dashboardSchema = Yup.object({
  bank_id: Yup.object().nullable(),
});

export default dashboardSchema;

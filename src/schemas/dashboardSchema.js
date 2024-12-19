import * as Yup from "yup";

const dashboardSchema = Yup.object({
  bank_id: Yup.object().nullable(),
  month_from: Yup.date().nullable(),
  to: Yup.date().nullable(),
});

export default dashboardSchema;

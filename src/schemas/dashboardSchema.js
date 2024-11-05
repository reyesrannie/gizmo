import * as Yup from "yup";

const dashboardSchema = Yup.object({
  year: Yup.date().nullable(),
  type: Yup.object().nullable(),
  date: Yup.string().nullable(),
});

export default dashboardSchema;

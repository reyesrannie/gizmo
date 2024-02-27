import * as Yup from "yup";

const dateRangeSchema = Yup.object({
  from: Yup.date().required("Date from is required"),
  to: Yup.date().required("Date to is required"),
}).required();

export default dateRangeSchema;

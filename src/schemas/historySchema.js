import * as Yup from "yup";

const historySchema = Yup.object({
  year: Yup.date().nullable(),
  type: Yup.object().nullable(),
  date: Yup.string().nullable(),
});

export default historySchema;

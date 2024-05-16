import * as Yup from "yup";

const accountTitlesSchema = Yup.object({
  name: Yup.string().required("Name name is required"),
  code: Yup.string().required("Code name is required"),
  ggp: Yup.object().nullable(),
  gp: Yup.object().nullable(),
  p: Yup.object().nullable(),
  c: Yup.object().nullable(),
  gc: Yup.object().nullable(),
}).required();

export default accountTitlesSchema;

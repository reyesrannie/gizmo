import * as Yup from "yup";

const tagSearchSchema = Yup.object({
  year: Yup.date().nullable(),
  tag: Yup.string().nullable(),
});

export default tagSearchSchema;

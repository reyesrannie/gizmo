import * as Yup from "yup";

const bankSchema = Yup.object({
  name: Yup.string().required("Amount number is required"),
  coa_id: Yup.object()
    .required("Account title is required")
    .typeError("Account title is required"),
  account_number: Yup.object().nullable("").typeError(""),
  account_no: Yup.string().nullable(""),
  title: Yup.object().nullable(),
  type: Yup.string().nullable(""),
  bank_title: Yup.string().nullable(""),
  check_no_from: Yup.string().nullable(""),
  check_no_to: Yup.string().nullable(""),
  check_no: Yup.string().nullable(""),
}).required();

export default bankSchema;

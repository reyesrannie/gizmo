import * as Yup from "yup";

const treasurySchema = Yup.object({
  debit_coa_id: Yup.object()
    .required("This entry is required")
    .typeError("This entry is required"),
  credit_coa_id: Yup.object()
    .required("This entry is required")
    .typeError("This entry is required"),
  bank: Yup.object().required("Bank is required").typeError("Bank is required"),
  check_no: Yup.string().required("Check No. is required"),
  check_date: Yup.date().nullable(),

  type: Yup.string().required("Type is required"),
}).required();

export default treasurySchema;

import * as Yup from "yup";

const treasurySchema = Yup.object({
  multiple: Yup.boolean(),
  debit_coa_id: Yup.object()
    .required("This entry is required")
    .typeError("This entry is required"),
  credit_coa_id: Yup.object()
    .required("This entry is required")
    .typeError("This entry is required"),

  bank: Yup.object().when("multiple", {
    is: (multiple) => multiple === false,
    then: () =>
      Yup.object().required("Bank is required").typeError("Bank is required"),
    otherwise: () => Yup.object().nullable("Bank is required"),
  }),
  type: Yup.string().required("Type is required"),

  check_no: Yup.string().when("multiple", {
    is: (multiple) => multiple === false,
    then: () => Yup.string().required("Check No. is required"),
    otherwise: () => Yup.string().nullable(),
  }),
  check_date: Yup.date().nullable(),

  check: Yup.array().when("multiple", {
    is: (multiple) => multiple === true,
    then: () =>
      Yup.array().of(
        Yup.object().shape({
          bank: Yup.object()
            .required("Bank is required")
            .typeError("Bank is required")
            .label("Bank"),
          check_no: Yup.string().required("Check No. is required"),
          amount: Yup.number()
            .required("Amount is required")
            .moreThan(0, "Amount must be greater than 0"),
          check_date: Yup.date().nullable(),
        })
      ),
  }),
}).required();

export default treasurySchema;

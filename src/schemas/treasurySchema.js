import * as Yup from "yup";

const treasurySchema = Yup.object({
  multiple: Yup.boolean(),
  debit_coa_id: Yup.object()
    .required("This entry is required")
    .typeError("This entry is required"),
  credit_coa_id: Yup.object()
    .required("This entry is required")
    .typeError("This entry is required"),

  bank: Yup.string().when("multiple", {
    is: (multiple) => multiple === false,
    then: () =>
      Yup.string().required("Bank is required").typeError("Bank is required"),
    otherwise: () => Yup.string().nullable("Bank is required"),
  }),
  type: Yup.string().required("Type is required"),

  check_no: Yup.object().when(["multiple", "type"], {
    is: (multiple, type) => {
      return !multiple && type === "CHECK VOUCHER";
    },
    then: () => Yup.object().required("Check No. is required"),
    otherwise: () => Yup.object().nullable(),
  }),

  reference_no: Yup.string().when(["multiple", "type"], {
    is: (multiple, type) => multiple === false && type === "DEBIT MEMO",
    then: () => Yup.string().required("Reference is required"),
    otherwise: () => Yup.string().nullable(),
  }),

  check_date: Yup.date().nullable(),

  check: Yup.array().when("multiple", {
    is: (multiple) => multiple === true,
    then: () =>
      Yup.array().of(
        Yup.object().shape({
          check_no: Yup.object().when("type", {
            is: (type) => type === "CHECK VOUCHER",
            then: () =>
              Yup.object()
                .required("Check No. is required")
                .typeError("Check No. is required"),
            otherwise: () => Yup.object().nullable("Check No. is required"),
          }),
          amount: Yup.number()
            .required("Amount is required")
            .moreThan(0, "Amount must be greater than 0"),
          check_date: Yup.date().nullable(),
          bank: Yup.string().required(),
        })
      ),
  }),
}).required();

export default treasurySchema;

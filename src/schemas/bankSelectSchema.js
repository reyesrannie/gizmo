import * as Yup from "yup";

const bankSelectSchema = Yup.object({
  bank: Yup.object().required("Bank is required").typeError("Bank is required"),
  type: Yup.string().nullable(),

  account_number: Yup.object().when("type", {
    is: (type) => type === "CHECK VOUCHER",
    then: () =>
      Yup.object()
        .required("Account number is required")
        .typeError("Account number is required"),
    otherwise: () => Yup.string().nullable(),
  }),

  title: Yup.object().when("type", {
    is: (type) => type === "CHECK VOUCHER",
    then: () =>
      Yup.object()
        .required("Check series name is required")
        .typeError("Check series name is required"),
    otherwise: () => Yup.string().nullable(),
  }),
}).required();

export default bankSelectSchema;

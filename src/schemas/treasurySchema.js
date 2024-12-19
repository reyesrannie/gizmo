import * as Yup from "yup";

const treasurySchema = Yup.object({
  debit_coa_id: Yup.object().nullable(),
  credit_coa_id: Yup.object().nullable(),
  type: Yup.string().required("Type is required"),
  check: Yup.array()
    .of(
      Yup.object().shape({
        check_no: Yup.object().nullable(),
        amount: Yup.number()
          .required("Amount is required")
          .moreThan(0, "Amount must be greater than 0"),
        check_date: Yup.date().nullable(),
        bank: Yup.string().required(),
        reference_no: Yup.string().nullable(),
      })
    )
    .compact((value) => value.bank === "" && value.check_no === null)
    .min(1, "This field is required")
    .required()
    .label("check"),
}).required();

export default treasurySchema;

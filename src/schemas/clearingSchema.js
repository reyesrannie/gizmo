import * as Yup from "yup";

const clearingSchema = Yup.object({
  cleared_date: Yup.date()
    .required("Date cleared is required")
    .typeError("Date cleared is required"),
  treasury_receipts: Yup.array()
    .of(
      Yup.object().shape({
        receipt_id: Yup.object()
          .required("Receipt type is required")
          .typeError("Receipt type is required"),
        receipt_no: Yup.string().required("Receipt No. is required"),
        receipt_date: Yup.date()
          .required("Receipt date is required")
          .typeError("Receipt date is required"),
      })
    )
    .compact((value) => value.receipt_no === "" && value.receipt_id === null)
    .min(1, "This field is required")
    .required()
    .label("treasury_receipts"),
}).required();

export default clearingSchema;

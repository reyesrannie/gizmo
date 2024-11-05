import * as Yup from "yup";

const clearingSchema = Yup.object({
  treasury_receipts: Yup.array().of(
    Yup.object().shape({
      or_document_id: Yup.object()
        .required("Document Type is required")
        .typeError("Document Type is required"),
      or_no: Yup.string().required("OR No. is required"),
      or_date: Yup.date()
        .required("OR Date is required")
        .typeError("OR Date is required"),
    })
  ),
}).required();

export default clearingSchema;

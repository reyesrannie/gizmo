import * as Yup from "yup";

const generalJournalSchema = Yup.object({
  gj_name: Yup.string().required("This field is required"),
  gj_description: Yup.string().required("This field is required"),
  ap_tagging_id: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  boa: Yup.string().required("This field is required"),
  tag_year: Yup.date()
    .required("This field is required")
    .typeError("This field is required"),

  debit: Yup.number().nullable(),
  credit: Yup.number().nullable(),
  variance: Yup.number().nullable(),

  gj_items: Yup.array()
    .of(
      Yup.object().shape({
        coa_id: Yup.object()
          .required("This field is required")
          .typeError("This field is required"),
        debit_amount: Yup.number().nullable(),
        credit_amount: Yup.number().nullable(),
        invoice_no: Yup.string().required("This field is required"),
        tag_no: Yup.string().required("This field is required"),
        item_id: Yup.string().nullable(),
        voucher_no: Yup.string().required("This field is required"),
        supplier_id: Yup.object()
          .required("This field is required")
          .typeError("This field is required"),
        location_id: Yup.object()
          .required("This field is required")
          .typeError("This field is required"),
      })
    )
    .compact((value) => value.gj_items === null && value.tag_no === "")
    .min(1)
    .required()
    .label("gj_items")
    .required(),
});

export default generalJournalSchema;

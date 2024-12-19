import * as Yup from "yup";

const generalJournalSchema = Yup.object({
  gj_name: Yup.string().required("This field is required"),
  gj_description: Yup.string().required("This field is required"),
  ap_tagging_id: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  gj_type: Yup.string().required("This field is required"),
  gj_series: Yup.string().nullable(),
  reference_no: Yup.string().nullable(),

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
        debit_amount: Yup.string().nullable(),
        credit_amount: Yup.string().nullable(),
        item_id: Yup.string().nullable(),
      })
    )
    .compact((value) => value.gj_items === null)
    .min(1)
    .required()
    .label("gj_items")
    .required(),
});

export default generalJournalSchema;

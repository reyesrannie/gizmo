import * as Yup from "yup";
import { useSelector } from "react-redux";

const Voucher = () => {
  const voucher = useSelector((state) => state.options.voucher);

  return voucher;
};

const apTransactionSchema = Yup.object({
  tag_no: Yup.string().required("Tag number is required"),
  tin: Yup.object().required("TIN is required"),
  proprietor: Yup.string().nullable(),
  description: Yup.string().nullable(),
  cip_no: Yup.string().nullable(),
  voucherType: Yup.string().nullable(),
  remarks: Yup.string().when("voucherType", {
    is: (voucherType) => voucherType === "journal",
    then: () => Yup.string().required("Remarks is required"),
  }),

  coa_id: Yup.object().when("voucherType", {
    is: (voucherType) => voucherType === "journal",
    then: () =>
      Yup.object()
        .required("Account Title is required")
        .typeError("Account Title is required"),
  }),
  company_address: Yup.string().required("Supplier address is required"),
  amount: Yup.string().required("Amount is required"),
  invoice_no: Yup.string().required("Invoice number is required"),
  date_invoice: Yup.date()
    .typeError("Date invoice is required")
    .required("Date invoice is required"),
});

export default apTransactionSchema;

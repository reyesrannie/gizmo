import * as Yup from "yup";

const supplierSchema = Yup.object({
  tin: Yup.string().required("Tin is required").min(15, "Invalid TIN format"),
  company_name: Yup.string().required("Company name is required"),
  company_address: Yup.string().required("Company address is required"),
  proprietor: Yup.string().nullable(),
  supplier_types: Yup.array()
    .min(1, "Supplier needs atleast 1 item")
    .required("Supplier Type is required")
    .typeError("Supplier Type is required"),
  supplier_atcs: Yup.array()
    .min(1, "Supplier needs atleast 1 item")
    .required("Supplier Type is required")
    .typeError("Supplier Type is required"),
  supplier_vats: Yup.array()
    .min(1, "VAT needs atleast 1 item")
    .required("VAT Type is required")
    .typeError("VAT Type is required"),
}).required();

export default supplierSchema;

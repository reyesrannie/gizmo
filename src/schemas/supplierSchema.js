import * as Yup from "yup";

const supplierSchema = Yup.object({
  noTin: Yup.boolean(),
  isSpecial: Yup.boolean(),
  is_company: Yup.boolean(),
  tin: Yup.string()
    .required("Tin is required")
    .test("tin-length", "Invalid TIN format", function (value) {
      if (this.parent.noTin) {
        return true;
      }
      return value?.length === 15;
    }),
  company_name: Yup.string().required("Company name is required"),
  company_address: Yup.string().required("Company address is required"),
  proprietor: Yup.string().nullable(),
  receipt_name: Yup.string().required("Receipt name is required"),

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
  supplier_documenttypes: Yup.array()
    .min(1, "Document type needs atleast 1 item")
    .required("Document type is required")
    .typeError("Document type is required"),
}).required();

export default supplierSchema;

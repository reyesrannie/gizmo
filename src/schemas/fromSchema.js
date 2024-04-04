import * as Yup from "yup";

const fromSchema = Yup.object({
  coverage: Yup.string().required("Coverage is required"),
  code: Yup.string().test("is-valid-zip-code", "Invalid Zip Code", (value) => {
    if (value === "") {
      return true; // Accept empty string
    }
    return /^\d{4}$/.test(value); // Validate format for non-empty strings
  }),
  month: Yup.string().required("Month of the quarter is required"),
}).required();

export default fromSchema;

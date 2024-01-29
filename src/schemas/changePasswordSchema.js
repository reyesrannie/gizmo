import * as Yup from "yup";

const changePasswordSchema = Yup.object({
  old_password: Yup.string().required(),
  password: Yup.string().required(),
  password_confirmation: Yup.string().required(),
}).required();

export default changePasswordSchema;

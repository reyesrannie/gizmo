import * as Yup from "yup";

const orderBySchema = Yup.object({
  orderBy: Yup.object().nullable(),
  check_ids: Yup.array().nullable(),
});

export default orderBySchema;

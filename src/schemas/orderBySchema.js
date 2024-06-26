import * as Yup from "yup";

const orderBySchema = Yup.object({
  orderBy: Yup.object().nullable(),
});

export default orderBySchema;

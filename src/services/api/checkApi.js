import { jsonServerAPI } from "../store/request";

export const checkApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    checkDetails: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CheckDetails"],
    }),

    clearingCheckDetails: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/clearing/check`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useCheckDetailsQuery, useClearingCheckDetailsMutation } =
  checkApi;

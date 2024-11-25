import { jsonServerAPI } from "../store/request";

export const accountNumberApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    getMonthVP: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/month-list/transaction`,
        method: "GET",
        params: payload,
      }),
    }),
    getMonthGJ: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/month-list/general-journal`,
        method: "GET",
        params: payload,
      }),
    }),
  }),
});

export const { useLazyGetMonthVPQuery, useLazyGetMonthGJQuery } =
  accountNumberApi;

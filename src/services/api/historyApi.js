import { jsonServerAPI } from "../store/request";

export const accountNumberApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    getHistory: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/history/vp`,
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

export const { useGetHistoryQuery } = accountNumberApi;

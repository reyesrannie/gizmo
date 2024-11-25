import { jsonServerAPI } from "../store/request";

export const accountNumberApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    dashboardBalance: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/dashboard/balance`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["DashboardBalance"],
    }),
  }),
});

export const { useDashboardBalanceQuery } = accountNumberApi;

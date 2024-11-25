import { jsonServerAPI } from "../store/request";

export const bankBalance = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    bBalance: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/balance`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["BeginningBalance"],
    }),
    createBalance: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/balance`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["BeginningBalance"],
    }),
    updateBalance: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/balance/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["BeginningBalance"],
    }),
    archiveBal: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/balance/${payload?.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["BeginningBalance"],
    }),
  }),
});

export const {
  useBBalanceQuery,
  useCreateBalanceMutation,
  useUpdateBalanceMutation,
  useArchiveBalMutation,
} = bankBalance;

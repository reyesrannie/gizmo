import { jsonServerAPI } from "../store/request";

export const transactionApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    transaction: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Transaction"],
    }),
    createTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "Transaction",
        "GTAG",
        "VPCheckNumber",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    approveTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/transaction/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "Transaction",
        "GTAG",
        "VPCheckNumber",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    updateTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [
        "Transaction",
        "Logs",
        "VPCheckNumber",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    archiveTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archived/transaction/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "Transaction",
        "Logs",
        "VPCheckNumber",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    receiveTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/received/transaction/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "Transaction",
        "Logs",
        "VPCheckNumber",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    returnTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/returned/transaction/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "Transaction",
        "Logs",
        "VPCheckNumber",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    readTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/is-read/transaction/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    tagYearMonth: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `tag-year/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["TagYear"],
    }),
  }),
});

export const {
  useTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useArchiveTransactionMutation,
  useReceiveTransactionMutation,
  useReturnTransactionMutation,
  useApproveTransactionMutation,
  useReadTransactionMutation,
  useTagYearMonthQuery,
} = transactionApi;

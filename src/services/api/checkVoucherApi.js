import { jsonServerAPI } from "../store/request";

export const checkVoucherApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    prepareCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/preparation/transaction-check`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),
    forApprovalCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check-approval/transaction-check/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),
    releaseCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/releasing/transaction-check`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),
    releasedCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/released/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),
    clearCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/clearing/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),
    fileCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/filing/transaction-check`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),
    readTransactionCheck: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/is-read/transaction-check/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),

    printCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/is-print/transaction-check/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),

    updateCheckDate: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/update-releasing/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),
  }),
});

export const {
  usePrepareCVoucherMutation,
  useForApprovalCVoucherMutation,
  useReleaseCVoucherMutation,
  useReleasedCVoucherMutation,
  useClearCVoucherMutation,
  useFileCVoucherMutation,
  useReadTransactionCheckMutation,
  useUpdateCheckDateMutation,
  usePrintCVoucherMutation,
} = checkVoucherApi;

import { jsonServerAPI } from "../store/request";

export const vouchersPayableApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    vpCheckNumber: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check-vp/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["VPCheckNumber"],
    }),
    statusLogs: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `status-log`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Logs"],
    }),

    checkEntries: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-check`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CheckEntries"],
    }),
    createCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-check`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "SingleCheck",
        "CheckEntries",
        "Logs",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    updateCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-check/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [
        "SingleCheck",
        "CheckEntries",
        "Logs",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    archiveCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/transaction-check/${payload.id}`,
        method: "PATCH",
        params: payload,
      }),
      invalidatesTags: [
        "SingleCheck",
        "CheckEntries",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    returnCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/returned/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "SingleCheck",
        "CheckEntries",
        "Logs",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    approveCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "SingleCheck",
        "CheckEntries",
        "Logs",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
        "VPCheckNumber",
      ],
    }),
    checkedCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/checked/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "CheckEntries",
        "Logs",
        "VPCheckNumber",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    voidCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/for-voiding/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck"],
    }),
    voidedCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/voided/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck"],
    }),
    checkTransaction: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/single-check`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["SingleCheck"],
    }),
  }),
});

export const {
  useVpCheckNumberQuery,
  useStatusLogsQuery,
  useCheckEntriesQuery,
  useLazyCheckEntriesQuery,
  useCreateCheckEntriesMutation,
  useUpdateCheckEntriesMutation,
  useArchiveCheckEntriesMutation,
  useReturnCheckEntriesMutation,
  useApproveCheckEntriesMutation,
  useVoidCVoucherMutation,
  useVoidedCVoucherMutation,
  useCheckedCVoucherMutation,
  useCheckTransactionQuery,
} = vouchersPayableApi;

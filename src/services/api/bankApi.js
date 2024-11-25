import { jsonServerAPI } from "../store/request";

export const bankApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    /////////////////////////////////////////////////////////////Bank
    bank: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/bank`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Bank"],
    }),
    createBank: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/bank`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Bank"],
    }),
    updateBank: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/bank/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Bank"],
    }),
    archiveBank: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/bank/${payload?.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Bank"],
    }),
    /////////////////////////////////////////////////////////////Bank

    /////////////////////////////////////////////////////////////Account Number
    bankAccountNumber: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/bank_account`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["BankAccountNumber"],
    }),
    createBankAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/bank_account`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["BankAccountNumber"],
    }),
    updateBankAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/bank_account/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["BankAccountNumber"],
    }),
    archiveBankAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/bank_account/${payload?.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["BankAccountNumber"],
    }),
    /////////////////////////////////////////////////////////////Account Number

    /////////////////////////////////////////////////////////////Title
    bankAccountTitle: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/bank_title`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["BankAccountTitle"],
    }),
    createBankAccountTitle: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/bank_title`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["BankAccountTitle"],
    }),
    updateBankAccountTitle: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/bank_title/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["BankAccountTitle", "BankAccountNumber"],
    }),
    archiveBankAccountTitle: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/bank_title/${payload?.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["BankAccountTitle"],
    }),
    /////////////////////////////////////////////////////////////Title
    /////////////////////////////////////////////////////////////Check number

    checkNumber: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CheckNumber"],
    }),

    importChecks: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/check`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckNumber"],
    }),

    createCheckNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckNumber"],
    }),
    updateCheckNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CheckNumber"],
    }),
    archiveCheckNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archived/check/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["CheckNumber"],
    }),

    voidCheckNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cancelled/check/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckNumber", "CheckEntries"],
    }),
    /////////////////////////////////////////////////////////////Check number
  }),
});

export const {
  useBankQuery,
  useCreateBankMutation,
  useUpdateBankMutation,
  useArchiveBankMutation,

  useLazyBankAccountNumberQuery,
  useBankAccountNumberQuery,
  useCreateBankAccountNumberMutation,
  useUpdateBankAccountNumberMutation,
  useArchiveBankAccountNumberMutation,

  useBankAccountTitleQuery,
  useCreateBankAccountTitleMutation,
  useUpdateBankAccountTitleMutation,
  useArchiveBankAccountTitleMutation,

  useCheckNumberQuery,
  useLazyCheckNumberQuery,
  useCreateCheckNumberMutation,
  useArchiveCheckNumberMutation,
  useUpdateCheckNumberMutation,
  useVoidCheckNumberMutation,
  useImportChecksMutation,
} = bankApi;

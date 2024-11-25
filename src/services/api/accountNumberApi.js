import { jsonServerAPI } from "../store/request";

export const accountNumberApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    accountNumber: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/account-number`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["AccountNumber"],
    }),
    createAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/account-number`,
        method: "POST",
        body: payload,
      }),
    }),
    importAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/account-number`,
        method: "POST",
        body: payload,
      }),
    }),
    updateAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/account-number/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/account-number/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useAccountNumberQuery,
  useCreateAccountNumberMutation,
  useArchiveAccountNumberMutation,
  useUpdateAccountNumberMutation,
  useImportAccountNumberMutation,
} = accountNumberApi;

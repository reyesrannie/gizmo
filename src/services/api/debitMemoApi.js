import { jsonServerAPI } from "../store/request";

export const debitMemoApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    debitMemo: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/debit-memo`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["DebitMemo"],
    }),
    clearDebitMemo: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cleared/debit-memo`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DebitMemo"],
    }),
    returnDebitMemo: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cancelled/debit-memo/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DebitMemo"],
    }),
  }),
});

export const {
  useDebitMemoQuery,
  useClearDebitMemoMutation,
  useReturnDebitMemoMutation,
} = debitMemoApi;

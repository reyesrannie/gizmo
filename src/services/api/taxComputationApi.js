import { jsonServerAPI } from "../store/request";

export const taxComputationApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    taxComputation: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-tax`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["TaxComputation"],
    }),
    createTaxComputation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-tax`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["TaxComputation", "VPCheckNumber", "VPJournalNumber"],
    }),
    updateTaxComputation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-tax/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["TaxComputation", "VPCheckNumber", "VPJournalNumber"],
    }),
    archiveTaxComputation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/transaction-tax/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["TaxComputation", "VPCheckNumber", "VPJournalNumber"],
    }),
  }),
});

export const {
  useTaxComputationQuery,
  useCreateTaxComputationMutation,
  useUpdateTaxComputationMutation,
  useArchiveTaxComputationMutation,
} = taxComputationApi;

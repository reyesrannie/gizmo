// authApi.js
import { jsonServerAPI } from "../store/request";

export const apApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    vat: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/vat`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["VAT"],
    }),
    createVAT: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/vat`,
        method: "POST",
        body: payload,
      }),
    }),
    importVAT: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/vat`,
        method: "POST",
        body: payload,
      }),
    }),
    updateVAT: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/vat/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveVAT: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/vat/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useVatQuery,
  useCreateVATMutation,
  useImportVATMutation,
  useUpdateVATMutation,
  useArchiveVATMutation,
} = apApi;

import { jsonServerAPI } from "../store/request";

export const supplierApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    supplier: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Supplier"],
    }),
    createSupplier: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier`,
        method: "POST",
        body: payload,
      }),
    }),
    importSupplier: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/supplier`,
        method: "POST",
        body: payload,
      }),
    }),
    updateSupplier: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveSupplier: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/supplier/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useSupplierQuery,
  useCreateSupplierMutation,
  useImportSupplierMutation,
  useUpdateSupplierMutation,
  useArchiveSupplierMutation,
} = supplierApi;

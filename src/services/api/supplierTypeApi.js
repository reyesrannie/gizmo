import { jsonServerAPI } from "../store/request";

export const supplierTypeApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    supplierType: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier-type`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["SupplierType"],
    }),
    createSupplierType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier-type`,
        method: "POST",
        body: payload,
      }),
    }),
    importSupplierType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `import/supplier-type`,
        method: "POST",
        body: payload,
      }),
    }),
    updateSupplierType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier-type/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveSupplierType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/supplier-type/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useSupplierTypeQuery,
  useCreateSupplierTypeMutation,
  useImportSupplierTypeMutation,
  useUpdateSupplierTypeMutation,
  useArchiveSupplierTypeMutation,
} = supplierTypeApi;

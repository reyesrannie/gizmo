import { jsonServerAPI } from "../store/request";

export const documentTypeApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    documentType: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/document-type`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["DocumentType"],
    }),
    createDocumentType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/document-type`,
        method: "POST",
        body: payload,
      }),
    }),
    importDocumentType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/document-type`,
        method: "POST",
        body: payload,
      }),
    }),
    updateDocumentType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/document-type/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveDocumentType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/document-type/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useDocumentTypeQuery,
  useCreateDocumentTypeMutation,
  useImportDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
  useArchiveDocumentTypeMutation,
} = documentTypeApi;

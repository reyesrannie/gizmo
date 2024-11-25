import { jsonServerAPI } from "../store/request";

export const apApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    ap: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ap_tagging`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["AP"],
    }),
    createAP: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ap_tagging`,
        method: "POST",
        body: payload,
      }),
    }),
    importAP: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/ap`,
        method: "POST",
        body: payload,
      }),
    }),
    updateAP: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ap_tagging/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveAP: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/ap/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useApQuery,
  useCreateAPMutation,
  useImportAPMutation,
  useUpdateAPMutation,
  useArchiveAPMutation,
} = apApi;

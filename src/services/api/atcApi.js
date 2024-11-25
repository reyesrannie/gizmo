import { jsonServerAPI } from "../store/request";

export const atcApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    atc: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/atc`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["ATC"],
    }),
    createATC: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/atc`,
        method: "POST",
        body: payload,
      }),
    }),
    importATC: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/atc`,
        method: "POST",
        body: payload,
      }),
    }),
    updateATC: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/atc/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveATC: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/atc/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useAtcQuery,
  useCreateATCMutation,
  useImportATCMutation,
  useUpdateATCMutation,
  useArchiveATCMutation,
} = atcApi;

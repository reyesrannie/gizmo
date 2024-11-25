import { jsonServerAPI } from "../store/request";

export const locationApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    location: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/location`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Location"],
    }),
    createLocation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/location`,
        method: "POST",
        body: payload,
      }),
    }),
    importLocation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/location`,
        method: "POST",
        body: payload,
      }),
    }),
    updateLocation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/location/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveLocation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/location/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLocationQuery,
  useCreateLocationMutation,
  useImportLocationMutation,
  useUpdateLocationMutation,
  useArchiveLocationMutation,
} = locationApi;

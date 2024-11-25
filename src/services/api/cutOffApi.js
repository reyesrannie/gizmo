import { jsonServerAPI } from "../store/request";

export const cutOffApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    cutOff: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cut-off`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CutOFF"],
    }),
    createCutOff: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cut-off`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CutOFF", "CutOFFLogs"],
    }),
    updateCutOff: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cut-off/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CutOFF", "CutOFFLogs"],
    }),
    approveCutOff: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/cut-off/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CutOFF", "CutOFFLogs", "TagYear"],
    }),
  }),
});

export const {
  useCutOffQuery,
  useCreateCutOffMutation,
  useUpdateCutOffMutation,
  useApproveCutOffMutation,
} = cutOffApi;

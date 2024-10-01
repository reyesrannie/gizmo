import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseURL = process.env.REACT_APP_API_KEY;
// const baseURL = "http://10.10.12.10:8000/api/";
const baseURL = "http://192.168.254.132:8000/api/";

export const seconAPIRequest = createApi({
  reducerPath: "seconAPIRequest",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    mode: "cors",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["GeneralJournal"],
  endpoints: (builder) => ({
    //Authentication and users
    getMonth: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/month-list/transaction`,
        method: "GET",
        params: payload,
      }),
    }),
    generalJournal: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/general-journal`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["GeneralJournal"],
    }),
    createGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/general-journal`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal"],
    }),
    forApproveGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/checked/general-journal/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal"],
    }),
    archiveGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/general-journal/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal"],
    }),
    approveGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/general-journal/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal"],
    }),
    returnGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/returned/general-journal/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal"],
    }),
    voidGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/voided/general-journal/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal"],
    }),

    readTransactionGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/is-read/general-journal/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal"],
    }),
    searchTag: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/tag-search/general-journal`,
        method: "GET",
        params: payload,
      }),
    }),
  }),
});

export const {
  useGetMonthQuery,
  useGeneralJournalQuery,
  useLazySearchTagQuery,
  useCreateGJMutation,
  useForApproveGJMutation,
  useArchiveGJMutation,
  useReadTransactionGJMutation,
  useApproveGJMutation,
  useReturnGJMutation,
  useVoidGJMutation,
} = seconAPIRequest;

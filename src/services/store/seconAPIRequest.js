import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = process.env.REACT_APP_API_KEY;
// const baseURL = "http://10.10.12.10:8000/api/";

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
  tagTypes: [
    "GeneralJournal",
    "CountGJ",
    "GJLogs",
    "BeginningBalance",
    "DashboardBalance",
  ],
  endpoints: (builder) => ({
    //Authentication and users
    getMonthVP: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/month-list/transaction`,
        method: "GET",
        params: payload,
      }),
    }),
    getMonthGJ: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/month-list/general-journal`,
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
      invalidatesTags: ["GeneralJournal", "CountGJ", "GJLogs"],
    }),
    forApproveGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/checked/general-journal/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal", "CountGJ", "GJLogs"],
    }),
    archiveGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/general-journal/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal", "CountGJ", "GJLogs"],
    }),
    approveGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/general-journal/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal", "CountGJ", "GJLogs"],
    }),
    returnGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/returned/general-journal/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal", "CountGJ", "GJLogs"],
    }),
    voidGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/voided/general-journal/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal", "CountGJ", "GJLogs"],
    }),
    gjStatusLogs: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/gj-log`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["GJLogs"],
    }),
    readTransactionGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/is-read/general-journal/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal", "CountGJ", "GJLogs"],
    }),

    //GJ Count
    gjCount: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/gj-count/general-journal`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CountGJ"],
    }),
    searchTag: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/tag-search/general-journal`,
        method: "GET",
        params: payload,
      }),
    }),

    bBalance: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/balance`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["BeginningBalance"],
    }),
    createBalance: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/balance`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["BeginningBalance"],
    }),
    updateBalance: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/balance/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["BeginningBalance"],
    }),
    archiveBal: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/balance/${payload?.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["BeginningBalance"],
    }),

    dashboardBalance: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/dashboard/balance`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["DashboardBalance"],
    }),
  }),
});

export const {
  useLazyGetMonthVPQuery,
  useLazyGetMonthGJQuery,
  useGeneralJournalQuery,
  useLazySearchTagQuery,
  useCreateGJMutation,
  useForApproveGJMutation,
  useArchiveGJMutation,
  useReadTransactionGJMutation,
  useApproveGJMutation,
  useReturnGJMutation,
  useVoidGJMutation,
  useGjStatusLogsQuery,
  useGjCountQuery,

  useBBalanceQuery,
  useCreateBalanceMutation,
  useUpdateBalanceMutation,
  useArchiveBalMutation,

  useDashboardBalanceQuery,
} = seconAPIRequest;

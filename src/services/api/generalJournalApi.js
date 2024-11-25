import { jsonServerAPI } from "../store/request";

export const generalJournalApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
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
    updateGj: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/general-journal/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal", "CountGJ", "GJLogs"],
    }),

    postGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/posted/general-journal/${payload?.id}`,
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
    archiveGJItem: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive-item/general-journal/${payload?.id}`,
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
    approveGJDM: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/debit-memo/${payload?.id}`,
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
    readTransactionGJ: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/is-read/general-journal/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["GeneralJournal", "CountGJ", "GJLogs"],
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
  useCreateGJMutation,
  useUpdateGjMutation,
  usePostGJMutation,
  useForApproveGJMutation,
  useArchiveGJMutation,
  useArchiveGJItemMutation,
  useApproveGJMutation,
  useApproveGJDMMutation,
  useReturnGJMutation,
  useVoidGJMutation,
  useGeneralJournalQuery,
  useReadTransactionGJMutation,
  useLazySearchTagQuery,
} = generalJournalApi;

import { jsonServerAPI } from "../store/request";

export const scheduledTransactionApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    schedTransaction: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/schedule`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["SchedTransact"],
    }),
    createScheduleTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/schedule`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    updateScheduleTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/schedule/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    receiveScheduleTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/received/schedule/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    checkedScheduleTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/checked/schedule/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    approveSchedTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/schedule/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    returnSchedTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/returned/schedule/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    resetSchedTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/reset/schedule/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    generateTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/generate-transaction/schedule`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "SchedTransact",
        "SingleCheck",
        "CheckEntries",
        "Logs",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
        "CountSchedule",
        "ScheduleLogs",
      ],
    }),
    completeSchedTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/completed/schedule/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
  }),
});

export const {
  useSchedTransactionQuery,
  useCreateScheduleTransactionMutation,
  useUpdateScheduleTransactionMutation,
  useReceiveScheduleTransactionMutation,
  useCheckedScheduleTransactionMutation,
  useApproveSchedTransactionMutation,
  useReturnSchedTransactionMutation,
  useResetSchedTransactionMutation,
  useCompleteSchedTransactionMutation,
  useGenerateTransactionMutation,
} = scheduledTransactionApi;

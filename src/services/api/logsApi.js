import { jsonServerAPI } from "../store/request";

export const logsApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    statusScheduleLogs: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `schedule-log`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["ScheduleLogs"],
    }),
    cutOffLogs: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cutoff-log`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CutOFFLogs"],
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
    dmStatusLogs: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/dm-log`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["DMLogs"],
    }),
  }),
});

export const {
  useStatusScheduleLogsQuery,
  useCutOffLogsQuery,
  useGjStatusLogsQuery,
  useDmStatusLogsQuery,
} = logsApi;

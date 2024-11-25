import { jsonServerAPI } from "../store/request";

export const countApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    transactCount: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-count/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CountTransaction"],
    }),
    checkCount: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check-count/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CountCheck"],
    }),
    treasuryCount: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/treasury-count/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CountTreasury"],
    }),
    countSchedule: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/sched-count/schedule`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CountSchedule"],
    }),
    gjCount: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/gj-count/general-journal`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CountGJ"],
    }),
  }),
});

export const {
  useCheckCountQuery,
  useTransactCountQuery,
  useTreasuryCountQuery,
  useCountScheduleQuery,
  useGjCountQuery,
} = countApi;

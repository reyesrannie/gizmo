import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseURL = process.env.REACT_APP_API_KEY;

const baseURL = process.env.REACT_APP_API_SEDAR_KEY;

export const jsonSedarAPI = createApi({
  reducerPath: "jsonSedarAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    mode: "cors",
    prepareHeaders: (headers) => {
      const token = process.env.REACT_APP_SEDAR_TOKEN;
      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    sedar: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/data/employee/filter/active`,
        method: "GET",
        params: payload,
      }),
    }),
  }),
});

export const { useSedarQuery } = jsonSedarAPI;

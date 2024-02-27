import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseURL = process.env.REACT_APP_API_KEY;

const baseURL = process.env.REACT_APP_FISTO_KEY;

export const jsonFistoApi = createApi({
  reducerPath: "jsonFistoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    mode: "cors",
    prepareHeaders: (headers) => {
      const token = process.env.REACT_APP_FISTO_TOKEN;
      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fisto: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/official-transactions`,
        method: "GET",
        params: payload,
      }),
    }),
  }),
});

export const { useFistoQuery } = jsonFistoApi;

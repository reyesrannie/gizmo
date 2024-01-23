import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseURL = process.env.REACT_APP_API_KEY;

const baseURL = "http://10.10.13.11:8000/api";

export const jsonServerAPI = createApi({
  reducerPath: "jsonServerAPI",
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
  tagTypes: ["Links"],
  endpoints: (builder) => ({
    login: builder.mutation({
      transformResponse: (response) => response.result,
      query: (payload) => ({ url: `/login`, method: "POST", body: payload }),
    }),
    logout: builder.mutation({
      transformResponse: (response) => response.result,
      query: (payload) => ({ url: `/logout`, method: "POST", body: payload }),
    }),
    passwordChange: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/user/change_password`,
        method: "PUT",
        body: payload,
      }),
    }),
    links: builder.query({
      transformResponse: (response) => response.result,
      query: (payload) => ({
        url: `/link`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Links"],
    }),
    images: builder.query({
      transformResponse: (response) => response.result,
      query: (payload) => ({
        url: `/cloudinary`,
        method: "GET",
        body: payload,
      }),
    }),
    uploadImage: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/image-upload`,
        method: "POST",
        body: payload,
      }),
    }),
    createLink: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({ url: `/link`, method: "POST", body: payload }),
      invalidatesTags: ["Links"],
    }),
    updateLink: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/link/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Links"],
    }),
    archiveLink: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/link_archive/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Links"],
    }),
  }),
});

export const {
  useLoginMutation,
  usePasswordChangeMutation,
  useLogoutMutation,
  useCreateLinkMutation,
  useLinksQuery,
  useUpdateLinkMutation,
  useImagesQuery,
  useUploadImageMutation,
  useArchiveLinkMutation,
} = jsonServerAPI;

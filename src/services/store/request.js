import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseURL = process.env.REACT_APP_API_KEY;

// const baseURL = "http://10.10.13.17:8000/api";
const baseURL = "http://127.0.0.1:8000/api";

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
  tagTypes: ["Users", "Role", "Company", "Department", "Location", "AP"],
  endpoints: (builder) => ({
    login: builder.mutation({
      transformResponse: (response) => response.result,
      query: (payload) => ({
        url: `/auth/login`,
        method: "POST",
        body: payload,
      }),
    }),
    logout: builder.mutation({
      transformResponse: (response) => response.result,
      query: (payload) => ({
        url: `/auth/logout`,
        method: "POST",
        body: payload,
      }),
    }),
    passwordChange: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/change_password/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
    passwordReset: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/reset_password/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
    users: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/auth`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Users"],
    }),
    createUser: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/auth`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/auth/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
    archiveUser: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/auth/archived/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
    role: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/role`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Role"],
    }),

    createRole: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/role`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Role"],
    }),
    updateRole: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/role/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Role"],
    }),
    archiveRole: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/role/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Role"],
    }),
    company: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/company`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Company"],
    }),
    createCompany: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/company`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Company"],
    }),
    updateCompany: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/company/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Company"],
    }),
    archiveCompany: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/company/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Company"],
    }),
    department: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/department`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Department"],
    }),
    createDepartment: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/department`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Department"],
    }),
    updateDepartment: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/department/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Department"],
    }),
    archiveDepartment: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/department/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Department"],
    }),
    location: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/location`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Location"],
    }),
    createLocation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/location`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Location"],
    }),
    updateLocation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/location/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Location"],
    }),
    archiveLocation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/location/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Location"],
    }),
    ap: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ap_tagging`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["AP"],
    }),
    createAP: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ap_tagging`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AP"],
    }),
    updateAP: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ap_tagging/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AP"],
    }),
    archiveAP: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/ap/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["AP"],
    }),
  }),
});

export const {
  useLoginMutation,
  usePasswordChangeMutation,
  useLogoutMutation,
  usePasswordResetMutation,
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useArchiveUserMutation,
  useRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useArchiveRoleMutation,
  useCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useArchiveCompanyMutation,
  useDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useArchiveDepartmentMutation,
  useLocationQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useArchiveLocationMutation,
  useApQuery,
  useCreateAPMutation,
  useUpdateAPMutation,
  useArchiveAPMutation,
} = jsonServerAPI;

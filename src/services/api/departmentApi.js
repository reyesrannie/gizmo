import { jsonServerAPI } from "../store/request";

export const departmentApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
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
    }),
    importDepartment: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/department`,
        method: "POST",
        body: payload,
      }),
    }),
    updateDepartment: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/department/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveDepartment: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/department/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useDepartmentQuery,
  useCreateDepartmentMutation,
  useImportDepartmentMutation,
  useUpdateDepartmentMutation,
  useArchiveDepartmentMutation,
} = departmentApi;

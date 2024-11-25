import { jsonServerAPI } from "../store/request";

export const companyApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
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
    }),
    importCompany: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/company`,
        method: "POST",
        body: payload,
      }),
    }),
    updateCompany: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/company/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveCompany: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/company/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useCompanyQuery,
  useImportCompanyMutation,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useArchiveCompanyMutation,
} = companyApi;

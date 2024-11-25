import { jsonServerAPI } from "../store/request";

export const coaApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    accountTitles: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/coa`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["AccountTitles"],
    }),
    createAccountTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/coa`,
        method: "POST",
        body: payload,
      }),
    }),
    importAccountTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/coa`,
        method: "POST",
        body: payload,
      }),
    }),
    updateAccountTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/coa/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveAccountTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/coa/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //Great GrandParent
    ggpTitles: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-ggp`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["GGPAccountTitles"],
    }),
    createggpTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-ggp`,
        method: "POST",
        body: payload,
      }),
    }),
    importggpTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/ac-ggp`,
        method: "POST",
        body: payload,
      }),
    }),
    updateggpTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-ggp/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveggpTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/ac-ggp/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //Grand Parent
    gpTitles: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-gp`,
        method: "GET",
        params: payload,
      }),
    }),
    creategpTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-gp`,
        method: "POST",
        body: payload,
      }),
    }),
    importgpTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/ac-gp`,
        method: "POST",
        body: payload,
      }),
    }),
    updategpTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-gp/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archivegpTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/ac-gp/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //Parent
    pTitles: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-p`,
        method: "GET",
        params: payload,
      }),
    }),
    createpTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-p`,
        method: "POST",
        body: payload,
      }),
    }),
    importpTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/ac-p`,
        method: "POST",
        body: payload,
      }),
    }),
    updatepTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-p/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archivepTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/ac-p/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //Child

    cTitles: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-c`,
        method: "GET",
        params: payload,
      }),
    }),
    createcTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-c`,
        method: "POST",
        body: payload,
      }),
    }),
    importcTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/ac-c`,
        method: "POST",
        body: payload,
      }),
    }),
    updatecTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-c/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archivecTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/ac-c/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //GrandChild
    gcTitles: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-gc`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["GCAccountTitles"],
    }),
    creategcTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-gc`,
        method: "POST",
        body: payload,
      }),
    }),
    importgcTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/ac-gc`,
        method: "POST",
        body: payload,
      }),
    }),
    updategcTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ac-gc/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archivegcTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/ac-gc/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useAccountTitlesQuery,
  useCreateAccountTitlesMutation,
  useArchiveAccountTitlesMutation,
  useImportAccountTitlesMutation,
  useUpdateAccountTitlesMutation,

  useGgpTitlesQuery,
  useCreateggpTitlesMutation,
  useArchiveggpTitlesMutation,
  useUpdateggpTitlesMutation,
  useImportggpTitlesMutation,

  useGpTitlesQuery,
  useCreategpTitlesMutation,
  useUpdategpTitlesMutation,
  useArchivegpTitlesMutation,
  useImportgpTitlesMutation,

  usePTitlesQuery,
  useCreatepTitlesMutation,
  useUpdatepTitlesMutation,
  useArchivepTitlesMutation,
  useImportpTitlesMutation,

  useCTitlesQuery,
  useCreatecTitlesMutation,
  useUpdatecTitlesMutation,
  useArchivecTitlesMutation,
  useImportcTitlesMutation,

  useGcTitlesQuery,
  useCreategcTitlesMutation,
  useUpdategcTitlesMutation,
  useArchivegcTitlesMutation,
  useImportgcTitlesMutation,
} = coaApi;

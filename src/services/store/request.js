import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseURL = process.env.REACT_APP_API_KEY;

const baseURL = "http://10.10.13.17:8000/api";
// const baseURL = "http://127.0.0.1:8000/api";

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
  tagTypes: [
    "Users",
    "Role",
    "Company",
    "Department",
    "Location",
    "AP",
    "VAT",
    "ATC",
    "SupplierType",
    "Supplier",
    "DocumentType",
    "AccountNumber",
    "Transaction",
    "Logs",
    "AccountTitles",
    "GTAG",
    "VPCheckNumber",
    "VPJournalNumber",
    "SingleCheck",
    "SingleJournal",
    "CheckEntries",
    "JournalEntries",
  ],
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
      invalidatesTags: [
        "Users",
        "Role",
        "Company",
        "Department",
        "Location",
        "AP",
        "VAT",
        "ATC",
        "SupplierType",
        "Supplier",
        "DocumentType",
        "AccountNumber",
        "Transaction",
        "Logs",
        "TaxComputation",
        "GTAG",
        "VPCheckNumber",
        "SingleCheck",
        "SingleJournal",
        "CheckEntries",
        "JournalEntries",
      ],
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
    importCompany: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/company`,
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
    importDepartment: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/department`,
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
    importLocation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/location`,
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
    importAP: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/ap`,
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
    vat: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/vat`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["VAT"],
    }),
    createVAT: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/vat`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["VAT"],
    }),
    importVAT: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/vat`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["VAT"],
    }),
    updateVAT: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/vat/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["VAT"],
    }),
    archiveVAT: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/vat/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["VAT"],
    }),
    atc: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/atc`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["ATC"],
    }),
    createATC: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/atc`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ATC"],
    }),
    importATC: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/atc`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ATC"],
    }),
    updateATC: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/atc/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["ATC"],
    }),
    archiveATC: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/atc/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["ATC"],
    }),
    supplierType: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier-type`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["SupplierType"],
    }),
    createSupplierType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier-type`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SupplierType"],
    }),
    importSupplierType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `import/supplier-type`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SupplierType"],
    }),
    updateSupplierType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier-type/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["SupplierType"],
    }),
    archiveSupplierType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/supplier-type/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["SupplierType"],
    }),
    supplier: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Supplier"],
    }),
    createSupplier: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Supplier"],
    }),
    importSupplier: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/supplier`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Supplier"],
    }),
    updateSupplier: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Supplier"],
    }),
    archiveSupplier: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/supplier/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Supplier"],
    }),
    documentType: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/document-type`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["DocumentType"],
    }),
    createDocumentType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/document-type`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DocumentType"],
    }),
    importDocumentType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/document-type`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DocumentType"],
    }),
    updateDocumentType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/document-type/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["DocumentType"],
    }),
    archiveDocumentType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/document-type/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["DocumentType"],
    }),

    accountNumber: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/account-number`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["AccountNumber"],
    }),
    createAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/account-number`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountNumber"],
    }),
    importAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/account-number`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountNumber"],
    }),
    updateAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/account-number/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AccountNumber"],
    }),
    archiveAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/account-number/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["AccountNumber"],
    }),
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
      invalidatesTags: ["AccountTitles"],
    }),
    importAccountTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/coa`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountTitles"],
    }),
    updateAccountTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/coa/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AccountTitles"],
    }),
    archiveAccountTitles: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/coa/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["AccountTitles"],
    }),
    tagMonthYear: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/gtag/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["GTAG"],
    }),
    vpCheckNumber: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check-vp/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["VPCheckNumber"],
    }),
    vpJournalNumber: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/journal-vp/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["VPJournalNumber"],
    }),
    transaction: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Transaction"],
    }),
    createTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Transaction", "GTAG", "VPCheckNumber"],
    }),
    updateTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Transaction", "Logs", "VPCheckNumber"],
    }),
    archiveTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archived/transaction/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Transaction", "Logs", "VPCheckNumber"],
    }),
    receiveTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/received/transaction/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Transaction", "Logs", "VPCheckNumber"],
    }),
    returnTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/returned/transaction/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Transaction", "Logs", "VPCheckNumber"],
    }),
    tagYearMonth: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `tag-year/transaction`,
        method: "GET",
        params: payload,
      }),
    }),
    statusLogs: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `status-log`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Logs"],
    }),

    taxComputation: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-tax`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["TaxComputation"],
    }),
    createTaxComputation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-tax`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["TaxComputation", "VPCheckNumber", "VPJournalNumber"],
    }),
    updateTaxComputation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-tax/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["TaxComputation", "VPCheckNumber", "VPJournalNumber"],
    }),

    checkEntries: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-check`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CheckEntries"],
    }),
    createCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-check`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SingleCheck", "CheckEntries", "Logs"],
    }),
    updateCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-check/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["SingleCheck", "CheckEntries", "Logs"],
    }),
    archiveCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/transaction-check/${payload.id}`,
        method: "PATCH",
        params: payload,
      }),
      invalidatesTags: ["SingleCheck", "CheckEntries"],
    }),
    returnCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/returned/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SingleCheck", "CheckEntries", "Logs"],
    }),
    approveCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SingleCheck", "CheckEntries", "Logs"],
    }),
    checkedCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/checked/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "VPCheckNumber"],
    }),
    journalEntries: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-journal`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["JournalEntries"],
    }),
    createJournalEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-journal`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["JournalEntries", "Logs", "VPJournalNumber"],
    }),
    updateJournalEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-journal/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["SingleJournal", "JournalEntries", "Logs"],
    }),
    archiveJournalEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/transaction-journal/${payload.id}`,
        method: "PATCH",
        params: payload,
      }),
      invalidatesTags: ["SingleCheck", "JournalEntries"],
    }),
    returnJournalEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/returned/transaction-journal/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SingleCheck", "JournalEntries", "Logs"],
    }),
    approveJournalEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/transaction-journal/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SingleCheck", "JournalEntries", "Logs"],
    }),
    checkedJVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/checked/transaction-journal/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["JournalEntries", "Logs", "VPJournalNumber"],
    }),
    checkTransaction: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/single-check`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["SingleCheck"],
    }),
    journalTransaction: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/single-journal`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["SingleJournal"],
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
  useImportCompanyMutation,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useArchiveCompanyMutation,

  useDepartmentQuery,
  useCreateDepartmentMutation,
  useImportDepartmentMutation,
  useUpdateDepartmentMutation,
  useArchiveDepartmentMutation,

  useLocationQuery,
  useCreateLocationMutation,
  useImportLocationMutation,
  useUpdateLocationMutation,
  useArchiveLocationMutation,

  useApQuery,
  useCreateAPMutation,
  useImportAPMutation,
  useUpdateAPMutation,
  useArchiveAPMutation,

  useVatQuery,
  useCreateVATMutation,
  useImportVATMutation,
  useUpdateVATMutation,
  useArchiveVATMutation,

  useAtcQuery,
  useCreateATCMutation,
  useImportATCMutation,
  useUpdateATCMutation,
  useArchiveATCMutation,

  useSupplierTypeQuery,
  useCreateSupplierTypeMutation,
  useImportSupplierTypeMutation,
  useUpdateSupplierTypeMutation,
  useArchiveSupplierTypeMutation,

  useSupplierQuery,
  useCreateSupplierMutation,
  useImportSupplierMutation,
  useUpdateSupplierMutation,
  useArchiveSupplierMutation,

  useDocumentTypeQuery,
  useCreateDocumentTypeMutation,
  useImportDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
  useArchiveDocumentTypeMutation,

  useTagMonthYearQuery,

  useAccountNumberQuery,
  useCreateAccountNumberMutation,
  useArchiveAccountNumberMutation,
  useUpdateAccountNumberMutation,
  useImportAccountNumberMutation,

  useAccountTitlesQuery,
  useCreateAccountTitlesMutation,
  useArchiveAccountTitlesMutation,
  useImportAccountTitlesMutation,
  useUpdateAccountTitlesMutation,

  useTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useArchiveTransactionMutation,
  useReceiveTransactionMutation,
  useReturnTransactionMutation,

  useTagYearMonthQuery,
  useVpCheckNumberQuery,
  useVpJournalNumberQuery,

  useStatusLogsQuery,

  useTaxComputationQuery,
  useCreateTaxComputationMutation,
  useUpdateTaxComputationMutation,

  useCheckEntriesQuery,
  useCreateCheckEntriesMutation,
  useUpdateCheckEntriesMutation,
  useArchiveCheckEntriesMutation,
  useReturnCheckEntriesMutation,
  useApproveCheckEntriesMutation,

  useJournalEntriesQuery,
  useCreateJournalEntriesMutation,
  useUpdateJournalEntriesMutation,
  useArchiveJournalEntriesMutation,
  useReturnJournalEntriesMutation,
  useApproveJournalEntriesMutation,

  useCheckTransactionQuery,
  useJournalTransactionQuery,

  useCheckedCVoucherMutation,
  useCheckedJVoucherMutation,
} = jsonServerAPI;

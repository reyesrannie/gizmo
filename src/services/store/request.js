import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = process.env.REACT_APP_API_KEY;
// const baseURL = "http://10.10.12.10:8000/api/";

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
    "CountTransaction",
    "CountCheck",
    "CountVoucher",
    "CutOFF",
    "SchedTransact",
    "CountSchedule",
    "ScheduleLogs",
    "TagYear",
    "CountTreasury",
    "DebitMemo",
  ],
  endpoints: (builder) => ({
    //Authentication and users
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
        "AccountTitles",
        "GTAG",
        "VPCheckNumber",
        "VPJournalNumber",
        "SingleCheck",
        "SingleJournal",
        "CheckEntries",
        "JournalEntries",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
        "CutOFF",
        "SchedTransact",
        "CountSchedule",
        "ScheduleLogs",
        "CountTreasury",
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
    }),
    updateUser: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/auth/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveUser: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/auth/archived/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
    //end of Authentication

    //Roles
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
    }),
    updateRole: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/role/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveRole: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/role/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //Company
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

    //Department
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

    //Location
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
    }),
    importLocation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/location`,
        method: "POST",
        body: payload,
      }),
    }),
    updateLocation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/location/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveLocation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/location/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //AP
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
    }),
    importAP: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/ap`,
        method: "POST",
        body: payload,
      }),
    }),
    updateAP: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/ap_tagging/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveAP: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/ap/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //VAT
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
    }),
    importVAT: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/vat`,
        method: "POST",
        body: payload,
      }),
    }),
    updateVAT: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/vat/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveVAT: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/vat/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //ATC
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
    }),
    importATC: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/atc`,
        method: "POST",
        body: payload,
      }),
    }),
    updateATC: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/atc/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveATC: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/atc/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //SupplierType
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
    }),
    importSupplierType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `import/supplier-type`,
        method: "POST",
        body: payload,
      }),
    }),
    updateSupplierType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier-type/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveSupplierType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/supplier-type/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //Supplier
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
    }),
    importSupplier: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/supplier`,
        method: "POST",
        body: payload,
      }),
    }),
    updateSupplier: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/supplier/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveSupplier: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/supplier/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //DocumentType
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
    }),
    importDocumentType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/document-type`,
        method: "POST",
        body: payload,
      }),
    }),
    updateDocumentType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/document-type/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveDocumentType: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/document-type/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //Account Number
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
    }),
    importAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/account-number`,
        method: "POST",
        body: payload,
      }),
    }),
    updateAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/account-number/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    archiveAccountNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/account-number/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    //Account Title
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

    //GTAG
    tagMonthYear: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/gtag/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["GTAG"],
    }),

    //VP Check
    vpCheckNumber: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check-vp/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["VPCheckNumber"],
    }),

    //VP Journal
    vpJournalNumber: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/journal-vp/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["VPJournalNumber"],
    }),

    //Transaction
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
      invalidatesTags: [
        "Transaction",
        "GTAG",
        "VPCheckNumber",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    approveTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/transaction/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "Transaction",
        "GTAG",
        "VPCheckNumber",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    updateTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [
        "Transaction",
        "Logs",
        "VPCheckNumber",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    archiveTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archived/transaction/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "Transaction",
        "Logs",
        "VPCheckNumber",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    receiveTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/received/transaction/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "Transaction",
        "Logs",
        "VPCheckNumber",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    returnTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/returned/transaction/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "Transaction",
        "Logs",
        "VPCheckNumber",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    readTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/is-read/transaction/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),

    //Tag Series
    tagYearMonth: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `tag-year/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["TagYear"],
    }),

    //Status Logs
    statusLogs: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `status-log`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Logs"],
    }),

    statusScheduleLogs: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `schedule-log`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["ScheduleLogs"],
    }),

    //Tax Computation
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
    archiveTaxComputation: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/transaction-tax/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["TaxComputation", "VPCheckNumber", "VPJournalNumber"],
    }),

    //Check
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
      invalidatesTags: [
        "SingleCheck",
        "CheckEntries",
        "Logs",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    updateCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-check/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [
        "SingleCheck",
        "CheckEntries",
        "Logs",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    archiveCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/transaction-check/${payload.id}`,
        method: "PATCH",
        params: payload,
      }),
      invalidatesTags: [
        "SingleCheck",
        "CheckEntries",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    returnCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/returned/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "SingleCheck",
        "CheckEntries",
        "Logs",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    approveCheckEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "SingleCheck",
        "CheckEntries",
        "Logs",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
        "VPCheckNumber",
      ],
    }),
    checkedCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/checked/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "CheckEntries",
        "Logs",
        "VPCheckNumber",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    voidCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/for-voiding/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck"],
    }),
    voidedCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/voided/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck"],
    }),

    prepareCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/preparation/transaction-check`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),
    forApprovalCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check-approval/transaction-check`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),
    releaseCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/releasing/transaction-check`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),
    releasedCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/released/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),
    clearCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/clearing/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),
    fileCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/filing/transaction-check/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),
    readTransactionCheck: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/is-read/transaction-check/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),

    printCVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/is-print/transaction-check/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),

    updateCheckDate: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/update-releasing/transaction-check/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckEntries", "Logs", "CountCheck", "CountTreasury"],
    }),

    //Journal
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
      invalidatesTags: [
        "JournalEntries",
        "Logs",
        "VPJournalNumber",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    updateJournalEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-journal/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [
        "SingleJournal",
        "JournalEntries",
        "Logs",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    archiveJournalEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archive/transaction-journal/${payload.id}`,
        method: "PATCH",
        params: payload,
      }),
      invalidatesTags: [
        "SingleCheck",
        "JournalEntries",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    returnJournalEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/returned/transaction-journal/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "SingleCheck",
        "JournalEntries",
        "Logs",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),
    approveJournalEntries: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/transaction-journal/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "SingleCheck",
        "JournalEntries",
        "Logs",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
        "VPJournalNumber",
      ],
    }),

    checkedJVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/checked/transaction-journal/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "JournalEntries",
        "Logs",
        "VPJournalNumber",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
      ],
    }),

    voidJVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/for-voiding/transaction-journal/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["JournalEntries", "Logs", "CountVoucher"],
    }),
    voidedJVoucher: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/voided/transaction-journal/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["JournalEntries", "Logs", "CountVoucher"],
    }),

    readTransactionJournal: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/is-read/transaction-journal/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["JournalEntries", "Logs", "CountVoucher"],
    }),

    //Check
    checkTransaction: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/single-check`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["SingleCheck"],
    }),

    //Journal
    journalTransaction: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/single-journal`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["SingleJournal"],
    }),

    //Count Transaction
    transactCount: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-count/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CountTransaction"],
    }),

    //Check Count
    checkCount: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check-count/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CountCheck"],
    }),

    //Journal Count
    journalCount: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/journal-count/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CountVoucher"],
    }),

    //Treasury Count
    treasuryCount: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/treasury-count/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CountTreasury"],
    }),

    //cutoff
    cutOff: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cut-off`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CutOFF"],
    }),
    createCutOff: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cut-off`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CutOFF", "CutOFFLogs"],
    }),
    updateCutOff: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cut-off/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CutOFF", "CutOFFLogs"],
    }),
    approveCutOff: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/cut-off/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CutOFF", "CutOFFLogs", "TagYear"],
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

    //scheduled Transaction
    schedTransaction: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/schedule`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["SchedTransact"],
    }),
    createScheduleTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/schedule`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    updateScheduleTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/schedule/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    receiveScheduleTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/received/schedule/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    checkedScheduleTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/checked/schedule/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    approveSchedTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approved/schedule/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    returnSchedTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/returned/schedule/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    resetSchedTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/reset/schedule/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
    }),
    generateTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/generate-transaction/schedule`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "SchedTransact",
        "SingleCheck",
        "CheckEntries",
        "Logs",
        "Transaction",
        "CountTransaction",
        "CountCheck",
        "CountVoucher",
        "CountSchedule",
        "ScheduleLogs",
      ],
    }),
    completeSchedTransaction: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/completed/schedule/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchedTransact", "CountSchedule", "ScheduleLogs"],
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

    // report
    report: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-report/transaction/`,
        method: "GET",
        params: payload,
      }),
    }),
    checkNumber: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CheckNumber"],
    }),

    importChecks: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/import/check`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckNumber"],
    }),

    createCheckNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckNumber"],
    }),
    updateCheckNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/check/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CheckNumber"],
    }),
    archiveCheckNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/archived/check/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["CheckNumber"],
    }),

    voidCheckNumber: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cancelled/check/${payload?.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CheckNumber"],
    }),

    debitMemo: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/debit-memo`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["DebitMemo"],
    }),
    clearDebitMemo: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cleared/debit-memo`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DebitMemo"],
    }),
    returnDebitMemo: builder.mutation({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cancelled/debit-memo/${payload.id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DebitMemo"],
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

  useTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useArchiveTransactionMutation,
  useReceiveTransactionMutation,
  useReturnTransactionMutation,
  useApproveTransactionMutation,
  useReadTransactionMutation,

  useTagYearMonthQuery,
  useVpCheckNumberQuery,
  useVpJournalNumberQuery,

  useStatusLogsQuery,
  useStatusScheduleLogsQuery,

  useTaxComputationQuery,
  useCreateTaxComputationMutation,
  useUpdateTaxComputationMutation,
  useArchiveTaxComputationMutation,

  useCheckEntriesQuery,
  useLazyCheckEntriesQuery,
  useCreateCheckEntriesMutation,
  useUpdateCheckEntriesMutation,
  useArchiveCheckEntriesMutation,
  useReturnCheckEntriesMutation,
  useApproveCheckEntriesMutation,
  useVoidCVoucherMutation,
  useVoidedCVoucherMutation,
  usePrepareCVoucherMutation,
  useForApprovalCVoucherMutation,
  useReleaseCVoucherMutation,
  useReleasedCVoucherMutation,
  useClearCVoucherMutation,
  useFileCVoucherMutation,
  useReadTransactionCheckMutation,
  useUpdateCheckDateMutation,
  usePrintCVoucherMutation,

  useJournalEntriesQuery,
  useCreateJournalEntriesMutation,
  useUpdateJournalEntriesMutation,
  useArchiveJournalEntriesMutation,
  useReturnJournalEntriesMutation,
  useApproveJournalEntriesMutation,
  useVoidJVoucherMutation,
  useVoidedJVoucherMutation,
  useReadTransactionJournalMutation,

  useCheckTransactionQuery,
  useJournalTransactionQuery,

  useCheckedCVoucherMutation,
  useCheckedJVoucherMutation,

  useCheckCountQuery,
  useJournalCountQuery,
  useTransactCountQuery,
  useTreasuryCountQuery,

  useCutOffQuery,
  useCreateCutOffMutation,
  useUpdateCutOffMutation,
  useApproveCutOffMutation,
  useCutOffLogsQuery,

  useSchedTransactionQuery,
  useCreateScheduleTransactionMutation,
  useUpdateScheduleTransactionMutation,
  useReceiveScheduleTransactionMutation,
  useCheckedScheduleTransactionMutation,
  useApproveSchedTransactionMutation,
  useReturnSchedTransactionMutation,
  useResetSchedTransactionMutation,
  useCompleteSchedTransactionMutation,
  useGenerateTransactionMutation,
  useCountScheduleQuery,

  useReportQuery,

  useCheckNumberQuery,
  useLazyCheckNumberQuery,
  useCreateCheckNumberMutation,
  useArchiveCheckNumberMutation,
  useUpdateCheckNumberMutation,
  useVoidCheckNumberMutation,
  useImportChecksMutation,

  useDebitMemoQuery,
  useClearDebitMemoMutation,
  useReturnDebitMemoMutation,
} = jsonServerAPI;

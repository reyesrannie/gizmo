import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseURL = process.env.REACT_APP_API_KEY;
const baseURL = "http://10.10.12.10:8000/api/";

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
    "SingleCheck",
    "SingleJournal",
    "CheckEntries",
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
    "GeneralJournal",
    "CountGJ",
    "GJLogs",
    "BeginningBalance",
    "DashboardBalance",
    "DMLogs",
    "Bank",
    "BankAccountNumber",
    "BankAccountTitle",
    "CheckDetails",
  ],
  endpoints: (builder) => ({
    // report
    report: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction-report/transaction/`,
        method: "GET",
        params: payload,
      }),
    }),
  }),
});

export const { useReportQuery } = jsonServerAPI;

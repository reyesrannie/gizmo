import { jsonServerAPI } from "../store/request";

export const reportsApi = jsonServerAPI.injectEndpoints({
  endpoints: (builder) => ({
    reportExcel: builder.query({
      query: (params) => ({
        url: `/expanded/reports`,
        method: "GET",
        params: params,
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: async (response, meta, arg) => {
        const fileName = arg.name || "default_report";
        const hiddenElement = document.createElement("a");
        const url = window.URL || window.webkitURL;
        const blobExcel = url.createObjectURL(response);

        // Set the download file name
        hiddenElement.href = blobExcel;
        hiddenElement.target = "_blank";
        hiddenElement.download = `${fileName}.xlsx`;
        hiddenElement.click();

        return null; // No data returned to the component
      },
    }),
  }),
});

export const { useLazyReportExcelQuery } = reportsApi;

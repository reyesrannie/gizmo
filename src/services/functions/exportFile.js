import { Workbook } from "exceljs";
import moment from "moment";

const generateExcel = async (sheet, data, header, apTag = null) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(sheet);

  // Add headers
  worksheet.addRow(header);

  // Add data

  data.forEach((item) => {
    const row = [];
    row.push(item.id);
    row.push(apTag === "AP" ? item.company_code : item.code);
    row.push(
      apTag === "AP"
        ? item.description
        : apTag === "Tax"
        ? item.wtax
        : item.name
    );
    row.push(moment(item.created_at).format("MMM, DD YYYY"));
    row.push(moment(item.updated_at).format("MMM, DD YYYY"));
    worksheet.addRow(row);
  });

  // Save the workbook
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${sheet}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const generateExcelwTag = async (sheet, data, header, locations, tagTitle) => {
  const workbook = new Workbook();
  const mainSheet = workbook.addWorksheet(sheet);

  // Add headers to main sheet
  mainSheet.addRow(header);

  // Add data to main sheet
  data.forEach((item) => {
    const row = [];
    row.push(item.id);
    row.push(item.code);
    row.push(item.name);
    row.push(moment(item.created_at).format("MMM, DD YYYY"));
    row.push(moment(item.updated_at).format("MMM, DD YYYY"));
    mainSheet.addRow(row);
  });

  // Create and add data to the scope_locations sheet
  const scopeLocationsSheet = workbook.addWorksheet(tagTitle);

  scopeLocationsSheet.addRow(locations);

  data.forEach((item) => {
    item.scope_locations.forEach((location) => {
      const locationRow = [];
      locationRow.push(location.id);
      locationRow.push(location.department_id);
      locationRow.push(location.location_id);
      locationRow.push(location.location_code);
      locationRow.push(moment(location.updated_at).format("MMM, DD YYYY"));
      scopeLocationsSheet.addRow(locationRow);
    });
  });

  // Save the workbook
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${sheet}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export { generateExcel, generateExcelwTag };

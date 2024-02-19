import { Workbook } from "exceljs";
import moment from "moment";

const generateExcel = async (sheet, data, header) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(sheet);

  // Add headers
  worksheet.addRow(header);

  // Add data

  data.forEach((item) => {
    const row = [];
    row.push(item.id);
    row.push(item.code);
    row.push(item.name);
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

export default generateExcel;

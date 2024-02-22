import ExcelJS from "exceljs";

const readExcelFile = async (files) => {
  if (files.length > 0) {
    const file = files[0];
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet(1);
    const headers = worksheet.getRow(1).values;
    const rows = [];
    worksheet.eachRow((row, rowNum) => {
      if (rowNum !== 1) {
        const rowData = {};
        row.eachCell((cell, colNum) => {
          rowData[headers[colNum]] = cell.value;
        });
        rows.push(rowData);
      }
    });
    return rows;
  } else {
    return null;
  }
};

export { readExcelFile };

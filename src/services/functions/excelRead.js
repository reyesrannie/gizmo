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

const readExcelFilewTag = async (files) => {
  if (files.length > 0) {
    const file = files[0];
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheetOne = workbook.getWorksheet(1);
    const worksheetTwo = workbook.getWorksheet(2);

    const headersOne = worksheetOne.getRow(1).values;
    const headersTwo = worksheetTwo.getRow(1).values;

    // Read data from worksheet one into an array
    const dataOne = [];
    worksheetOne.eachRow((row, rowNum) => {
      if (rowNum !== 1) {
        const rowData = {};
        row.eachCell((cell, colNum) => {
          rowData[headersOne[colNum]] = cell.value;
        });
        dataOne.push(rowData);
      }
    });

    // Read data from worksheet two into an array
    const dataTwo = [];
    worksheetTwo.eachRow((row, rowNum) => {
      if (rowNum !== 1) {
        const rowData = {};
        row.eachCell((cell, colNum) => {
          rowData[headersTwo[colNum]] = cell.value;
        });
        dataTwo.push(rowData);
      }
    });

    // Combine data based on matching code and dept_code
    const combinedData = dataOne.map((item) => {
      const matchedItems = dataTwo.filter((i) => i.dept_code === item.code);
      const scope_location = matchedItems.map((i) => ({
        id: i.id,
        code: i.code,
      }));
      return {
        code: item.code,
        name: item.name,
        scope_location,
      };
    });

    return combinedData;
  } else {
    return null;
  }
};

const readExcelFileSupplier = async (files) => {
  if (files.length > 0) {
    const file = files[0];
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheetOne = workbook.getWorksheet(1);
    const worksheetTwo = workbook.getWorksheet(2);
    const worksheetThree = workbook.getWorksheet(3);
    const worksheetFour = workbook.getWorksheet(4);

    const headersOne = worksheetOne.getRow(1).values;
    const headersTwo = worksheetTwo.getRow(1).values;
    const headersThree = worksheetThree.getRow(1).values;
    const headersFour = worksheetFour.getRow(1).values;

    // Read data from worksheet one into an array
    const dataOne = [];
    worksheetOne.eachRow((row, rowNum) => {
      if (rowNum !== 1) {
        const rowData = {};
        row.eachCell((cell, colNum) => {
          rowData[headersOne[colNum]] = cell.value;
        });
        dataOne.push(rowData);
      }
    });

    // Read data from worksheet two into an array
    const dataTwo = [];
    worksheetTwo.eachRow((row, rowNum) => {
      if (rowNum !== 1) {
        const rowData = {};
        row.eachCell((cell, colNum) => {
          rowData[headersTwo[colNum]] = cell.value;
        });
        dataTwo.push(rowData);
      }
    });

    const dataThree = [];
    worksheetThree.eachRow((row, rowNum) => {
      if (rowNum !== 1) {
        const rowData = {};
        row.eachCell((cell, colNum) => {
          rowData[headersThree[colNum]] = cell.value;
        });
        dataThree.push(rowData);
      }
    });

    const dataFour = [];
    worksheetFour.eachRow((row, rowNum) => {
      if (rowNum !== 1) {
        const rowData = {};
        row.eachCell((cell, colNum) => {
          rowData[headersFour[colNum]] = cell.value;
        });
        dataFour.push(rowData);
      }
    });

    const combinedData = dataOne.map((item) => {
      const matchedItemsTwo = dataTwo.filter((i) => i.tin === item.tin);
      const matchedItemsThree = dataThree.filter((i) => i.tin === item.tin);
      const matchedItemsFour = dataFour.filter((i) => i.tin === item.tin);

      const supplier_atcs = [];
      const supplier_types = [];
      const supplier_vats = [];

      matchedItemsTwo.forEach((i) => {
        supplier_atcs.push({
          id: i.id,
          code: i.code,
        });
      });
      matchedItemsThree.forEach((i) => {
        supplier_types.push({
          id: i.id,
          code: i.code,
        });
      });
      matchedItemsFour.forEach((i) => {
        supplier_vats.push({
          id: i.id,
          code: i.code,
        });
      });

      return {
        company_name: item.company,
        company_address: item.address,
        tin: item.tin,
        proprietor: item.proprietor || "",
        supplier_atcs,
        supplier_types,
        supplier_vats,
      };
    });

    return combinedData;
  } else {
    return null;
  }
};

export { readExcelFile, readExcelFilewTag, readExcelFileSupplier };

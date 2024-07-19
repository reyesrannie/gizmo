import { Workbook } from "exceljs";
import moment from "moment";
import {
  columnTotal,
  footer,
  footerAtc,
  titleFirstHeader,
  titleHeader,
  titleHeaderATC,
} from "../constants/headers";
import { AdditionalFunction } from "./AdditionalFunction";
import { getAllATC, getAllSupplier } from "./toArrayFn";

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
  mainSheet.addRow(header);

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

const generateExcelwSupplier = async (sheet, data, header) => {
  const workbook = new Workbook();
  const mainSheet = workbook.addWorksheet(sheet);

  // Add headers to main sheet
  mainSheet.addRow(header);

  // Add data to main sheet
  data.forEach((item) => {
    const row = [];
    row.push(item.id);
    row.push(item.company_name);
    row.push(item.company_address);
    row.push(item.tin);
    row.push(item.proprietor);
    row.push(moment(item.updated_at).format("MMM, DD YYYY"));
    mainSheet.addRow(row);
  });

  // Create and add data to the scope_locations sheet
  const atcSheet = workbook.addWorksheet("ATC");
  atcSheet.addRow(["ID", "CODE", "SUPPLIER ID", "DATE MODIFIED"]);
  data.forEach((item) => {
    item.supplier_atcs.forEach((atc) => {
      const atcRow = [];
      atcRow.push(atc.atc_id);
      atcRow.push(atc.atc_code);
      atcRow.push(atc.supplier_id);
      atcRow.push(moment(atc.updated_at).format("MMM, DD YYYY"));
      atcSheet.addRow(atcRow);
    });
  });

  const typeSheet = workbook.addWorksheet("Supplier Type");
  typeSheet.addRow(["ID", "CODE", "SUPPLIER ID", "DATE MODIFIED"]);
  data.forEach((item) => {
    item.supplier_types.forEach((type) => {
      const typeRow = [];
      typeRow.push(type.type_id);
      typeRow.push(type.type_code);
      typeRow.push(type.supplier_id);
      typeRow.push(moment(type.updated_at).format("MMM, DD YYYY"));
      typeSheet.addRow(typeRow);
    });
  });

  const vatSheet = workbook.addWorksheet("Vat");
  vatSheet.addRow(["ID", "CODE", "SUPPLIER ID", "DATE MODIFIED"]);
  data.forEach((item) => {
    item.supplier_vats.forEach((vat) => {
      const vatRow = [];
      vatRow.push(vat.vat_id);
      vatRow.push(vat.vat_code);
      vatRow.push(vat.supplier_id);
      vatRow.push(moment(vat.updated_at).format("MMM, DD YYYY"));
      vatSheet.addRow(vatRow);
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

const generateExcelAccount = async (sheet, data, header) => {
  const workbook = new Workbook();
  const mainSheet = workbook.addWorksheet(sheet);
  mainSheet.addRow(header);

  data.forEach((item) => {
    const row = [];
    row.push(item?.id);
    row.push(item?.account_no);
    row.push(item?.location?.name);
    row.push(item?.supplier?.company_name);
    row.push(moment(item.created_at).format("MMM, DD YYYY"));
    row.push(moment(item.updated_at).format("MMM, DD YYYY"));
    mainSheet.addRow(row);
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

const generateExcelReport = async (report, menuData, sheet) => {
  const year = Math.floor(menuData?.tag_year / 100); // Extract the year
  const month = menuData?.tag_year % 100;
  const date = moment(`${year}-${month}`, "YYYY-MM");

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(`${sheet} Report`);

  worksheet.getCell("A2").value = "RDF FEED, LIVESTOCK & FOODS, INC";
  worksheet.getCell("A3").value = date.format("MMMM YYYY");

  columnTotal.forEach((column) => {
    const cell = worksheet.getCell(`${column}3`);
    cell.value = {
      formula: `SUM(${column}7:${column}${report?.result?.length + 6})`,
      result: parseFloat(cell.value) || 0,
    };
    cell.numFmt = "#,##0.00";
  });

  titleFirstHeader?.map((title, index) => {
    const cell = worksheet.getCell(4, index + 1);
    cell.value = title?.toString();
  });
  titleHeader?.map((title, index) => {
    const cell = worksheet.getCell(6, index + 1);
    cell.value = title?.name?.toString();
    const minWidth = Math.max(title?.min, 20);
    worksheet.getColumn(index + 1).width = minWidth;
  });

  report?.result?.forEach((item, index) => {
    const vatValue = {
      nvat_local: item?.nvat_local,
      nvat_service: item?.nvat_service,
      vat_local: item?.vat_local,
      vat_service: item?.vat_service,
    };

    const align = {
      vertical: "middle",
      horizontal: "center",
    };
    const right = {
      vertical: "middle",
      horizontal: "right",
    };

    const taxBased = Object.keys(vatValue).find((key) => vatValue[key] !== 0);
    const rows = worksheet.getRow(index + 7);
    const row = [];
    row.push(
      `${item?.transactions?.apTagging?.company_code} - ${item?.transactions?.apTagging?.description}`
    );
    row.push(item?.transactions?.supplier?.tin);
    row.push(item?.transactions?.supplier?.company_name);
    row.push(item?.transactions?.supplier?.company_address);
    row.push(item?.coa?.name);
    row.push(item?.transactions?.description);
    row.push(
      `${item?.transactions?.documentType?.code} ${item?.transactions?.invoice_no}`
    );
    row.push(moment(item?.transactions?.date_invoice)?.format("MMMM DD, YYYY"));
    row.push(item?.location?.name);
    row.push(`${item?.transactions?.tag_year} - ${item?.transactions?.tag_no}`);
    row.push(
      item?.voucher === "check"
        ? item?.transactions?.transactionChecks?.voucher_number
        : item?.transactions?.transactionJournals?.voucher_number
    );
    //atc
    row.push(item?.atc?.code);
    row.push(item?.amount);
    row.push(vatValue[taxBased] || 0);
    row.push(item?.wtax_payable_cr);
    row.push(item?.supplierType?.wtax);
    row.push(vatValue[taxBased] || 0);
    row.push(item?.wtax_payable_cr);

    rows.values = row;
    rows.font = {
      name: "Century Gothic",
      size: 10,
      bold: false,
    };

    const columnsToAlign = [8, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    columnsToAlign.forEach((col) => {
      try {
        const cell = worksheet.getCell(index + 7, col);
        const cellValue = parseFloat(cell.value);
        if (!isNaN(cellValue) && col !== 10) {
          cell.value = cellValue;
          cell.numFmt = "#,##0.00";
        }
        if (!isNaN(cellValue) && col === 16) {
          cell.value = cellValue / 100;
          cell.numFmt = "0%";
        }
        cell.alignment = col >= 13 ? right : align;
      } catch (error) {
        console.error(
          `Error processing cell at row ${index + 7}, col ${col}:`,
          error
        );
      }
    });
  });

  worksheet.mergeCells("Q4:R5");
  worksheet.getCell("Q4").value = "GRAND TOTAL";

  for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 18; col++) {
      const cell = worksheet.getCell(row, col);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFFFF" },
      };
      cell.font = {
        name: "Century Gothic",
        size: 10,
        bold: true,
      };
    }
  }

  for (let row = 4; row <= 6; row++) {
    for (let col = 1; col <= 16; col++) {
      const cell = worksheet.getCell(row, col);

      cell.font = {
        name: "Century Gothic",
        size: 10,
        bold: true,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF99cc00" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      if (row === 4) {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      }
      if (row === 5) {
        cell.border = {
          left: { style: "thin" },
          right: { style: "thin" },
        };
      }
      if (row === 6) {
        cell.border = {
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      }

      for (let row = 4; row <= 6; row++) {
        for (let col = 17; col <= 18; col++) {
          const cell = worksheet.getCell(row, col);
          if (row === 4) {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            };
          }
          if (row === 5) {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            };
          }
          if (row === 6) {
            cell.border = {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            };
          }

          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFc0c0c0" },
          };
          cell.font = {
            name: "Century Gothic",
            size: 10,
            bold: true,
          };
        }
      }
    }
  }

  const generateDots = (length) => ".".repeat(length);

  let count = 0;

  footer?.forEach((item, index) => {
    const cell = worksheet.getCell(report?.result?.length + 7, index + 1);
    cell.font = {
      name: "Century Gothic",
      size: 10,
      bold: true,
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFc0c0c0" },
    };
    if (item === "Total") {
      cell.value = item;
    } else if (item === "SUM") {
      cell.value = {
        formula: `SUM(${columnTotal[count]}7:${columnTotal[count]}${
          report?.result?.length + 6
        })`,
        result: parseFloat(cell.value) || 0,
      };
      cell.numFmt = "#,##0.00";
      count++;
    } else {
      cell.value = generateDots(1000);
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${sheet} Report.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const generateExcelReportPerATC = async (report, menuData, sheet) => {
  const atcReport = getAllATC(report);
  const year = Math.floor(menuData?.tag_year / 100); // Extract the year
  const month = menuData?.tag_year % 100;
  const date = moment(`${year}-${month}`, "YYYY-MM");

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(`${sheet} Report`);

  worksheet.getCell("A2").value = "RDF FEED, LIVESTOCK & FOODS, INC";
  worksheet.getCell("A3").value = date.format("MMMM YYYY");

  titleHeaderATC?.map((title, index) => {
    const cell = worksheet.getCell(4, index + 1);
    cell.value = title?.name?.toString();
    const minWidth = Math.max(title?.min, 20);
    worksheet.getColumn(index + 1).width = minWidth;
  });

  atcReport?.forEach((item, index) => {
    const rows = worksheet.getRow(index + 5);
    const row = [];
    row.push(item?.code);
    row.push(item?.amount);
    row.push(item?.wtax);
    rows.values = row;
    rows.font = {
      name: "Century Gothic",
      size: 10,
      bold: false,
    };

    const percentDecimal = parseFloat(item?.percent.replace("%", "")) / 100;

    const cellTotal = worksheet.getCell(`A${atcReport?.length + 5}`);
    cellTotal.value = "Total";
    cellTotal.font = {
      name: "Century Gothic",
      size: 10,
      bold: true,
    };
    cellTotal.border = {
      top: { style: "thin" },
      bottom: { style: "double" },
    };

    const cellTotalB = worksheet.getCell(`B${atcReport?.length + 5}`);
    cellTotalB.value = "Total";
    cellTotalB.font = {
      name: "Century Gothic",
      size: 10,
      bold: true,
    };
    cellTotalB.border = {
      top: { style: "thin" },
      bottom: { style: "double" },
    };
    cellTotalB.value = {
      formula: `SUM(B5:B${atcReport?.length + 4})`,
      result: parseFloat(item?.amount) || 0,
    };
    cellTotalB.numFmt = "#,##0.00";

    const cellTotalC = worksheet.getCell(`C${atcReport?.length + 5}`);
    cellTotalC.value = "Total";
    cellTotalC.font = {
      name: "Century Gothic",
      size: 10,
      bold: true,
    };
    cellTotalC.border = {
      top: { style: "thin" },
      bottom: { style: "double" },
    };
    cellTotalC.value = {
      formula: `SUM(C5:C${atcReport?.length + 4})`,
      result: parseFloat(item?.amount) || 0,
    };
    cellTotalC.numFmt = "#,##0.00";

    const cellD = worksheet.getCell(`D${index + 5}`);
    cellD.value = {
      formula: `+B${index + 5}*${percentDecimal}`,
      result: parseFloat(item?.amount) || 0,
    };
    cellD.numFmt = "#,##0.00";

    const cellE = worksheet.getCell(`E${index + 5}`);
    cellE.value = {
      formula: `+C${index + 5}-D${index + 5}`,
      result: parseFloat(item?.amount) || 0,
    };
    cellE.numFmt = "#,##0.00";

    const columnsToAlign = [2, 3, 4, 5, 6, 7];
    columnsToAlign.forEach((col) => {
      try {
        const cell = worksheet.getCell(index + 5, col);
        const cellValue = parseFloat(cell.value);
        if (!isNaN(cellValue)) {
          cell.value = cellValue;
          cell.numFmt = "#,##0.00";
        }
      } catch (error) {
        console.error(
          `Error processing cell at row ${index + 7}, col ${col}:`,
          error
        );
      }
    });
  });

  for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 5; col++) {
      const cell = worksheet.getCell(row, col);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFFFF" },
      };
      cell.font = {
        name: "Century Gothic",
        size: 10,
        bold: true,
      };
    }
  }

  for (let row = 4; row <= 4; row++) {
    for (let col = 1; col <= 5; col++) {
      const cell = worksheet.getCell(row, col);

      cell.font = {
        name: "Century Gothic",
        size: 10,
        bold: true,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF99cc00" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${sheet} Report.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const generateExcelReportPerSup = async (report, menuData, sheet) => {
  const supplierReport = getAllSupplier(report);

  const year = Math.floor(menuData?.tag_year / 100); // Extract the year
  const month = menuData?.tag_year % 100;
  const date = moment(`${year}-${month}`, "YYYY-MM");

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(`${sheet} Report`);

  worksheet.getCell("A2").value = "RDF FEED, LIVESTOCK & FOODS, INC";
  worksheet.getCell("A3").value = date.format("MMMM YYYY");

  columnTotal.forEach((column) => {
    const cell = worksheet.getCell(`${column}3`);
    cell.value = {
      formula: `SUM(${column}7:${column}${supplierReport?.length + 6})`,
      result: parseFloat(cell.value) || 0,
    };
    cell.numFmt = "#,##0.00";
  });

  titleFirstHeader?.map((title, index) => {
    const cell = worksheet.getCell(4, index + 1);
    cell.value = title?.toString();
  });
  titleHeader?.map((title, index) => {
    const cell = worksheet.getCell(6, index + 1);
    cell.value = title?.name?.toString();
    const minWidth = Math.max(title?.min, 20);
    worksheet.getColumn(index + 1).width = minWidth;
  });

  const align = {
    vertical: "middle",
    horizontal: "center",
  };
  const right = {
    vertical: "middle",
    horizontal: "right",
  };

  supplierReport?.forEach((item, index) => {
    const rows = worksheet.getRow(index + 7);
    const row = [];
    row.push(`${item?.source?.company_code} - ${item?.source?.description}`);
    row.push(item?.code?.tin);
    row.push(item?.code?.company_name);
    row.push(item?.code?.company_address);
    row.push(item?.coa?.name);
    row.push(item?.description);
    row.push(item?.inv);
    row.push(moment(item?.date_invoice)?.format("MMMM DD, YYYY"));
    row.push(item?.location?.name);
    row.push(item?.tag_no);
    row.push(item?.voucher_number);
    row.push(item?.atc);
    row.push(item?.amount);
    row.push(item?.taxBased);
    row.push(item?.wtax);
    row.push(item?.rate);
    row.push(item?.taxBased);
    row.push(item?.wtax);

    rows.values = row;
    rows.font = {
      name: "Century Gothic",
      size: 10,
      bold: false,
    };

    const columnsToAlign = [8, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    columnsToAlign.forEach((col) => {
      try {
        const cell = worksheet.getCell(index + 7, col);
        const cellValue = parseFloat(cell.value);
        if (!isNaN(cellValue) && col !== 10) {
          cell.value = cellValue;
          cell.numFmt = "#,##0.00";
        }
        if (!isNaN(cellValue) && col === 16) {
          cell.value = cellValue / 100;
          cell.numFmt = "0%";
        }
        cell.alignment = col >= 13 ? right : align;
      } catch (error) {
        console.error(
          `Error processing cell at row ${index + 7}, col ${col}:`,
          error
        );
      }
    });
  });

  worksheet.mergeCells("Q4:R5");
  worksheet.getCell("Q4").value = "GRAND TOTAL";

  for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 18; col++) {
      const cell = worksheet.getCell(row, col);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFFFF" },
      };
      cell.font = {
        name: "Century Gothic",
        size: 10,
        bold: true,
      };
    }
  }

  for (let row = 4; row <= 6; row++) {
    for (let col = 1; col <= 16; col++) {
      const cell = worksheet.getCell(row, col);

      cell.font = {
        name: "Century Gothic",
        size: 10,
        bold: true,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF99cc00" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      if (row === 4) {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      }
      if (row === 5) {
        cell.border = {
          left: { style: "thin" },
          right: { style: "thin" },
        };
      }
      if (row === 6) {
        cell.border = {
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      }

      for (let row = 4; row <= 6; row++) {
        for (let col = 17; col <= 18; col++) {
          const cell = worksheet.getCell(row, col);
          if (row === 4) {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            };
          }
          if (row === 5) {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            };
          }
          if (row === 6) {
            cell.border = {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            };
          }

          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFc0c0c0" },
          };
          cell.font = {
            name: "Century Gothic",
            size: 10,
            bold: true,
          };
        }
      }
    }
  }

  const generateDots = (length) => ".".repeat(length);

  let count = 0;

  footer?.forEach((item, index) => {
    const cell = worksheet.getCell(supplierReport?.length + 7, index + 1);
    cell.font = {
      name: "Century Gothic",
      size: 10,
      bold: true,
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFc0c0c0" },
    };
    if (item === "Total") {
      cell.value = item;
    } else if (item === "SUM") {
      cell.value = {
        formula: `SUM(${columnTotal[count]}7:${columnTotal[count]}${
          supplierReport?.length + 6
        })`,
        result: parseFloat(cell.value) || 0,
      };
      cell.numFmt = "#,##0.00";
      count++;
    } else {
      cell.value = generateDots(1000);
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${sheet} Report.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export {
  generateExcel,
  generateExcelwTag,
  generateExcelwSupplier,
  generateExcelAccount,
  generateExcelReport,
  generateExcelReportPerATC,
  generateExcelReportPerSup,
};

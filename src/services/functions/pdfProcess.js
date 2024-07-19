import { PDFDocument, rgb } from "pdf-lib";

import pdfFileAsset from "../../assets/pdf/2307.pdf";
import moment from "moment";
import { formConst } from "../constants/formConst";

const getStartQuarter = (quarter, year) => {
  if (quarter === 1) {
    return new Date(`01-01-${year}`);
  } else if (quarter === 2) {
    return new Date(`04-01-${year}`);
  } else if (quarter === 3) {
    return new Date(`07-01-${year}`);
  } else if (quarter === 4) {
    return new Date(`10-01-${year}`);
  }
};

const getEndQuarter = (quarter, year) => {
  if (quarter === 1) {
    return new Date(`03-31-${year}`);
  } else if (quarter === 2) {
    return new Date(`06-30-${year}`);
  } else if (quarter === 3) {
    return new Date(`09-30-${year}`);
  } else if (quarter === 4) {
    return new Date(`12-31-${year}`);
  }
};

const getMonth = (month) => {
  if (month === 1) {
    return 226;
  } else if (month === 2) {
    return 300;
  } else if (month === 3) {
    return 374;
  }
};

const addDoubleSpaces = (text) => {
  return text?.split("").join("  ");
};

const addressCount = (text) => {
  return text.split(" ");
};

const convertToPeso = (value) => {
  return parseFloat(value)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const joinAddressParts = (addressParts, startIndex, endIndex) => {
  const joinedParts = addressParts.slice(startIndex, endIndex).join(" ");
  const remainingParts = addressParts.slice(endIndex).join(" ");
  return { joinedParts, remainingParts };
};

// Start PDF

export const printPDF = async (data) => {
  console.log(data);
  const vpl = data?.tax?.reduce((acc, curr) => {
    return curr?.credit != 0
      ? acc - parseFloat(curr.vat_local)
      : acc + parseFloat(curr.vat_local);
  }, 0);

  const npl = data?.tax?.reduce((acc, curr) => {
    return curr?.credit != 0
      ? acc - parseFloat(curr.nvat_local)
      : acc + parseFloat(curr.nvat_local);
  }, 0);

  const vps = data?.tax?.reduce((acc, curr) => {
    return curr?.credit != 0
      ? acc - parseFloat(curr.vat_service)
      : acc + parseFloat(curr.vat_service);
  }, 0);

  const nps = data?.tax?.reduce((acc, curr) => {
    return curr?.credit != 0
      ? acc - parseFloat(curr.nvat_service)
      : acc + parseFloat(curr.nvat_service);
  }, 0);

  const wTaxL = data?.tax?.reduce(
    (acc, curr) =>
      parseFloat(curr.vat_local) !== 0
        ? parseFloat(curr.credit) === 0
          ? acc + parseFloat(curr.wtax_payable_cr)
          : acc - parseFloat(curr.wtax_payable_cr)
        : acc,
    0
  );

  const wTaxS = data?.tax?.reduce(
    (acc, curr) =>
      parseFloat(curr.vat_service) !== 0
        ? parseFloat(curr.credit) === 0
          ? acc + parseFloat(curr.wtax_payable_cr)
          : acc - parseFloat(curr.wtax_payable_cr)
        : acc,
    0
  );

  const wNTaxL = data?.tax?.reduce(
    (acc, curr) =>
      parseFloat(curr.nvat_local) !== 0
        ? parseFloat(curr.credit) === 0
          ? acc + parseFloat(curr.wtax_payable_cr)
          : acc - parseFloat(curr.wtax_payable_cr)
        : acc,
    0
  );

  const wNTaxS = data?.tax?.reduce(
    (acc, curr) =>
      parseFloat(curr.nvat_service) !== 0
        ? parseFloat(curr.credit) === 0
          ? acc + parseFloat(curr.wtax_payable_cr)
          : acc - parseFloat(curr.wtax_payable_cr)
        : acc,
    0
  );

  console.log(wTaxL);
  console.log(wTaxS);
  console.log(wNTaxL);
  console.log(wNTaxS);

  const dateToday = new Date();
  const response = await fetch(pdfFileAsset);
  const existingPdfBytes = await response.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const firstPage = pdfDoc.getPage(0);

  firstPage.setMediaBox(0, 0, 612, 962);

  const from = getStartQuarter(data?.quarter, moment(dateToday).format("YYYY"));

  const to = getEndQuarter(data?.quarter, moment(dateToday).format("YYYY"));
  const parts = data?.supplier?.tin?.split("-");
  const comp = formConst?.compTin?.split("-");
  const tin = parts[0] + " " + parts[1] + " " + parts[2];
  const rdfTin = comp[0] + " " + comp[1] + " " + comp[2];

  const address = addressCount(data?.supplier?.company_address);
  const { joinedParts, remainingParts } = joinAddressParts(address, 0, 10);

  const drawText = (text, { x, y, size = 12, color = rgb(0, 0, 0) }) => {
    firstPage.drawText(text, { x, y, size, color });
  };

  const isSG =
    data?.atc.substring(2, 5) === "158" || data?.atc.substring(2, 5) === "160";

  const hasAmountL = vpl !== 0 || npl !== 0;
  const hasAmountS = vps !== 0 || nps !== 0;

  const isAG = data?.atc.substring(2, 5) === "120";
  const isRental = data?.atc.substring(2, 5) === "100";
  const isEQ = data?.atc.substring(2, 5) === "140";
  const isHB = data?.atc.substring(2, 5) === "516";

  drawText(addDoubleSpaces(moment(from).format("MMDDYYYY")), {
    x: 155,
    y: 817,
  });
  drawText(addDoubleSpaces(moment(to).format("MMDDYYYY")), { x: 402, y: 817 });
  drawText(addDoubleSpaces(tin), { x: 212, y: 786 });
  drawText(addDoubleSpaces(parts[3]), { x: 368, y: 786 });
  drawText(data?.supplier?.company_name, { x: 38, y: 759, size: 10 });
  if (address?.length < 10) {
    drawText(data?.supplier?.company_address, { x: 38, y: 732, size: 10 });
  } else {
    drawText(joinedParts, { x: 38, y: 736, size: 8 });
    drawText(remainingParts, { x: 38, y: 729, size: 8 });
  }
  if (data?.code !== "") {
    drawText(addDoubleSpaces(data?.code), { x: 544, y: 730 });
  }
  drawText(addDoubleSpaces(rdfTin), { x: 212, y: 670 });
  drawText(addDoubleSpaces(comp[3]), { x: 368, y: 670 });
  drawText(formConst?.name, { x: 38, y: 644, size: 10 });
  drawText(formConst?.address, { x: 38, y: 617, size: 10 });
  drawText(addDoubleSpaces(formConst?.zip), { x: 544, y: 617, size: 12 });
  isSG && drawText("Payment made by Top 20,000", { x: 40, y: 560, size: 9 });
  isSG && drawText("Private Corporation to their", { x: 40, y: 547, size: 9 });
  isSG && drawText("Local/Resident Supplier of", { x: 40, y: 533, size: 9 });
  isSG &&
    drawText(hasAmountL ? "Goods" : "Services", { x: 40, y: 520, size: 9 });
  isSG &&
    hasAmountL &&
    vps !== 0 &&
    drawText("Goods and Services", { x: 40, y: 520, size: 9 });

  drawText(
    hasAmountL
      ? convertToPeso(vpl !== 0 ? vpl : npl)
      : convertToPeso(vps !== 0 ? vps : nps),
    {
      x: getMonth(data?.month),
      y: 560,
      size: 9,
    }
  );
  drawText(
    hasAmountL
      ? convertToPeso(vpl !== 0 ? vpl : npl)
      : convertToPeso(vps !== 0 ? vps : nps),
    {
      x: 448,
      y: 560,
      size: 9,
    }
  );

  drawText(
    hasAmountL
      ? convertToPeso(wTaxL !== 0 ? wTaxL : wNTaxL)
      : convertToPeso(wTaxS !== 0 ? wTaxS : wNTaxS),
    {
      x: 520,
      y: 560,
      size: 9,
    }
  );

  isSG &&
    drawText(
      hasAmountL
        ? `${data?.atc?.substring(0, 2)}158`
        : `${data?.atc?.substring(0, 2)}160`,
      { x: 182, y: 560, size: 10 }
    );

  hasAmountS &&
    hasAmountL &&
    drawText(convertToPeso(vps !== 0 ? vps : nps), {
      x: getMonth(data?.month),
      y: 546,
      size: 9,
    });

  hasAmountS &&
    hasAmountL &&
    drawText(convertToPeso(vps !== 0 ? vps : nps), {
      x: 448,
      y: 546,
      size: 9,
    });

  hasAmountS &&
    hasAmountL &&
    drawText(convertToPeso(wTaxS !== 0 ? wTaxS : wNTaxS), {
      x: 520,
      y: 546,
      size: 9,
    });

  isSG &&
    hasAmountS &&
    hasAmountL &&
    drawText(`${data?.atc?.substring(0, 2)}160`, { x: 182, y: 546, size: 10 });

  drawText(convertToPeso(vps !== 0 || vpl !== 0 ? vps + vpl : nps + npl), {
    x: getMonth(data?.month),
    y: 424,
    size: 10,
  });

  drawText(convertToPeso(vps !== 0 || vpl !== 0 ? vps + vpl : nps + npl), {
    x: 448,
    y: 424,
    size: 10,
  });

  drawText(
    convertToPeso(wTaxL !== 0 || wTaxS !== 0 ? wTaxL + wTaxS : wNTaxL + wNTaxS),
    {
      x: 520,
      y: 424,
      size: 10,
    }
  );

  isAG && drawText("Prime Contractors/ Sub", { x: 40, y: 560, size: 9 });
  isAG && drawText("Contractors", { x: 40, y: 547, size: 9 });

  isAG &&
    drawText(
      hasAmountL
        ? `${data?.atc?.substring(0, 2)}158`
        : `${data?.atc?.substring(0, 2)}120`,
      { x: 182, y: 560, size: 10 }
    );

  isRental &&
    drawText("Rentals - Real Properties &", { x: 40, y: 560, size: 9 });
  isRental &&
    drawText("Personal Properties, Poles,", { x: 40, y: 547, size: 9 });
  isRental && drawText("Satellites & Transmission", { x: 40, y: 533, size: 9 });
  isRental && drawText("Facilities & Billboards.", { x: 40, y: 520, size: 9 });

  isRental &&
    drawText(
      hasAmountL
        ? `${data?.atc?.substring(0, 2)}100`
        : `${data?.atc?.substring(0, 2)}100`,
      { x: 182, y: 560, size: 10 }
    );

  isEQ && drawText("BROKERAGE FEE", { x: 40, y: 560, size: 9 });
  isEQ &&
    drawText(
      hasAmountL
        ? `${data?.atc?.substring(0, 2)}140`
        : `${data?.atc?.substring(0, 2)}140`,
      { x: 182, y: 560, size: 10 }
    );

  isHB && drawText("COMMISSION, REBATES,", { x: 40, y: 563, size: 9 });
  isHB && drawText("DISCOUNTS & OTHER", { x: 40, y: 556, size: 9 });
  isHB && drawText("SIMILAR CONSIDERATIONS", { x: 40, y: 549, size: 9 });
  isHB && drawText("PAID/GRANTED TO", { x: 40, y: 542, size: 9 });
  isHB && drawText("INDEPENDENT & EXCLUSIVE", { x: 40, y: 535, size: 9 });
  isHB && drawText("DISTRIBUTORS,", { x: 40, y: 528, size: 9 });
  isHB && drawText("MEDICAL/TECHNICAL &", { x: 40, y: 521, size: 9 });
  isHB && drawText("SALES REPRESENTATIVES &", { x: 40, y: 514, size: 9 });
  isHB && drawText("MARKETING AGENTS & SUB-", { x: 40, y: 507, size: 9 });
  isHB && drawText("AGENTS OF MULTI-LEVEL", { x: 40, y: 500, size: 9 });
  isHB && drawText("MARKETING COMPANIES", { x: 40, y: 493, size: 9 });

  isHB &&
    drawText(
      hasAmountL
        ? `${data?.atc?.substring(0, 2)}140`
        : `${data?.atc?.substring(0, 2)}140`,
      { x: 182, y: 560, size: 10 }
    );

  drawText(formConst?.sup, { x: 255, y: 200, size: 10 });
  drawText(formConst?.post, { x: 200, y: 190, size: 10 });

  const modifiedPdfBytes = await pdfDoc.save();
  const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

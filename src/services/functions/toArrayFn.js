import moment from "moment";

export const arrayFieldOne = (menuData, sumAmount, voucher) => {
  const obj = [
    {
      date: moment(menuData?.transactions?.date_invoice).format("MM/DD/YY"),
      remarks: menuData?.remarks,
      invoice: menuData?.transactions?.invoice_no,
      amount: sumAmount,
    },
    undefined,
    undefined,
  ];

  const objJV = [
    {
      date: moment(menuData?.transactions?.date_invoice).format("MM/DD/YY"),
      remarks: menuData?.remarks,
      invoice: menuData?.transactions?.invoice_no,
      amount: sumAmount,
    },
    undefined,
  ];

  return voucher === "check" ? obj : objJV;
};

export const arrayFieldThree = (menuData, sumAmount) => {
  const obj = [
    {
      tag_no: `${menuData?.transactions?.tag_year}-${menuData?.transactions?.gtag_no}`,
      time: undefined,
    },
    {
      tag_no: undefined,
      time: moment(new Date()).format("hh:mm a"),
    },
    undefined,
    undefined,
    undefined,
  ];

  return obj;
};

export const mapTitleAccount = (item) => {
  const obj = {
    id: item?.id,
    name: item?.coa?.name,
    mode: item?.credit !== "0.00" ? "Credit" : "Debit",
    code: item?.coa?.code,
    amount: item?.credit !== "0.00" ? item?.credit : item?.debit,
  };

  return obj;
};

export const coaArrays = (coa, taxComputation, supTypePercent, coa_id) => {
  const sumInputTax = (taxComputation || []).reduce((acc, curr) => {
    return acc + parseFloat(curr?.vat_input_tax || 0);
  }, 0);

  const sumAccount = (taxComputation || []).reduce((acc, curr) => {
    return parseFloat(curr.credit)
      ? acc - parseFloat(curr.account)
      : acc + parseFloat(curr.account);
  }, 0);

  const item = coa?.map((item) => mapTitleAccount(item));

  const wtaxCount = taxComputation
    ?.map((item) => {
      const wtax = supTypePercent?.find(
        (type) => item?.stype_id === type?.id
      )?.wtax;
      if (wtax !== "0%" && supTypePercent.length >= 2) {
        return {
          id: 183,
          name: "WITHHOLDING TAX PAYABLE",
          mode: "Credit",
          code: "217110",
          amount: item?.wtax_payable_cr,
          wtax: wtax,
        };
      }
    })
    .filter(Boolean);

  const inputTax = {
    id: 115,
    name: "INPUT TAX",
    mode: "Debit",
    code: "116110",
    amount: sumInputTax,
  };

  const accountPayable = {
    id: 155,
    name: "ACCOUNTS PAYABLE",
    mode: "Credit",
    code: coa_id ? coa_id?.code : "211100",
    amount: sumAccount,
  };

  const itemCollected = [...item, inputTax, ...wtaxCount, accountPayable];

  const sortedData = itemCollected.sort((a, b) => {
    if (a.mode === "Debit" && b.mode === "Credit") {
      return -1;
    }
    if (a.mode === "Credit" && b.mode === "Debit") {
      return 1;
    }
    return 0;
  });

  const defaultValues = [
    ...new Array(4 - coa.length).fill(undefined),
    ...sortedData,
    undefined,
    undefined,
  ];

  return defaultValues;
};

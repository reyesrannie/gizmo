import moment from "moment";

export const arrayFieldOne = (menuData, sumAmount, voucher, document) => {
  const doc = document?.result?.find(
    (item) => item?.id === menuData?.transactions?.document_type_id
  )?.code;

  const obj = [
    {
      date: moment(menuData?.transactions?.date_invoice).format("MM/DD/YY"),
      remarks: menuData?.remarks,
      invoice: `${doc} ${menuData?.transactions?.invoice_no || ""} ${
        menuData?.transactions?.reference_no || ""
      }`,
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
      tag_no: `${menuData?.transactions?.tag_year}-${menuData?.transactions?.tag_no}`,
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

  const isWtaxSame = (arr) => {
    if (arr.length === 0) return true;
    const firstWtax = arr[0].wtax;
    return arr.every((item) => item.wtax === firstWtax);
  };

  let zeroCount = 0;

  const item = coa?.map((item) => mapTitleAccount(item));
  const wtaxCount = taxComputation
    ?.map((item) => {
      const wtax = supTypePercent?.find(
        (type) => item?.stype_id === type?.id
      )?.wtax;

      if (supTypePercent.length > 1 && wtax === "0%") {
        zeroCount++;
      }

      if (wtax !== "0%") {
        return {
          id: 183,
          name: "WITHHOLDING TAX PAYABLE",
          mode: "Credit",
          code: "217110",
          amount: item?.wtax_payable_cr,
          wtax: wtax,
        };
      } else if (supTypePercent.length === 1 && wtax === "0%") {
        return {
          id: 183,
          name: "WITHHOLDING TAX PAYABLE",
          mode: "Credit",
          code: "217110",
          amount: item?.wtax_payable_cr,
          wtax: wtax,
        };
      } else if (supTypePercent.length === zeroCount) {
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

  const filteredItem = () => {
    if (wtaxCount?.length > 0 && isWtaxSame(wtaxCount)) {
      const combinedAmount = wtaxCount.reduce((acc, curr) => {
        return acc + parseFloat(curr.amount || 0);
      }, 0);

      return {
        id: 183,
        name: "WITHHOLDING TAX PAYABLE",
        mode: "Credit",
        code: "217110",
        amount: combinedAmount.toFixed(2),
        wtax: wtaxCount[0].wtax,
      };
    }
    return wtaxCount;
  };

  const itemCollected = [...item, inputTax, filteredItem(), accountPayable];

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

export const convertToArray = (item) => {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    return Object.keys(item).map((key) => ({ code: key }));
  }
  return [];
};

export const schedArrayOne = (menuData, sumAmount, document) => {
  const doc = document?.result?.find(
    (item) => item?.id === menuData?.document_type_id
  )?.code;

  const obj = [
    {
      date: moment(menuData?.transactions?.date_invoice).format("MM/DD/YY"),
      remarks: menuData?.remarks,
      invoice: `${doc} ${menuData?.invoice_no || ""} ${
        menuData?.reference_no || ""
      }`,
      amount: sumAmount,
    },
    undefined,
    undefined,
  ];

  return obj;
};

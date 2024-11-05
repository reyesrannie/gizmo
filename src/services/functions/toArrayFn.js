import moment from "moment";
import { totalAccount } from "./compute";
import dayjs from "dayjs";

export const arrayFieldOne = (menuData, sumAmount, voucher, document) => {
  const doc = document?.result?.find(
    (item) => item?.id === menuData?.transactions?.documentType?.id
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
      invoice: `${doc} ${menuData?.transactions?.invoice_no || ""} ${
        menuData?.transactions?.reference_no || ""
      }`,
      amount: sumAmount,
    },
    undefined,
  ];

  return voucher === "check" ? obj : objJV;
};

export const arrayFieldThree = (menuData, receiveBy) => {
  const tagMonthYear = dayjs(menuData?.transactions?.tag_year, "YYMM").toDate();

  const obj = [
    {
      tag_no: `${menuData?.transactions?.tag_no}-${moment(tagMonthYear).get(
        "year"
      )}`,
      time: undefined,
    },
    {
      tag_no: undefined,
      time: moment(receiveBy?.created_at).format("hh:mm a"),
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
    mode: item?.credit !== 0 ? "Credit" : "Debit",
    code: item?.coa?.code,
    amount: item?.credit !== 0 ? item?.credit : item?.debit,
  };

  return obj;
};

export const coaArrays = (coa, taxComputation, supTypePercent, coa_id) => {
  const sumInputTax = (taxComputation?.result || []).reduce((acc, curr) => {
    return curr?.credit !== 0
      ? acc - parseFloat(curr?.vat_input_tax || 0)
      : acc + parseFloat(curr?.vat_input_tax || 0);
  }, 0);

  const sumAccount = totalAccount(taxComputation);

  let zeroCount = 0;

  const item = coa?.map((item) => mapTitleAccount(item));

  const wtaxCount = taxComputation?.result
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
          mode: item?.mode,
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
    if (wtaxCount?.length > 0) {
      const wtaxMap = new Map();

      wtaxCount.forEach((item) => {
        const wtax = item.wtax;
        const amount = item.amount || 0;

        if (wtaxMap.has(wtax)) {
          const existingItem = wtaxMap.get(wtax);
          item.mode === "Credit"
            ? (existingItem.amount -= amount)
            : (existingItem.amount += amount);
        } else {
          wtaxMap.set(wtax, {
            id: item.id,
            name: item.name,
            mode: "Credit",
            code: item.code,
            amount: amount,
            wtax: wtax,
          });
        }
      });

      const combinedItems = Array.from(wtaxMap.values()).map((item) => ({
        ...item,
        amount: item.amount,
      }));

      return combinedItems;
    }

    return wtaxCount;
  };

  const theSameCoa = () => {
    const coa = new Map();

    if (item?.length > 0) {
      item?.forEach((data, index) => {
        const coaId = data?.id;
        const amount = data?.amount;
        const mode = data?.mode;
        const name = data?.name;
        const code = data?.code;

        if (coa.has(code)) {
          const existingCoa = coa?.get(code);
          const isDebit = existingCoa.amount > amount ? existingCoa.mode : mode;
          existingCoa.mode !== mode
            ? (existingCoa.amount -= amount)
            : (existingCoa.amount += amount);

          existingCoa.amount = Math.abs(existingCoa.amount);

          existingCoa.mode = isDebit;
        } else {
          coa.set(code, {
            id: coaId,
            amount: amount,
            mode: mode,
            name: name,
            code: code,
            index: index,
          });
        }
      });
    }
    const combinedItems = Array.from(coa.values()).map((item) => ({
      ...item,
      amount: item.amount,
    }));

    return combinedItems;
  };

  const itemCollected = [
    ...theSameCoa(),
    inputTax,
    ...filteredItem(),
    accountPayable,
  ];

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
    ...new Array(coa?.length < 4 ? 4 - coa.length : 1).fill(undefined),
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

export const getAllATC = (report) => {
  const atc = new Map();

  report?.result?.forEach((item) => {
    const atcCode = item?.atc?.code;
    const percent = item?.supplierType?.wtax;

    const vatValue = {
      nvat_local: item?.nvat_local,
      nvat_service: item?.nvat_service,
      vat_local: item?.vat_local,
      vat_service: item?.vat_service,
    };

    const taxBased = Object.keys(vatValue).find((key) => vatValue[key] !== 0);

    const amount = vatValue[taxBased] || 0;
    const wtax = item?.wtax_payable_cr || 0;

    if (atc.has(atcCode)) {
      const existingAtc = atc.get(atcCode);
      item.mode === "Credit"
        ? (existingAtc.amount -= amount)
        : (existingAtc.amount += amount);
      item.mode === "Credit"
        ? (existingAtc.wtax -= wtax)
        : (existingAtc.wtax += wtax);
    } else {
      atc.set(atcCode, {
        code: atcCode,
        amount: amount,
        wtax: wtax,
        percent: percent,
      });
    }
  });

  const combinedItems = Array.from(atc.values()).map((item) => ({
    ...item,
    amount: item.amount,
  }));

  return combinedItems;
};

export const getAllSupplier = (report) => {
  const supplier = new Map();

  report?.result?.forEach((item) => {
    const supplierId = item?.transactions?.supplier?.id;
    const atcId = item?.atc?.id;
    const supplierKey = `${supplierId}-${atcId}`;

    const vatValue = {
      nvat_local: item?.nvat_local,
      nvat_service: item?.nvat_service,
      vat_local: item?.vat_local,
      vat_service: item?.vat_service,
    };
    const taxBased = Object.keys(vatValue).find((key) => vatValue[key] !== 0);
    const tax = vatValue[taxBased] || 0;
    const wtax = item?.wtax_payable_cr || 0;

    if (supplier.has(supplierKey)) {
      const existingSup = supplier.get(supplierKey);
      if (item.mode === "Credit") {
        existingSup.amount -= item?.amount;
        existingSup.wtax -= wtax;
        existingSup.taxBased -= tax;
      } else {
        existingSup.amount += item?.amount;
        existingSup.wtax += wtax;
        existingSup.taxBased += tax;
      }
    } else {
      supplier.set(supplierKey, {
        code: item?.transactions?.supplier,
        amount: item?.amount,
        source: item?.transactions?.apTagging,
        coa: item?.coa,
        description: item?.transactions?.description,
        inv: `${item?.transactions?.documentType?.code} ${item?.transactions?.invoice_no}`,
        date_invoice: item?.transactions?.date_invoice,
        location: item?.location,
        tag_no: `${item?.transactions?.tag_year}-${item?.transactions?.tag_no}`,
        voucher_number:
          item?.voucher === "check"
            ? item?.transactions?.transactionChecks?.voucher_number
            : item?.transactions?.transactionJournals?.voucher_number,
        atc: item?.atc?.code,
        taxBased: tax,
        wtax: wtax,
        rate: item?.supplierType?.wtax,
      });
    }
  });

  const combinedItems = Array.from(supplier.values()).map((item) => ({
    ...item,
    amount: item.amount,
  }));

  return combinedItems;
};

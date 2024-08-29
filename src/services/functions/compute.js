export const totalAmount = (taxComputation) => {
  const total = (taxComputation?.result || []).reduce((acc, curr) => {
    return curr?.credit !== 0 ? acc + 0 : acc + parseFloat(curr?.amount || 0);
  }, 0);

  return total;
};

export const totalInputTax = (taxComputation) => {
  const total = (taxComputation?.result || []).reduce((acc, curr) => {
    return acc + parseFloat(curr?.vat_input_tax || 0);
  }, 0);

  return total;
};

export const totalWTax = (taxComputation) => {
  const total = (taxComputation?.result || []).reduce((acc, curr) => {
    return acc + parseFloat(curr?.wtax_payable_cr || 0);
  }, 0);

  return total;
};

export const totalAccount = (taxComputation) => {
  return (taxComputation?.result || []).reduce((acc, curr) => {
    const value = parseFloat(curr?.account || 0);
    return curr?.credit !== 0 ? acc - value : acc + value;
  }, 0);
};

export const totalAccountPaginated = (taxComputation) => {
  return (taxComputation?.result?.data || []).reduce((acc, curr) => {
    const value = parseFloat(curr?.account || 0);
    return curr?.credit !== 0 ? acc - value : acc + value;
  }, 0);
};

export const totalVat = (taxComputation, property) => {
  const total = taxComputation?.result?.data?.reduce((acc, curr) => {
    return curr?.credit !== 0 ? acc + 0 : acc + parseFloat(curr[property] || 0);
  }, 0);

  return total;
};

export const totalVatNonPaginate = (taxComputation, property) => {
  const total = taxComputation?.result?.reduce((acc, curr) => {
    return curr?.credit !== 0 ? acc + 0 : acc + parseFloat(curr[property] || 0);
  }, 0);

  return total;
};

export const totalCredit = (taxComputation, property) => {
  const total = taxComputation?.result?.data?.reduce((acc, curr) => {
    return acc + parseFloat(curr[property] || 0);
  }, 0);

  return total;
};

export const totalAccountMapping = (taxComputation, items) => {
  const getAllSameID = taxComputation?.result?.filter(
    (item) => items?.transactions?.id === item?.transaction_id
  );

  return (getAllSameID || []).reduce((acc, curr) => {
    const value = parseFloat(curr?.account ?? 0);
    return curr?.credit !== 0 ? acc - value : acc + value;
  }, 0);
};

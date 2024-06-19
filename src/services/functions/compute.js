export const totalAmount = (taxComputation) => {
  const total = (taxComputation?.result || []).reduce((acc, curr) => {
    return curr?.credit_from !== null
      ? acc + 0
      : acc + parseFloat(curr?.amount || 0);
  }, 0);

  return total;
};

export const totalAccount = (taxComputation) => {
  const total = (taxComputation?.result || []).reduce((acc, curr) => {
    return curr?.credit_from !== null && curr?.credit_from === "Check Amount"
      ? acc - parseFloat(curr?.account || 0)
      : acc + parseFloat(curr?.account || 0);
  }, 0);

  return total;
};

export const totalAmountData = (taxComputation) => {
  const total = (taxComputation?.result?.data || []).reduce((acc, curr) => {
    return curr?.credit_from !== null && curr?.credit_from === "Check Amount"
      ? acc + 0
      : acc + parseFloat(curr?.total_invoice_amount || 0);
  }, 0);

  return total;
};

export const totalAccountData = (taxComputation) => {
  const total = (taxComputation?.result?.data || []).reduce((acc, curr) => {
    return curr?.credit_from !== null && curr?.credit_from === "Check Amount"
      ? acc - parseFloat(curr?.account || 0)
      : acc + parseFloat(curr?.account || 0);
  }, 0);

  return total;
};

export const totalVat = (taxComputation, property) => {
  const total = taxComputation?.result?.data?.reduce((acc, curr) => {
    return curr?.credit_from !== null && curr?.credit_from === "Check Amount"
      ? acc + 0
      : acc + parseFloat(curr[property] || 0);
  }, 0);

  return total;
};

export const totalCredit = (taxComputation, property) => {
  const total = taxComputation?.result?.data?.reduce((acc, curr) => {
    return acc + parseFloat(curr[property] || 0);
  }, 0);

  return total;
};

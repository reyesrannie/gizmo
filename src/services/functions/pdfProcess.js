export const getStartQuarter = (quarter, year) => {
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

export const getEndQuarter = (quarter, year) => {
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

export const getMonth = (month) => {
  if (month === 1) {
    return 226;
  } else if (month === 2) {
    return 300;
  } else if (month === 3) {
    return 374;
  }
};

export const alignColumn = (month) => {
  if (month === 1) {
    return 310;
  } else if (month === 2) {
    return 410;
  } else if (month === 3) {
    return 500;
  }
};

export const addDoubleSpaces = (text) => {
  return text?.split("").join("  ");
};

export const addressCount = (text) => {
  return text?.split(" ");
};

export const joinAddressParts = (addressParts, startIndex, endIndex) => {
  const joinedParts = addressParts?.slice(startIndex, endIndex).join(" ");
  const remainingParts = addressParts?.slice(endIndex)?.join(" ");
  return { joinedParts, remainingParts };
};

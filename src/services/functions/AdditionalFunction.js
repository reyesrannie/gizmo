import React, { useCallback } from "react";

export const AdditionalFunction = () => {
  const insertDocument = useCallback((transactionData) => {
    const items = transactionData?.reference_no?.split(", ");
    const regex = /(.+?)\s(\d+)$/;
    const result = items?.reduce((acc, item) => {
      const match = item?.match(regex);
      if (match) {
        const code = match[1]?.trim();
        const value = parseInt(match[2], 10);
        acc[code] = value;
      }
      return acc;
    }, {});

    return result;
  }, []);

  const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) {
      return true;
    }

    if (
      typeof obj1 !== "object" ||
      obj1 === null ||
      typeof obj2 !== "object" ||
      obj2 === null
    ) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  };

  return { insertDocument, deepEqual };
};

// import moment from "moment";
import { useState } from "react";

const useFistoHook = () => {
  const [params, setParams] = useState({
    transaction_from: undefined,
    transaction_to: undefined,
  });

  const onDateRange = (date) => {
    setParams(() => ({
      transaction_from: date?.from,
      transaction_to: date?.to,
    }));
  };

  return {
    params,
    onDateRange,
  };
};

export default useFistoHook;

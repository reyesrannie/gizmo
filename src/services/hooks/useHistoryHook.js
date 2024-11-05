// import moment from "moment";
import { useState } from "react";

const useHistoryHook = () => {
  const [params, setParams] = useState({
    year: "2024",
  });

  const onChangeDate = (year) => {
    setParams(() => ({
      year: year,
    }));
  };

  return {
    params,
    onChangeDate,
  };
};

export default useHistoryHook;

// import moment from "moment";
import moment from "moment";
import { useState } from "react";

const useTaggingHook = () => {
  const [params, setParams] = useState({
    yearMonth: moment(new Date()).format("YYMM"),
  });

  const onDateChange = (date) => {
    setParams((currentValue) => ({
      ...currentValue,
      yearMonth: date,
    }));
  };

  return {
    params,
    onDateChange,
  };
};

export default useTaggingHook;

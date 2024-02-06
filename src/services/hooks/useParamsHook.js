// import moment from "moment";
import { useState } from "react";

const useParamsHook = () => {
  const [params, setParams] = useState({
    status: "active",
    page: 1,
    per_page: 10,
    pagination: null,
  });

  const onPageChange = (_, page) => {
    setParams((currentValue) => ({
      ...currentValue,
      page: page + 1,
    }));
  };

  const onRowChange = (rows) => {
    setParams((currentValue) => ({
      ...currentValue,
      page: 1,
      per_page: rows.target.value,
    }));
  };

  const onStatusChange = (status) => {
    setParams((currentValue) => ({
      ...currentValue,
      status: status,
    }));
  };
  // const onDateRange = (date) => {
  //   setParams((currentValue) => ({
  //     ...currentValue,
  //     from: date?.from ? moment(date?.from).format("YYYY/MM/DD") : null,
  //     to: date?.to ? moment(date?.to).format("YYYY/MM/DD") : null,
  //   }));
  // };

  const onSearchData = (search) => {
    setParams((currentValue) => ({
      ...currentValue,
      page: 1,
      search: search,
    }));
  };

  return {
    params,
    onPageChange,
    onRowChange,
    // onDateRange,
    onSearchData,
    onStatusChange,
  };
};

export default useParamsHook;

// import moment from "moment";
import { useState } from "react";

const useCheckHook = () => {
  const [params, setParams] = useState({
    state: "Clearing",
    page: 1,
    per_page: 10,
    check_date: "Due",
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
      state: status,
      page: 1,
    }));
  };

  const onSearchData = (search) => {
    setParams((currentValue) => ({
      ...currentValue,
      page: 1,
      search: search,
    }));
  };

  const onSortTable = (sorts) => {
    setParams((currentValue) => ({
      ...currentValue,
      sorts: sorts,
    }));
  };

  const onFilterChange = (data) => {
    setParams((currentValue) => ({
      ...currentValue,
      ...data,
    }));
  };

  const onFromChange = (data) => {
    setParams((currentValue) => ({
      ...currentValue,
      ...data,
    }));
  };
  const onToChange = (data) => {
    setParams((currentValue) => ({
      ...currentValue,
      ...data,
    }));
  };

  const onCheckDateChange = (data) => {
    setParams((currentValue) => ({
      ...currentValue,
      check_date: data,
    }));
  };

  const onReset = () => {
    setParams(() => ({
      state: "Paid",
      page: 1,
      per_page: 10,
      pagination: null,
      sorts: null,
    }));
  };

  return {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onStatusChange,
    onSortTable,
    onFilterChange,
    onFromChange,
    onToChange,
    onCheckDateChange,
    onReset,
  };
};

export default useCheckHook;

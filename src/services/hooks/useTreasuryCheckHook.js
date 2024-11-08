// import moment from "moment";
import { useState } from "react";

const useTreasuryCheckHook = () => {
  const [params, setParams] = useState({
    status: "active",
    page: 1,
    per_page: 10,
    pagination: null,
    sorts: null,
    allocation: "",
    state: "",
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
      state: "",
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

  const onStateChange = (state) => {
    setParams((currentValue) => ({
      ...currentValue,
      state: state,
      page: 1,
    }));
  };

  const onOrderBy = (allocation) => {
    setParams((currentValue) => ({
      ...currentValue,
      allocation: allocation,
      page: 1,
    }));
  };

  return {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onStatusChange,
    onSortTable,
    onStateChange,
    onOrderBy,
  };
};

export default useTreasuryCheckHook;

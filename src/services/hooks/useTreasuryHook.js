// import moment from "moment";
import { useState } from "react";
import { treasuryHeader } from "../constants/headers";
import { hasAccess } from "../functions/access";

const useTreasuryHook = () => {
  const initialState =
    treasuryHeader.find((item) =>
      Array.isArray(item.permission)
        ? item.permission.some(hasAccess)
        : hasAccess(item.permission)
    )?.name || "Preparation";

  const [params, setParams] = useState({
    status: "active",
    page: 1,
    per_page: 10,
    pagination: null,
    sorts: null,
    allocation: "",
    is_cleared: true,
    state: initialState,
    access: "treasury",
    complete: "",
    is_print: hasAccess(["preparation", "check_approval"]) ? "" : "1",
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

  const onShowAll = (showAll) => {
    setParams((currentValue) => ({
      ...currentValue,
      complete: showAll,
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
    onShowAll,
  };
};

export default useTreasuryHook;

// import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";

const useApHistoryHook = () => {
  const userData = useSelector((state) => state.auth.userData);
  const getAccess = () => {
    const validAccess = ["ap_tag", "approver", "treasury"];

    const mappedPermissions = userData?.role?.access_permission?.map(
      (permission) =>
        permission.toLowerCase() === "ap" ? "ap_tag" : permission.toLowerCase()
    );

    const matchingPermissions = mappedPermissions?.filter((permission) =>
      validAccess.includes(permission)
    );

    if (matchingPermissions?.length === 1) {
      return matchingPermissions[0] === "ap_tag"
        ? "ap"
        : matchingPermissions[0];
    }

    return "";
  };

  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    pagination: "",
    sorts: "",
    tagYear: "",
    state: "",
    allocation: "",
    access: getAccess(),
    year: "",
    month: "",
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
      ...state,
    }));
  };

  const onOrderBy = (allocation) => {
    setParams((currentValue) => ({
      ...currentValue,
      allocation: allocation,
      page: 1,
    }));
  };

  const onTagYearChange = (tagYear) => {
    setParams((currentValue) => ({
      ...currentValue,
      tagYear: tagYear,
    }));
  };

  const onYearChange = (year) => {
    setParams((currentValue) => ({
      ...currentValue,
      year: year,
    }));
  };

  const onMonthChange = (month) => {
    setParams((currentValue) => ({
      ...currentValue,
      month: month,
    }));
  };

  const onBackProcess = () => {
    if (params?.state !== "") {
      setParams((prev) => ({
        ...prev,
        state: "",
        access: "",
      }));
    } else if (params?.month !== "") {
      setParams((prev) => ({
        ...prev,
        month: "",
      }));
    } else if (params?.year !== "") {
      setParams((prev) => ({
        ...prev,
        year: "",
      }));
    }
  };

  return {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
    onStateChange,
    onOrderBy,
    onTagYearChange,
    onYearChange,
    onMonthChange,
    onBackProcess,
  };
};

export default useApHistoryHook;

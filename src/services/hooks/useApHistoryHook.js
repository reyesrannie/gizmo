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

    return null;
  };

  const [params, setParams] = useState({
    status: "active",
    page: 10,
    per_page: 10,
    pagination: null,
    sorts: null,
    tagYear: "",
    state: null,
    allocation: "",
    access: getAccess(),
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

  const onTagYearChange = (tagYear) => {
    setParams((currentValue) => ({
      ...currentValue,
      tagYear: tagYear,
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
    onTagYearChange,
  };
};

export default useApHistoryHook;

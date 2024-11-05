import React, { useEffect, useRef } from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";

import { Box, Dialog, Typography } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useLazyCheckEntriesQuery } from "../../services/store/request";

import "../../components/styles/TagTransaction.scss";

import { apHistoryHeader } from "../../services/constants/headers";
import { setIsExpanded } from "../../services/slice/transactionSlice";
import Voucher from "./Voucher";

import { HistoryContext } from "../../services/context/HistoryContext";
import useApHistoryHook from "../../services/hooks/useApHistoryHook";
import TransactionModal from "../../components/customs/modal/TransactionModal";

const History = () => {
  const dispatch = useDispatch();

  const isExpanded = useSelector((state) => state.transaction.isExpanded);
  const header =
    useSelector((state) => state.headers.header) || "Voucher's Payable";

  const {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
    onOrderBy,
    onStateChange,
    onTagYearChange,
  } = useApHistoryHook();

  const [
    getChecks,
    { data: tagTransaction, isLoading, isError, isFetching, status },
  ] = useLazyCheckEntriesQuery();

  useEffect(() => {
    if (header) {
      const statusChange = apHistoryHeader?.find(
        (item) => item?.name === header
      );
      onStateChange(statusChange?.status);
    }
  }, [header]);

  const accordionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accordionRef.current &&
        !accordionRef.current.contains(event.target)
      ) {
        dispatch(setIsExpanded(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accordionRef, dispatch]);

  return (
    <HistoryContext.Provider
      value={{
        params,
        onPageChange,
        onRowChange,
        onSearchData,
        onSortTable,
        onOrderBy,
        onStateChange,
        getChecks,
        onTagYearChange,
        tagTransaction,
      }}
    >
      <Box>
        <Box>
          <Breadcrums />
        </Box>
        <Box className="tag-transaction-head-container">
          <Box className="tag-transaction-navigation-container">
            <Typography className="page-text-indicator-tag-transaction">
              {header}
            </Typography>
          </Box>
          <Box className="tag-transaction-button-container">
            <SearchText onSearchData={onSearchData} />
          </Box>
        </Box>
        <Voucher />
      </Box>
    </HistoryContext.Provider>
  );
};

export default History;

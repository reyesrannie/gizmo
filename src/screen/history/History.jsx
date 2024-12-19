import React, { useEffect, useRef } from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";

import {
  Box,
  Button,
  Dialog,
  Divider,
  Paper,
  Stack,
  Typography,
  TextField as MuiTextField,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import "../../components/styles/TagTransaction.scss";

import { apHistoryHeader } from "../../services/constants/headers";
import { setIsExpanded } from "../../services/slice/transactionSlice";
import Voucher from "./Voucher";

import { HistoryContext } from "../../services/context/HistoryContext";
import useApHistoryHook from "../../services/hooks/useApHistoryHook";
import { useLazyCheckEntriesQuery } from "../../services/api/vouchersPayableApi";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { useGetHistoryQuery } from "../../services/api/historyApi";

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
    onYearChange,
    onMonthChange,
    onBackProcess,
  } = useApHistoryHook();

  const {
    data: historyData,
    isLoading: loadingHistory,
    isSuccess,
    isFetching: fetchingHistory,
    isError: errorHistory,
  } = useGetHistoryQuery(params);

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
        onYearChange,
        onMonthChange,
        historyData,
        loadingHistory,
        isSuccess,
        fetchingHistory,
        errorHistory,
      }}
    >
      <Box>
        <Box>
          <Breadcrums />
        </Box>
        <Box className="tag-transaction-head-container">
          <Box className="tag-transaction-navigation-container">
            <Typography className="page-text-indicator-tag-transaction">
              History
            </Typography>
          </Box>
        </Box>
        <Box className="history-transaction-container">
          <Paper className="history-navigation-folder">
            <Stack
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Stack justifyContent={"center"} flexDirection={"row"}>
                {params?.year !== "" && (
                  <Button
                    variant="text"
                    color="primary"
                    className="add-transaction-button"
                    size="small"
                    onClick={() => {
                      onBackProcess();
                    }}
                    startIcon={<KeyboardBackspaceOutlinedIcon />}
                  />
                )}
                <Divider orientation="vertical" />
              </Stack>

              <Stack flexDirection={"row"}>
                <SearchText onSearchData={onSearchData} />
              </Stack>
            </Stack>
          </Paper>

          {header === "Voucher's Payable" && <Voucher />}
        </Box>
      </Box>
    </HistoryContext.Provider>
  );
};

export default History;

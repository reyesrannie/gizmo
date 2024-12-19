import React, { useEffect, useRef } from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";

import {
  Accordion,
  AccordionSummary,
  Box,
  IconButton,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";

import "../../components/styles/TagTransaction.scss";

import { clearingHeader } from "../../services/constants/headers";
import {
  setFilterBy,
  setIsExpanded,
} from "../../services/slice/transactionSlice";

import ClearingTable from "./ClearingTable";
import { setHeader } from "../../services/slice/headerSlice";
import useTreasuryHook from "../../services/hooks/useTreasuryHook";
import { hasAccess } from "../../services/functions/access";
import { useCheckEntriesQuery } from "../../services/api/vouchersPayableApi";
import useCheckHook from "../../services/hooks/useCheckHook";
import { useCheckDetailsQuery } from "../../services/api/checkApi";

const Check = () => {
  const dispatch = useDispatch();

  const isExpanded = useSelector((state) => state.transaction.isExpanded);
  const header =
    useSelector((state) => state.headers.header) ||
    clearingHeader.find((item) =>
      Array.isArray(item.permission)
        ? item.permission.some(hasAccess)
        : hasAccess(item.permission)
    )?.name ||
    "Due for Clearing";

  const {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
    onCheckDateChange,
  } = useCheckHook();

  const {
    data: tagTransaction,
    isLoading,
    isError,
    isFetching,
    status,
  } = useCheckDetailsQuery(params);

  useEffect(() => {
    if (header) {
      const statusChange = clearingHeader?.find(
        (item) => item?.name === header
      );
      onCheckDateChange(statusChange?.status);
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
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="tag-transaction-head-container">
        <Box className="tag-transaction-navigation-container">
          <Accordion
            ref={accordionRef}
            expanded={isExpanded}
            elevation={0}
            className="tag-transaction-accordion"
          >
            <AccordionSummary onClick={() => dispatch(setIsExpanded(false))}>
              <Typography className="page-text-indicator-tag-transaction">
                {header}
              </Typography>
            </AccordionSummary>
            {clearingHeader?.map(
              (head, index) =>
                hasAccess(head?.permission) &&
                header !== head?.name && (
                  <AccordionSummary
                    key={index}
                    onClick={() => {
                      dispatch(setHeader(head.name));
                      dispatch(setIsExpanded(false));
                      dispatch(setFilterBy(""));
                      onCheckDateChange(head?.status);
                    }}
                  >
                    <Typography className="page-text-accord-tag-transaction">
                      {head?.name}
                    </Typography>
                  </AccordionSummary>
                )
            )}
          </Accordion>
          {hasAccess("check_approval") && !hasAccess("preparation") ? (
            <></>
          ) : (
            <IconButton
              onClick={() => {
                dispatch(setIsExpanded(!isExpanded));
              }}
            >
              <ArrowDropDownCircleOutlinedIcon />
            </IconButton>
          )}
        </Box>
        <Box className="tag-transaction-button-container">
          <SearchText onSearchData={onSearchData} />
        </Box>
      </Box>
      {header === "Due for Clearing" && (
        <ClearingTable
          params={params}
          onSortTable={onSortTable}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          status={status}
          tagTransaction={tagTransaction}
          state={"For Preparation"}
        />
      )}

      {header === "Overdue" && (
        <ClearingTable
          params={params}
          onSortTable={onSortTable}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          status={status}
          tagTransaction={tagTransaction}
          state="returned"
        />
      )}
      {header === "Post Dated" && (
        <ClearingTable
          params={params}
          onSortTable={onSortTable}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          status={status}
          tagTransaction={tagTransaction}
          state="Releasing"
        />
      )}
      {header === "For Approval" && (
        <ClearingTable
          params={params}
          onSortTable={onSortTable}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          status={status}
          tagTransaction={tagTransaction}
          state="Check Approval"
        />
      )}
    </Box>
  );
};

export default Check;

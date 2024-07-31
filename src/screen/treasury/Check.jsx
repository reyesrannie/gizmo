import React, { useEffect, useRef } from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";

import {
  Accordion,
  AccordionSummary,
  Badge,
  Box,
  IconButton,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useCheckEntriesQuery } from "../../services/store/request";

import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";

import "../../components/styles/TagTransaction.scss";

import { treasuryHeader } from "../../services/constants/headers";
import {
  setFilterBy,
  setIsExpanded,
} from "../../services/slice/transactionSlice";

import CheckTable from "./CheckTable";
import CountDistribute from "../../services/functions/CountDistribute";
import { setHeader } from "../../services/slice/headerSlice";
import useTreasuryHook from "../../services/hooks/useTreasuryHook";

const Check = () => {
  const dispatch = useDispatch();

  const isExpanded = useSelector((state) => state.transaction.isExpanded);
  const header = useSelector((state) => state.headers.header) || "Preparation";

  const {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
    onOrderBy,
    onStateChange,
    onShowAll,
  } = useTreasuryHook();

  const {
    data: tagTransaction,
    isLoading,
    isError,
    isFetching,
    status,
  } = useCheckEntriesQuery(params);

  const { countHeaderApproverCH, countApproveCheck } = CountDistribute();

  const hasBadge = countApproveCheck();

  useEffect(() => {
    if (header) {
      const statusChange = treasuryHeader?.find(
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
            {treasuryHeader?.map(
              (head, index) =>
                header !== head?.name && (
                  <AccordionSummary
                    key={index}
                    onClick={() => {
                      dispatch(setHeader(head.name));
                      dispatch(setIsExpanded(false));
                      onOrderBy("");
                      dispatch(setFilterBy(""));
                      onStateChange(head?.status);
                    }}
                  >
                    <Typography className="page-text-accord-tag-transaction">
                      <Badge
                        badgeContent={
                          head?.name ? countHeaderApproverCH(head?.name) : 0
                        }
                        color="error"
                      >
                        {head?.name}
                      </Badge>
                    </Typography>
                  </AccordionSummary>
                )
            )}
          </Accordion>
          <IconButton
            onClick={() => {
              dispatch(setIsExpanded(!isExpanded));
            }}
          >
            <Badge variant="dot" color="error" invisible={hasBadge}>
              <ArrowDropDownCircleOutlinedIcon />
            </Badge>
          </IconButton>
        </Box>
        <Box className="tag-transaction-button-container">
          <SearchText onSearchData={onSearchData} />
        </Box>
      </Box>
      {header === "Preparation" && (
        <CheckTable
          params={params}
          onSortTable={onSortTable}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          status={status}
          tagTransaction={tagTransaction}
          onOrderBy={onOrderBy}
          state={"Preparation"}
          onShowAll={onShowAll}
        />
      )}

      {header === "Releasing" && (
        <CheckTable
          params={params}
          onSortTable={onSortTable}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          status={status}
          tagTransaction={tagTransaction}
          onOrderBy={onOrderBy}
          state="returned"
          onShowAll={onShowAll}
        />
      )}
      {header === "Clearing" && (
        <CheckTable
          params={params}
          onSortTable={onSortTable}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          status={status}
          tagTransaction={tagTransaction}
          onOrderBy={onOrderBy}
          state={"For Voiding"}
          onShowAll={onShowAll}
        />
      )}
    </Box>
  );
};

export default Check;

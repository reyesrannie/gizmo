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
import { useJournalEntriesQuery } from "../../services/store/request";

import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";

import "../../components/styles/TagTransaction.scss";

import { approverHeader } from "../../services/constants/headers";
import {
  setFilterBy,
  setIsExpanded,
} from "../../services/slice/transactionSlice";

import JournalTable from "./JournalTable";
import useApproverHook from "../../services/hooks/useApproverHook";
import { setHeader } from "../../services/slice/headerSlice";

const ApprovingJournal = () => {
  const dispatch = useDispatch();

  const isExpanded = useSelector((state) => state.transaction.isExpanded);
  const header = useSelector((state) => state.headers.header) || "Approval";

  const {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
    onOrderBy,
    onStateChange,
    onShowAll,
  } = useApproverHook();

  const {
    data: tagTransaction,
    isLoading,
    isError,
    isFetching,
    status,
  } = useJournalEntriesQuery(params);

  useEffect(() => {
    if (header) {
      const statusChange = approverHeader?.find(
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
            {approverHeader?.map(
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
                      {head?.name}
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
            <ArrowDropDownCircleOutlinedIcon />
          </IconButton>
        </Box>
        <Box className="tag-transaction-button-container">
          <SearchText onSearchData={onSearchData} />
        </Box>
      </Box>
      {header === "Approval" && (
        <JournalTable
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
          state={"For Approval"}
          onShowAll={onShowAll}
        />
      )}
      {header === "Void" && (
        <JournalTable
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
      {header === "Pending Void" && (
        <JournalTable
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
          state={"voiding"}
          onShowAll={onShowAll}
        />
      )}

      {header === "Returned" && (
        <JournalTable
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
      {header === "History" && (
        <JournalTable
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
          state={""}
          onShowAll={onShowAll}
        />
      )}
    </Box>
  );
};

export default ApprovingJournal;

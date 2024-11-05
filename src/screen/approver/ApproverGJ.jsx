import React, { useEffect } from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";

import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";

import "../../components/styles/TagTransaction.scss";

import { apGJheader, approverGJHeader } from "../../services/constants/headers";
import GJTable from "./GJTable";
import {
  setFilterBy,
  setIsExpanded,
} from "../../services/slice/transactionSlice";
import { setHeader } from "../../services/slice/headerSlice";
import { resetMenu, setCreateMenu } from "../../services/slice/menuSlice";
import { useGeneralJournalQuery } from "../../services/store/seconAPIRequest";
import GeneralJournalModal from "../../components/customs/modal/GeneralJournalModal";
import useApproverHook from "../../services/hooks/useApproverHook";

const ApproverGJ = () => {
  const dispatch = useDispatch();

  const isExpanded = useSelector((state) => state.transaction.isExpanded);
  const createMenu = useSelector((state) => state.menu.createMenu);

  const header = useSelector((state) => state.headers.header) || "Approval";

  const {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
    onOrderBy,
    onStateChange,
  } = useApproverHook();

  const {
    data: tagTransaction,
    isLoading,
    isError,
    isFetching,
  } = useGeneralJournalQuery(params);

  useEffect(() => {
    if (header) {
      const statusChange = approverGJHeader?.find(
        (item) => item?.name === header
      );
      onStateChange(statusChange?.status);
    }
  }, [header]);

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="tag-transaction-head-container">
        <Box className="tag-transaction-navigation-container">
          <Accordion
            expanded={isExpanded}
            elevation={0}
            className="tag-transaction-accordion"
          >
            <AccordionSummary onClick={() => dispatch(setIsExpanded(false))}>
              <Typography className="page-text-indicator-tag-transaction">
                {header}
              </Typography>
            </AccordionSummary>
            {approverGJHeader?.map(
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
        <GJTable
          params={params}
          onSortTable={onSortTable}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          tagTransaction={tagTransaction}
          onOrderBy={onOrderBy}
          state="For Approval"
        />
      )}

      {header === "Returned" && (
        <GJTable
          params={params}
          onSortTable={onSortTable}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          tagTransaction={tagTransaction}
          onOrderBy={onOrderBy}
          state="returned"
        />
      )}
      {header === "Void" && (
        <GJTable
          params={params}
          onSortTable={onSortTable}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          tagTransaction={tagTransaction}
          onOrderBy={onOrderBy}
          state="void"
        />
      )}
      {header === "Pending Void" && (
        <GJTable
          params={params}
          onSortTable={onSortTable}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          tagTransaction={tagTransaction}
          onOrderBy={onOrderBy}
          state="For Voiding"
        />
      )}
    </Box>
  );
};

export default ApproverGJ;

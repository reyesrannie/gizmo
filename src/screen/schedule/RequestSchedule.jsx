import React, { useEffect } from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";

import {
  Accordion,
  AccordionSummary,
  Badge,
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useSchedTransactionQuery } from "../../services/store/request";

import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";

import "../../components/styles/TagTransaction.scss";

import { schedTaggingHeader } from "../../services/constants/headers";
import {
  setFilterBy,
  setIsExpanded,
} from "../../services/slice/transactionSlice";
import "../../components/styles/TransactionModal.scss";
// import CheckTable from "./CheckTable";
import CountDistribute from "../../services/functions/CountDistribute";
import ScheduleModal from "../../components/customs/modal/ScheduleModal";
import { resetMenu, setCreateMenu } from "../../services/slice/menuSlice";
import useTransactionHook from "../../services/hooks/useTransactionHook";
import ScheduleTable from "./ScheduleTable";
import { setHeader } from "../../services/slice/headerSlice";

const RequestSchedule = () => {
  const dispatch = useDispatch();

  const isExpanded = useSelector((state) => state.transaction.isExpanded);
  const header = useSelector((state) => state.headers.header) || "Pending";
  const createMenu = useSelector((state) => state.menu.createMenu);

  const {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
    onOrderBy,
    onStateChange,
  } = useTransactionHook();

  const {
    data: tagTransaction,
    isLoading,
    isError,
    isFetching,
    status,
  } = useSchedTransactionQuery(params);

  const { countHeaderAPCH, countCheck } = CountDistribute();

  const hasBadge = countCheck();

  useEffect(() => {
    if (header) {
      const statusChange = schedTaggingHeader?.find(
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
                <Badge
                  badgeContent={header ? countHeaderAPCH(header) : 0}
                  color="error"
                >
                  {header}
                </Badge>
              </Typography>
            </AccordionSummary>
            {schedTaggingHeader?.map(
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
                          head?.name ? countHeaderAPCH(head?.name) : 0
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
          <Button
            variant="contained"
            color="secondary"
            className="button-add-tag-transaction"
            startIcon={<AddToPhotosOutlinedIcon />}
            onClick={() => dispatch(setCreateMenu(true))}
          >
            Add
          </Button>
        </Box>
      </Box>
      {header === "Pending" && (
        <ScheduleTable
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
          state={"received"}
        />
      )}
      {header === "Void" && (
        <ScheduleTable
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
          state={"voided"}
        />
      )}
      {header === "For Approval" && (
        <ScheduleTable
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
          state="checked"
        />
      )}
      {header === "Returned" && (
        <ScheduleTable
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
        />
      )}
      {header === "Approved" && (
        <ScheduleTable
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
          state={"approved"}
        />
      )}
      {header === "History" && (
        <ScheduleTable
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
        />
      )}
      <Dialog
        open={createMenu}
        className="transaction-modal-dialog"
        onClose={() => resetMenu(false)}
      >
        <ScheduleModal create />
      </Dialog>
    </Box>
  );
};

export default RequestSchedule;

import React, { useEffect } from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";

import {
  Accordion,
  AccordionSummary,
  Badge,
  Box,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useSchedTransactionQuery } from "../../services/store/request";

import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";

import "../../components/styles/TagTransaction.scss";

import { schedAPHeader } from "../../services/constants/headers";
import {
  setFilterBy,
  setHeader,
  setIsExpanded,
} from "../../services/slice/transactionSlice";
import "../../components/styles/TransactionModal.scss";
// import CheckTable from "./CheckTable";
import CountDistribute from "../../services/functions/CountDistribute";
import ScheduleModal from "../../components/customs/modal/ScheduleModal";
import { resetMenu } from "../../services/slice/menuSlice";
import ScheduleTable from "./ScheduleTable";
import useApHook from "../../services/hooks/useApHook";

const APSchedule = () => {
  const dispatch = useDispatch();

  const isExpanded = useSelector((state) => state.transaction.isExpanded);
  const header = useSelector((state) => state.transaction.header) || "Pending";
  const createMenu = useSelector((state) => state.menu.createMenu);

  const {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
    onOrderBy,
    onStateChange,
  } = useApHook();

  const {
    data: tagTransaction,
    isLoading,
    isError,
    isFetching,
    status,
  } = useSchedTransactionQuery(params);

  const { countGrandChildcheck, countScheduleAP } = CountDistribute();

  const hasBadge = countScheduleAP();

  useEffect(() => {
    if (header) {
      const statusChange = schedAPHeader?.find((item) => item?.name === header);
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
                  badgeContent={
                    header ? countGrandChildcheck(header, "AP Schedule") : 0
                  }
                  color="error"
                >
                  {header}
                </Badge>
              </Typography>
            </AccordionSummary>
            {schedAPHeader?.map(
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
                          head?.name
                            ? countGrandChildcheck(head?.name, "AP Schedule")
                            : 0
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
          state={"pending"}
          ap
        />
      )}
      {header === "Received" && (
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
          state={"For Computation"}
          ap
        />
      )}
      {header === "Checked" && (
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
          ap
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
          ap
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
          ap
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
          ap
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

export default APSchedule;

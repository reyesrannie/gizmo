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

import {
  approverScheduleHeader,
  schedAPHeader,
} from "../../services/constants/headers";
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
import useApproverHook from "../../services/hooks/useApproverHook";

const ApproverSchedule = () => {
  const dispatch = useDispatch();

  const isExpanded = useSelector((state) => state.transaction.isExpanded);
  const header =
    useSelector((state) => state.transaction.header) || "For Approval";
  const createMenu = useSelector((state) => state.menu.createMenu);

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
    status,
  } = useSchedTransactionQuery(params);

  const { countGrandChildcheck, countScheduleApprover } = CountDistribute();

  const hasBadge = countScheduleApprover();

  useEffect(() => {
    if (header) {
      const statusChange = approverScheduleHeader?.find(
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
                  badgeContent={
                    header
                      ? countGrandChildcheck(header, "Approver Schedule")
                      : 0
                  }
                  color="error"
                >
                  {header}
                </Badge>
              </Typography>
            </AccordionSummary>
            {approverScheduleHeader?.map(
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
                            ? countGrandChildcheck(
                                head?.name,
                                "Approver Schedule"
                              )
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
          state={"For Approval"}
          approver
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
          approver
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
          approver
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

export default ApproverSchedule;

import React, { useEffect } from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";

import { Box, Typography } from "@mui/material";

import { useTransactionQuery } from "../../services/store/request";

import "../../components/styles/TagTransaction.scss";
import "../../components/styles/AccountsPayable.scss";

import useTransactionHook from "../../services/hooks/useTransactionHook";

import TransactionTable from "./TransactionTable";

const Transaction = () => {
  const {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
    onOrderBy,
    resetParams,
  } = useTransactionHook();

  const {
    data: tagTransaction,
    isLoading,
    isError,
    isFetching,
  } = useTransactionQuery(params);

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="ap-head-container">
        <Typography className="page-text-indicator-ap">Pending</Typography>
        <Box className="ap-button-container">
          <SearchText onSearchData={onSearchData} />
        </Box>
      </Box>
      <TransactionTable
        params={params}
        onSortTable={onSortTable}
        isError={isError}
        isFetching={isFetching}
        isLoading={isLoading}
        onPageChange={onPageChange}
        onRowChange={onRowChange}
        tagTransaction={tagTransaction}
        onOrderBy={onOrderBy}
        state="pending"
      />
    </Box>
  );
};

export default Transaction;

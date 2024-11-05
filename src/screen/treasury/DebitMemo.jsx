import React, { useEffect, useRef } from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";

import { Box, Typography } from "@mui/material";

import {
  useCheckNumberQuery,
  useDebitMemoQuery,
} from "../../services/store/request";

import "../../components/styles/TagTransaction.scss";

import useTreasuryCheckHook from "../../services/hooks/useTreasuryCheckHook";
import DebitMemoTable from "./DebitMemoTable";
import useDebitMemoHook from "../../services/hooks/useDebitMemoHook";

const DebitMemo = () => {
  const {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
    onOrderBy,
    onShowAll,
  } = useDebitMemoHook();

  const {
    data: tagTransaction,
    isLoading,
    isError,
    isFetching,
    status,
  } = useDebitMemoQuery(params);

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="tag-transaction-head-container">
        <Box className="tag-transaction-navigation-container">
          <Typography className="page-text-indicator-tag-transaction">
            Debit Memo
          </Typography>
        </Box>
        <Box className="tag-transaction-button-container">
          <SearchText onSearchData={onSearchData} />
        </Box>
      </Box>
      <DebitMemoTable
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
        onShowAll={onShowAll}
      />
    </Box>
  );
};

export default DebitMemo;

import React, { useEffect, useRef } from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";

import { Box, Typography } from "@mui/material";

import { useCheckNumberQuery } from "../../services/store/request";

import "../../components/styles/TagTransaction.scss";

import CheckNumberTable from "./CheckNumberTable";
import useTreasuryCheckHook from "../../services/hooks/useTreasuryCheckHook";

const Offset = () => {
  const {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
    onOrderBy,
    onShowAll,
  } = useTreasuryCheckHook();

  const {
    data: tagTransaction,
    isLoading,
    isError,
    isFetching,
    status,
  } = useCheckNumberQuery(params);

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="tag-transaction-head-container">
        <Box className="tag-transaction-navigation-container">
          <Typography className="page-text-indicator-tag-transaction">
            Offset
          </Typography>
        </Box>
        <Box className="tag-transaction-button-container">
          <SearchText onSearchData={onSearchData} />
        </Box>
      </Box>
      <CheckNumberTable
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

export default Offset;

import React, { useEffect, useRef } from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";

import { Box, Button, Dialog, Typography } from "@mui/material";

import { useCheckNumberQuery } from "../../services/store/request";

import "../../components/styles/TagTransaction.scss";

import CheckNumberTable from "./CheckNumberTable";
import useTreasuryCheckHook from "../../services/hooks/useTreasuryCheckHook";
import { setCreateMenu } from "../../services/slice/menuSlice";
import { useDispatch, useSelector } from "react-redux";
import CheckNumberModal from "../../components/customs/modal/CheckNumberModal";

const CheckNumber = () => {
  const dispatch = useDispatch();

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
            Check Numbers
          </Typography>
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

export default CheckNumber;

import React, { useEffect } from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";

import {
  Accordion,
  AccordionSummary,
  Badge,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useTransactionQuery } from "../../services/store/request";

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";

import "../../components/styles/TagTransaction.scss";

import { setCreateMenu } from "../../services/slice/menuSlice";

import { taggingHeader } from "../../services/constants/headers";
import TaggingTable from "./TaggingTable";
import useTransactionHook from "../../services/hooks/useTransactionHook";
import {
  setFilterBy,
  setIsExpanded,
} from "../../services/slice/transactionSlice";
import CountDistribute from "../../services/functions/CountDistribute";
import { setHeader } from "../../services/slice/headerSlice";

const TagTransaction = () => {
  const dispatch = useDispatch();

  const isExpanded = useSelector((state) => state.transaction.isExpanded);

  const header =
    useSelector((state) => state.headers.header) || "Tag Transaction";

  const { countHeaderTagging } = CountDistribute();

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
  } = useTransactionQuery(params);

  useEffect(() => {
    if (header) {
      const statusChange = taggingHeader?.find((item) => item?.name === header);
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
                  badgeContent={header ? countHeaderTagging(header) : 0}
                  color="error"
                >
                  {header}
                </Badge>
              </Typography>
            </AccordionSummary>
            {taggingHeader?.map(
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
                          head?.name ? countHeaderTagging(head?.name) : 0
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
            <ArrowDropDownCircleOutlinedIcon />
          </IconButton>
        </Box>
        <Box className="tag-transaction-button-container">
          <SearchText onSearchData={onSearchData} />
          {/* <Button
            variant="contained"
            color="secondary"
            className="button-add-tag-transaction"
            startIcon={<SyncOutlinedIcon />}
            onClick={() => dispatch(setDate(true))}
          >
            Sync
          </Button> */}

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
      {header === "Tag Transaction" && (
        <TaggingTable
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
      )}

      {header === "Archived" && (
        <TaggingTable
          params={params}
          onSortTable={onSortTable}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          tagTransaction={tagTransaction}
          onOrderBy={onOrderBy}
          state="archived"
        />
      )}
      {header === "Returned" && (
        <TaggingTable
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
      {header === "History" && (
        <TaggingTable
          params={params}
          onSortTable={onSortTable}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          tagTransaction={tagTransaction}
          onOrderBy={onOrderBy}
          state={""}
        />
      )}
    </Box>
  );
};

export default TagTransaction;

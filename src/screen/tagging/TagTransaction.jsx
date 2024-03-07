import React from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";

import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import {
  useArchiveCompanyMutation,
  useTransactionQuery,
} from "../../services/store/request";

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";

import "../../components/styles/TagTransaction.scss";

import { resetPrompt } from "../../services/slice/promptSlice";
import { useSnackbar } from "notistack";
import { singleError } from "../../services/functions/errorResponse";
import {
  resetMenu,
  setCreateMenu,
  setHeader,
  setIsExpanded,
} from "../../services/slice/menuSlice";

import { taggingHeader } from "../../services/constants/headers";
import TaggingTable from "./TaggingTable";
import useTransactionHook from "../../services/hooks/useTransactionHook";

const TagTransaction = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);

  const isExpanded = useSelector((state) => state.menu.isExpanded);
  const header = useSelector((state) => state.menu.header);

  const {
    params,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
    onOrderBy,
  } = useTransactionHook();

  const [archiveCompany, { isLoading: archiveLoading }] =
    useArchiveCompanyMutation();

  const {
    data: tagTransaction,
    isLoading,
    isError,
    isFetching,
    status,
  } = useTransactionQuery(params);

  const handleArchive = async () => {
    try {
      const res = await archiveCompany(menuData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

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
            {taggingHeader?.map(
              (head, index) =>
                header !== head && (
                  <AccordionSummary
                    key={index}
                    onClick={() => {
                      dispatch(setHeader(head));
                      dispatch(setIsExpanded(false));
                    }}
                  >
                    <Typography className="page-text-accord-tag-transaction">
                      {head}
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
          status={status}
          tagTransaction={tagTransaction}
          archiveLoading={archiveLoading}
          handleArchive={handleArchive}
          onOrderBy={onOrderBy}
        />
      )}
    </Box>
  );
};

export default TagTransaction;

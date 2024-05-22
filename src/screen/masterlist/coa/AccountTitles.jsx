import React from "react";

import Breadcrums from "../../../components/customs/Breadcrums";
import SearchText from "../../../components/customs/SearchText";
import useParamsHook from "../../../services/hooks/useParamsHook";

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
  useAccountTitlesQuery,
  useCTitlesQuery,
  useGcTitlesQuery,
  useGgpTitlesQuery,
  useGpTitlesQuery,
  usePTitlesQuery,
} from "../../../services/store/request";

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";

import "../../../components/styles/AccountTitles.scss";
import "../../../components/styles/TagTransaction.scss";

import { setCreateMenu } from "../../../services/slice/menuSlice";

import {
  setHeader,
  setIsExpanded,
} from "../../../services/slice/transactionSlice";
import { coaHeader } from "../../../services/constants/headers";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import TitleTable from "./TitleTable";

const AccountTitles = () => {
  const dispatch = useDispatch();

  const header =
    useSelector((state) => state.transaction.header) || "Account Titles";

  const {
    params,
    onStatusChange,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
    onReset,
  } = useParamsHook();

  const {
    data: accountTitle,
    isLoading: isLoadingAccountTitle,
    isError: isErrorAccountTitle,
    isFetching: isFetchingAccountTitle,
    status: statusAccountTitle,
  } = useAccountTitlesQuery(params, {
    skip: header !== "Account Titles",
  });

  const {
    data: ggpTitle,
    isLoading: isLoadingGgpTitle,
    isError: isErrorGgpTitle,
    isFetching: isFetchingGgpTitle,
    status: statusGgpTitle,
  } = useGgpTitlesQuery(params, {
    skip: header !== "Great Grandparent",
  });

  const {
    data: gpTitle,
    isLoading: isLoadingGpTitle,
    isError: isErrorGpTitle,
    isFetching: isFetchingGpTitle,
    status: statusGpTitle,
  } = useGpTitlesQuery(params, {
    skip: header !== "Grandparent",
  });

  const {
    data: pTitle,
    isLoading: isLoadingpTitle,
    isError: isErrorpTitle,
    isFetching: isFetchingpTitle,
    status: statuspTitle,
  } = usePTitlesQuery(params, {
    skip: header !== "Parent",
  });

  const {
    data: cTitle,
    isLoading: isLoadingcTitle,
    isError: isErrorcTitle,
    isFetching: isFetchingcTitle,
    status: statuscTitle,
  } = useCTitlesQuery(params, {
    skip: header !== "Child",
  });

  const {
    data: gcTitle,
    isLoading: isLoadinggcTitle,
    isError: isErrorgcTitle,
    isFetching: isFetchinggcTitle,
    status: statusgcTitle,
  } = useGcTitlesQuery(params, {
    skip: header !== "Grandchild",
  });

  const isExpanded = useSelector((state) => state.transaction.isExpanded);

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
            {coaHeader?.map(
              (head, index) =>
                header !== head?.name && (
                  <AccordionSummary
                    key={index}
                    onClick={() => {
                      onReset();
                      dispatch(setHeader(head.name));
                      dispatch(setIsExpanded(false));
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
      {header === "Account Titles" && (
        <TitleTable
          params={params}
          data={accountTitle}
          isLoading={isLoadingAccountTitle}
          isError={isErrorAccountTitle}
          isFetching={isFetchingAccountTitle}
          onSortTable={onSortTable}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          onStatusChange={onStatusChange}
          status={statusAccountTitle}
        />
      )}
      {header === "Great Grandparent" && (
        <TitleTable
          params={params}
          data={ggpTitle}
          isLoading={isLoadingGgpTitle}
          isError={isErrorGgpTitle}
          isFetching={isFetchingGgpTitle}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          onSortTable={onSortTable}
          onStatusChange={onStatusChange}
          status={statusGgpTitle}
        />
      )}

      {header === "Grandparent" && (
        <TitleTable
          params={params}
          data={gpTitle}
          isLoading={isLoadingGpTitle}
          isError={isErrorGpTitle}
          isFetching={isFetchingGpTitle}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          onSortTable={onSortTable}
          onStatusChange={onStatusChange}
          status={statusGpTitle}
        />
      )}

      {header === "Parent" && (
        <TitleTable
          params={params}
          data={pTitle}
          isLoading={isLoadingpTitle}
          isError={isErrorpTitle}
          isFetching={isFetchingpTitle}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          onSortTable={onSortTable}
          onStatusChange={onStatusChange}
          status={statuspTitle}
        />
      )}

      {header === "Child" && (
        <TitleTable
          params={params}
          data={cTitle}
          isLoading={isLoadingcTitle}
          isError={isErrorcTitle}
          isFetching={isFetchingcTitle}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          onSortTable={onSortTable}
          onStatusChange={onStatusChange}
          status={statuscTitle}
        />
      )}

      {header === "Grandchild" && (
        <TitleTable
          params={params}
          data={gcTitle}
          isLoading={isLoadinggcTitle}
          isError={isErrorgcTitle}
          isFetching={isFetchinggcTitle}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          onSortTable={onSortTable}
          onStatusChange={onStatusChange}
          status={statusgcTitle}
        />
      )}
    </Box>
  );
};

export default AccountTitles;

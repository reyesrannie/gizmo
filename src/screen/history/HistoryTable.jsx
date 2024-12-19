import React, { useEffect } from "react";

import {
  Badge,
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import moment from "moment";
import Lottie from "lottie-react";

import { useDispatch, useSelector } from "react-redux";

import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ClearIcon from "@mui/icons-material/Clear";

import loading from "../../assets/lottie/Loading-2.json";
import noData from "../../assets/lottie/NoData.json";
import StatusIndicator from "../../components/customs/StatusIndicator";
import "../../components/styles/TagTransaction.scss";
import "../../components/styles/TransactionModal.scss";

import { useState } from "react";

import {
  resetMenu,
  setMenuData,
  setPreparation,
  setUpdateMenu,
  setViewMenu,
} from "../../services/slice/menuSlice";

import { AdditionalFunction } from "../../services/functions/AdditionalFunction";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import orderBySchema from "../../schemas/orderBySchema";
import { enqueueSnackbar } from "notistack";
import { resetPrompt } from "../../services/slice/promptSlice";
import { singleError } from "../../services/functions/errorResponse";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";
import { useHistoryContext } from "../../services/context/HistoryContext";
import { setVoucher } from "../../services/slice/optionsSlice";
import { setDisplayed } from "../../services/slice/syncSlice";
import { useDocumentTypeQuery } from "../../services/api/documentTypeApi";
import { usePrepareCVoucherMutation } from "../../services/api/checkVoucherApi";

const HistoryTable = ({ onOrderBy }) => {
  const [anchorE1, setAnchorE1] = useState(null);
  const header = useSelector((state) => state.headers.header);
  const dispatch = useDispatch();

  const { convertToPeso } = AdditionalFunction();

  const { data: documentType, isLoading: loadingDocument } =
    useDocumentTypeQuery({
      status: "active",
      pagination: "none",
    });

  const {
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(orderBySchema),
    defaultValues: {
      orderBy: null,
      check_ids: [],
    },
  });

  const {
    params,
    getChecks,
    onSortTable,
    isLoading,
    isError,
    historyData,
    isFetching,
    onPageChange,
    onRowChange,
  } = useHistoryContext();

  useEffect(() => {
    getChecks(params);
  }, [params]);

  return (
    <TableContainer className="tag-transaction-table-container">
      <Table stickyHeader>
        <TableHead>
          <TableRow className="table-header1-import-tag-transaction">
            <TableCell>Tag #.</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>
              <TableSortLabel
                active={params?.allocation !== ""}
                onClick={(e) => setAnchorE1(e.currentTarget)}
                direction={"desc"}
                IconComponent={FilterAltOutlinedIcon}
              >
                Allocation
              </TableSortLabel>
              {params.allocation !== "" && (
                <TableSortLabel
                  active={
                    params.sorts === "updated_at" ||
                    params.sorts === "-updated_at"
                  }
                  onClick={() =>
                    onSortTable(
                      params.sorts === "updated_at"
                        ? "-updated_at"
                        : "updated_at"
                    )
                  }
                  direction={params.sorts === "updated_at" ? "asc" : "desc"}
                />
              )}
            </TableCell>

            <TableCell align="center"> Status</TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={
                  params.sorts === "updated_at" ||
                  params.sorts === "-updated_at"
                }
                onClick={() =>
                  onSortTable(
                    params.sorts === "updated_at" ? "-updated_at" : "updated_at"
                  )
                }
                direction={params.sorts === "updated_at" ? "asc" : "desc"}
              >
                Date Modified
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">View</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={params?.state === "approved" ? 7 : 6}
                align="center"
              >
                <Lottie
                  animationData={loading}
                  className="loading-tag-transaction"
                />
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell
                colSpan={params?.state === "approved" ? 7 : 6}
                align="center"
              >
                <Lottie
                  animationData={noData}
                  className="no-data-tag-transaction"
                />
              </TableCell>
            </TableRow>
          ) : (
            historyData?.result?.data?.map((tag) => {
              const document = documentType?.result?.find(
                (doc) => tag?.transactions?.document_type_id === doc?.id || null
              );
              const tagMonthYear = dayjs(tag?.tag_year, "YYMM").toDate();
              console.log(tag);
              return (
                <TableRow className="table-body-tag-transaction" key={tag?.id}>
                  <TableCell>
                    {`${tag?.transactions?.tag_no || tag?.tag_no} - ${moment(
                      tagMonthYear
                    ).get("year")}`}
                  </TableCell>
                  <TableCell>
                    <Typography className="tag-transaction-company-name">
                      {tag?.transactions?.supplier?.name ||
                        tag?.supplier?.company_name}
                    </Typography>
                    <Typography className="tag-transaction-company-tin">
                      {tag?.transactions?.supplier?.tin || tag?.supplier?.tin}
                    </Typography>
                    <Typography className="tag-transaction-company-name">
                      {convertToPeso(tag?.amount || tag?.purchase_amount)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {tag?.voucher_number ? (
                      <Typography className="tag-transaction-company-name">
                        {tag?.voucher_number}
                      </Typography>
                    ) : (
                      <Typography className="tag-transaction-company-name">
                        {`${
                          tag?.transactions?.ap_tagging ||
                          tag?.ap_tagging?.company_code
                        } - ${
                          tag?.transactions?.gtag_no || tag?.gtag_no
                        } - ${moment(tagMonthYear).get("year")}`}
                      </Typography>
                    )}

                    <Typography className="tag-transaction-company-type">
                      {document === null ? <>&mdash;</> : document?.name}
                    </Typography>
                    <Typography className="tag-transaction-company-name">
                      {`${tag?.transactions?.invoice_no || ""}`}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {params?.state === "pending" && (
                      <StatusIndicator
                        status="Pending"
                        className="computation-indicator"
                      />
                    )}
                    {params?.state === "received" && (
                      <StatusIndicator
                        status="Received"
                        className="clearing-indicator"
                      />
                    )}
                    {params?.state === "For Computation" && (
                      <StatusIndicator
                        status="For Computation"
                        className="computation-indicator"
                      />
                    )}

                    {params?.state === "For Approval" && (
                      <StatusIndicator
                        status="For Approval"
                        className="approval-indicator"
                      />
                    )}

                    {params?.state === "approved" && (
                      <StatusIndicator
                        status="Approved"
                        className="approved-indicator"
                      />
                    )}

                    {params?.state === "returned" && (
                      <StatusIndicator
                        status="Returned"
                        className="return-indicator"
                      />
                    )}

                    {params?.state === "For Voiding" && (
                      <StatusIndicator
                        status="For Voiding"
                        className="voiding-indicator"
                      />
                    )}

                    {params?.state === "Completed" && (
                      <StatusIndicator
                        status="Completed"
                        className="approved-indicator"
                      />
                    )}

                    {params?.state === "voided" && (
                      <StatusIndicator
                        status="Void"
                        className="void-indicator"
                      />
                    )}

                    {params?.state === "For Preparation" && (
                      <StatusIndicator
                        status="Awaiting Prep"
                        className="preparation-indicator"
                      />
                    )}

                    {params?.state === "For Releasing" && (
                      <StatusIndicator
                        status="Awaiting Release"
                        className="release-indicator"
                      />
                    )}

                    {params?.state === "Released" && (
                      <StatusIndicator
                        status="For Filing"
                        className="filing-indicator"
                      />
                    )}

                    {params?.state === "For Filing" && (
                      <StatusIndicator
                        status="For Filing"
                        className="filing-indicator"
                      />
                    )}

                    {params?.state === "For Clearing" && (
                      <StatusIndicator
                        status="For Clearing"
                        className="clearing-indicator"
                      />
                    )}

                    {params?.state === "Filed" && (
                      <StatusIndicator
                        status="Filed"
                        className="filed-indicator"
                      />
                    )}

                    {params?.state === "Cancelled" && (
                      <StatusIndicator
                        status="Cancelled"
                        className="inActive-indicator"
                      />
                    )}

                    {params?.state === "Check Approval" && (
                      <StatusIndicator
                        status="For Approval"
                        className="approval-indicator"
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {moment(tag?.updated_at).format("MMM DD YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton>
                      <Badge
                        variant="dot"
                        invisible={
                          tag?.is_read !== 0 || tag?.state === "For Approval"
                        }
                        color="error"
                        className="tag-transaction-badge"
                      >
                        <RemoveRedEyeOutlinedIcon className="tag-transaction-icon-actions" />
                      </Badge>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
        {isFetching && (
          <TableFooter style={{ position: "sticky", bottom: 0 }}>
            <TableRow className="table-footer-tag-transaction">
              <TableCell colSpan={params?.state === "approved" ? 7 : 6}>
                <LinearProgress color="secondary" />
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        {!isFetching && !isError && (
          <TableFooter style={{ position: "sticky", bottom: 0 }}>
            <TableRow className="table-footer-tag-transaction">
              <TableCell colSpan={params?.state === "approved" ? 7 : 6}>
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    {
                      label: "All",
                      value:
                        historyData?.result?.total > 100
                          ? historyData?.result?.total
                          : 100,
                    },
                  ]}
                  count={historyData?.result?.total || 0}
                  rowsPerPage={historyData?.result?.per_page || 10}
                  page={historyData?.result?.current_page - 1 || 0}
                  onPageChange={onPageChange}
                  onRowsPerPageChange={onRowChange}
                  component="div"
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;

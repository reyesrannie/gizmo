import React, { useState } from "react";

import {
  Badge,
  Box,
  Dialog,
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
  TextField,
  Typography,
} from "@mui/material";

import moment from "moment";
import Lottie from "lottie-react";

import { useDispatch, useSelector } from "react-redux";

import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

import loading from "../../assets/lottie/Loading-2.json";
import noData from "../../assets/lottie/NoData.json";
import StatusIndicator from "../../components/customs/StatusIndicator";
import "../../components/styles/TagTransaction.scss";

import {
  resetMenu,
  setMenuData,
  setReceiveMenu,
} from "../../services/slice/menuSlice";

import {
  useDocumentTypeQuery,
  useReadTransactionMutation,
} from "../../services/store/request";
import TransactionModal from "../../components/customs/modal/TransactionModal";
import socket from "../../services/functions/serverSocket";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import orderBySchema from "../../schemas/orderBySchema";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import Autocomplete from "../../components/customs/AutoComplete";

const TransactionTable = ({
  params,
  onSortTable,
  isLoading,
  isError,
  tagTransaction,
  onPageChange,
  onRowChange,
  isFetching,
  onOrderBy,
}) => {
  const [anchorE1, setAnchorE1] = useState(null);
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const receiveMenu = useSelector((state) => state.menu.receiveMenu);
  const { convertToPeso } = AdditionalFunction();
  const userData = useSelector((state) => state.auth.userData);

  const { data: documentType, isLoading: loadingDocument } =
    useDocumentTypeQuery({
      status: "active",
      pagination: "none",
    });

  const [readTransaction] = useReadTransactionMutation();

  const handleRead = async (data) => {
    const obj = {
      id: data?.id,
    };
    try {
      const res = await readTransaction(obj).unwrap();
      socket.emit("transaction_read");
    } catch (error) {}
  };

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(orderBySchema),
    defaultValues: {
      orderBy: null,
    },
  });

  return (
    <Box className="tag-transaction-body-container">
      <TableContainer className="tag-transaction-table-container">
        <Table stickyHeader>
          <TableHead>
            <TableRow className="table-header1-import-tag-transaction">
              <TableCell>Tag #.</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>
                <TableSortLabel
                  active={params.allocation !== ""}
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
                      params.sorts === "updated_at"
                        ? "-updated_at"
                        : "updated_at"
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
            {loadingDocument || isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Lottie
                    animationData={loading}
                    className="loading-tag-transaction"
                  />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Lottie
                    animationData={noData}
                    className="no-data-tag-transaction"
                  />
                </TableCell>
              </TableRow>
            ) : (
              tagTransaction?.result?.data?.map((tag) => {
                const document = documentType?.result?.find(
                  (doc) => tag?.documentType?.id === doc?.id || null
                );

                return (
                  <TableRow
                    className="table-body-tag-transaction"
                    key={tag?.id}
                    onClick={() => {
                      dispatch(setMenuData(tag));
                      tag?.is_read === 0 && handleRead(tag);
                      tag?.gas_status === "pending" &&
                        dispatch(setReceiveMenu(true));
                    }}
                  >
                    <TableCell>
                      {tag?.tag_year} - {tag?.tag_no}
                    </TableCell>
                    <TableCell>
                      <Typography className="tag-transaction-company-name">
                        {tag?.supplier?.name === null ? (
                          <>&mdash;</>
                        ) : (
                          tag?.supplier?.name
                        )}
                      </Typography>
                      <Typography className="tag-transaction-company-tin">
                        {tag?.supplier === null ? (
                          <>&mdash;</>
                        ) : (
                          tag?.supplier?.tin
                        )}
                      </Typography>
                      <Typography className="tag-transaction-company-name">
                        {tag?.purchase_amount === null ? (
                          <>&mdash;</>
                        ) : (
                          convertToPeso(tag?.purchase_amount)
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {tag?.vp_series === null ? (
                        <Typography className="tag-transaction-company-name">
                          {`${tag?.apTagging?.company_code} - ${tag?.tag_year} - ${tag?.gtag_no} `}
                        </Typography>
                      ) : (
                        <Typography className="tag-transaction-company-name">
                          {tag?.vp_series}
                        </Typography>
                      )}

                      <Typography className="tag-transaction-company-name">
                        {`${tag?.apTagging?.company_code} - ${tag?.tag_year} - ${tag?.gtag_no} `}
                      </Typography>
                      <Typography className="tag-transaction-company-type">
                        {document === null ? <>&mdash;</> : document?.name}
                      </Typography>
                      <Typography className="tag-transaction-company-name">
                        {`${tag?.invoice_no || ""}`}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {tag?.gas_status === "pending" && (
                        <StatusIndicator
                          status="Pending"
                          className="pending-indicator"
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
                          invisible={tag?.is_read !== 0}
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
                <TableCell colSpan={6}>
                  <LinearProgress color="secondary" />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
          {!isError && (
            <TableFooter style={{ position: "sticky", bottom: 0 }}>
              <TableRow className="table-footer-tag-transaction">
                <TableCell colSpan={6}>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      {
                        label: "All",
                        value:
                          tagTransaction?.result?.total > 100
                            ? tagTransaction?.result?.total
                            : 100,
                      },
                    ]}
                    count={tagTransaction?.result?.total || 0}
                    rowsPerPage={tagTransaction?.result?.per_page || 10}
                    page={tagTransaction?.result?.current_page - 1 || 0}
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

      <Menu
        anchorEl={anchorE1}
        open={Boolean(anchorE1)}
        onClose={() => {
          setAnchorE1(null);
        }}
        className="table-sort-tag-transaction"
      >
        <Autocomplete
          control={control}
          name={"orderBy"}
          options={userData?.scope_tagging || []}
          getOptionLabel={(option) => `${option?.ap_code}`}
          isOptionEqualToValue={(option, value) =>
            option?.ap_id === value?.ap_id
          }
          onClose={() => {
            watch("orderBy") !== null && onOrderBy(watch("orderBy")?.ap_id);
            setAnchorE1(null);
          }}
          renderInput={(params) => (
            <TextField
              name="orderBy"
              {...params}
              label="AP "
              size="small"
              variant="outlined"
              error={Boolean(errors.orderBy)}
              helperText={errors.orderBy?.message}
              className="table-sort-select-tag-transaction"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    {watch("orderBy") && (
                      <IconButton
                        onClick={() => {
                          setValue("orderBy", null);

                          onOrderBy("");
                        }}
                        className="icon-clear-user"
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </>
                ),
              }}
            />
          )}
          disableClearable
        />
      </Menu>

      <Dialog
        open={receiveMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <TransactionModal transactionData={menuData} receive />
      </Dialog>
    </Box>
  );
};

export default TransactionTable;

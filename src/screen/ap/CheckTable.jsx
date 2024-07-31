import React from "react";

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
import ClearIcon from "@mui/icons-material/Clear";

import loading from "../../assets/lottie/Loading-2.json";
import noData from "../../assets/lottie/NoData.json";
import StatusIndicator from "../../components/customs/StatusIndicator";
import "../../components/styles/TagTransaction.scss";

import { useState } from "react";

import {
  setCheckMenu,
  setMenuData,
  setReceiveMenu,
  setUpdateMenu,
  setViewAccountingEntries,
  setViewMenu,
} from "../../services/slice/menuSlice";

import {
  useDocumentTypeQuery,
  useReadTransactionCheckMutation,
} from "../../services/store/request";
import TransactionModalAp from "../../components/customs/modal/TransactionModalAp";
import { resetOption, setVoucher } from "../../services/slice/optionsSlice";
import TransactionModalApprover from "../../components/customs/modal/TransactionModalApprover";
import socket from "../../services/functions/serverSocket";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Autocomplete from "../../components/customs/AutoComplete";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import orderBySchema from "../../schemas/orderBySchema";

const CheckTable = ({
  params,
  onSortTable,
  isLoading,
  isError,
  tagTransaction,
  isFetching,
  onPageChange,
  onRowChange,
  onOrderBy,
}) => {
  const [anchorE1, setAnchorE1] = useState(null);
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const receiveMenu = useSelector((state) => state.menu.receiveMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const viewMenu = useSelector((state) => state.menu.viewMenu);
  const checkMenu = useSelector((state) => state.menu.checkMenu);
  const userData = useSelector((state) => state.auth.userData);
  const { convertToPeso } = AdditionalFunction();

  const viewAccountingEntries = useSelector(
    (state) => state.menu.viewAccountingEntries
  );

  const { data: documentType, isLoading: loadingDocument } =
    useDocumentTypeQuery({
      status: "active",
      pagination: "none",
    });

  const [readTransaction] = useReadTransactionCheckMutation();

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
                  (doc) =>
                    tag?.transactions?.document_type_id === doc?.id || null
                );

                return (
                  <TableRow
                    className="table-body-tag-transaction"
                    key={tag?.id}
                    onClick={() => {
                      dispatch(setMenuData(tag));
                      dispatch(setVoucher("check"));
                      tag?.is_read === 0 && handleRead(tag);
                      tag?.state === "For Computation" &&
                        dispatch(setUpdateMenu(true));

                      tag?.state === "returned" &&
                        dispatch(setUpdateMenu(true));

                      tag?.state === "For Voiding" &&
                        dispatch(setViewAccountingEntries(true));

                      tag?.state === "voided" &&
                        dispatch(setViewAccountingEntries(true));

                      tag?.state === "For Approval" &&
                        dispatch(setCheckMenu(true));

                      // tag?.state === "For Approval" &&
                      //   dispatch(setUpdateMenu(true));

                      tag?.state === "approved" && dispatch(setViewMenu(true));
                      tag?.state === "For Preparation" &&
                        dispatch(setViewAccountingEntries(true));
                    }}
                  >
                    <TableCell>
                      {`${tag?.transactions?.tag_year} - ${tag?.transactions?.tag_no}`}
                    </TableCell>
                    <TableCell>
                      <Typography className="tag-transaction-company-name">
                        {tag?.transactions?.supplier?.name === null ? (
                          <>&mdash;</>
                        ) : (
                          tag?.transactions?.supplier?.name
                        )}
                      </Typography>
                      <Typography className="tag-transaction-company-tin">
                        {tag?.transactions?.supplier === null ? (
                          <>&mdash;</>
                        ) : (
                          tag?.transactions?.supplier?.tin
                        )}
                      </Typography>
                      <Typography className="tag-transaction-company-name">
                        {tag?.amount === null ? (
                          <>&mdash;</>
                        ) : (
                          convertToPeso(tag?.amount)
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {tag?.voucher_number ? (
                        <Typography className="tag-transaction-company-name">
                          {tag?.voucher_number}
                        </Typography>
                      ) : (
                        <Typography className="tag-transaction-company-name">
                          {`${tag?.transactions?.ap_tagging} - ${tag?.transactions?.tag_year} - ${tag?.transactions?.gtag_no} `}
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
                      {tag?.state === "For Computation" && (
                        <StatusIndicator
                          status="For Computation"
                          className="computation-indicator"
                        />
                      )}

                      {tag?.state === "For Approval" && (
                        <StatusIndicator
                          status="For Approval"
                          className="approval-indicator"
                        />
                      )}

                      {tag?.state === "approved" && (
                        <StatusIndicator
                          status="Approved"
                          className="approved-indicator"
                        />
                      )}

                      {tag?.state === "returned" && (
                        <StatusIndicator
                          status="Returned"
                          className="return-indicator"
                        />
                      )}

                      {tag?.state === "For Voiding" && (
                        <StatusIndicator
                          status="For Voiding"
                          className="voiding-indicator"
                        />
                      )}

                      {tag?.state === "voided" && (
                        <StatusIndicator
                          status="Void"
                          className="void-indicator"
                        />
                      )}

                      {tag?.state === "For Preparation" && (
                        <StatusIndicator
                          status="Awaiting Prep"
                          className="preparation-indicator"
                        />
                      )}

                      {tag?.state === "For Releasing" && (
                        <StatusIndicator
                          status="Awaiting Release"
                          className="release-indicator"
                        />
                      )}

                      {tag?.state === "For Filing" && (
                        <StatusIndicator
                          status="Awaiting File"
                          className="filing-indicator"
                        />
                      )}

                      {tag?.state === "For Clearing" && (
                        <StatusIndicator
                          status="For Clearing"
                          className="clearing-indicator"
                        />
                      )}

                      {tag?.state === "Filed" && (
                        <StatusIndicator
                          status="Filed"
                          className="filed-indicator"
                        />
                      )}

                      {tag?.state === "Cancelled" && (
                        <StatusIndicator
                          status="Cancelled"
                          className="inActive-indicator"
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
          {!isFetching && !isError && (
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
        onClose={() => {
          dispatch(setReceiveMenu(false));
          dispatch(resetOption());
        }}
      >
        <TransactionModalAp transactionData={menuData} receive />
      </Dialog>

      <Dialog
        open={viewMenu}
        className="transaction-modal-dialog"
        onClose={() => {
          dispatch(setViewMenu(false));
          dispatch(resetOption());
        }}
      >
        <TransactionModalApprover transactionData={menuData} approved ap />
      </Dialog>

      <Dialog
        open={updateMenu}
        className="transaction-modal-dialog"
        onClose={() => {
          dispatch(setUpdateMenu(false));
          dispatch(resetOption());
        }}
      >
        <TransactionModalAp transactionData={menuData} update viewVoucher />
      </Dialog>

      <Dialog
        open={viewAccountingEntries}
        className="transaction-modal-dialog"
        onClose={() => {
          dispatch(setViewAccountingEntries(false));
          dispatch(resetOption());
        }}
      >
        <TransactionModalApprover viewAccountingEntries />
      </Dialog>

      <Dialog
        open={checkMenu}
        className="transaction-modal-dialog"
        onClose={() => {
          dispatch(setCheckMenu(false));
          dispatch(resetOption());
        }}
      >
        <TransactionModalAp transactionData={menuData} checked />
      </Dialog>
    </Box>
  );
};

export default CheckTable;

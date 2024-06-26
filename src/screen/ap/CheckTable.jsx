import React from "react";

import {
  Badge,
  Box,
  Dialog,
  IconButton,
  LinearProgress,
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
import { setVoucher } from "../../services/slice/optionsSlice";
import TransactionModalApprover from "../../components/customs/modal/TransactionModalApprover";
import socket from "../../services/functions/serverSocket";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";

const CheckTable = ({
  params,
  onSortTable,
  isLoading,
  isError,
  tagTransaction,
  isFetching,
  onPageChange,
  onRowChange,
}) => {
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const receiveMenu = useSelector((state) => state.menu.receiveMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const viewMenu = useSelector((state) => state.menu.viewMenu);
  const checkMenu = useSelector((state) => state.menu.checkMenu);
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

  return (
    <Box className="tag-transaction-body-container">
      <TableContainer className="tag-transaction-table-container">
        <Table stickyHeader>
          <TableHead>
            <TableRow className="table-header1-import-tag-transaction">
              <TableCell>Tag #.</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Allocation</TableCell>

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
                          className="pending-indicator"
                        />
                      )}

                      {tag?.state === "For Approval" && (
                        <StatusIndicator
                          status="For Approval"
                          className="checked-indicator"
                        />
                      )}

                      {tag?.state === "approved" && (
                        <StatusIndicator
                          status="Approved"
                          className="received-indicator"
                        />
                      )}

                      {tag?.state === "returned" && (
                        <StatusIndicator
                          status="Returned"
                          className="inActive-indicator"
                        />
                      )}

                      {tag?.state === "For Voiding" && (
                        <StatusIndicator
                          status="For Voiding"
                          className="pending-indicator"
                        />
                      )}

                      {tag?.state === "voided" && (
                        <StatusIndicator
                          status="Void"
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

      <Dialog
        open={receiveMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(setReceiveMenu(false))}
      >
        <TransactionModalAp transactionData={menuData} receive />
      </Dialog>

      <Dialog
        open={viewMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(setViewMenu(false))}
      >
        <TransactionModalApprover transactionData={menuData} approved ap />
      </Dialog>

      <Dialog
        open={updateMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(setUpdateMenu(false))}
      >
        <TransactionModalAp transactionData={menuData} update viewVoucher />
      </Dialog>

      <Dialog
        open={viewAccountingEntries}
        className="transaction-modal-dialog"
        onClose={() => dispatch(setViewAccountingEntries(false))}
      >
        <TransactionModalApprover viewAccountingEntries />
      </Dialog>

      <Dialog
        open={checkMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(setCheckMenu(false))}
      >
        <TransactionModalAp transactionData={menuData} checked />
      </Dialog>
    </Box>
  );
};

export default CheckTable;

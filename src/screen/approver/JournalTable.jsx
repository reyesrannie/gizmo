import React from "react";

import {
  Autocomplete,
  Badge,
  Box,
  Dialog,
  IconButton,
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

import ClearIcon from "@mui/icons-material/Clear";

import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import loading from "../../assets/lottie/Loading-2.json";
import noData from "../../assets/lottie/NoData.json";
import StatusIndicator from "../../components/customs/StatusIndicator";
import "../../components/styles/TagTransaction.scss";

import { useState } from "react";

import {
  resetMenu,
  setCheckMenu,
  setMenuData,
  setViewAccountingEntries,
  setViewMenu,
  setVoidMenu,
} from "../../services/slice/menuSlice";

import {
  useDocumentTypeQuery,
  useReadTransactionJournalMutation,
  useSupplierQuery,
  useTagYearMonthQuery,
} from "../../services/store/request";
import { setFilterBy } from "../../services/slice/transactionSlice";
import TransactionModalAp from "../../components/customs/modal/TransactionModalAp";
import { setVoucher } from "../../services/slice/optionsSlice";
import TransactionModalApprover from "../../components/customs/modal/TransactionModalApprover";
import socket from "../../services/functions/serverSocket";

const JournalTable = ({
  params,
  onSortTable,
  isLoading,
  status,
  isError,
  tagTransaction,
  isFetching,
  onPageChange,
  onRowChange,
  onOrderBy,
  state,
}) => {
  const [anchorE1, setAnchorE1] = useState(null);
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const viewMenu = useSelector((state) => state.menu.viewMenu);
  const checkMenu = useSelector((state) => state.menu.checkMenu);
  const filterBy = useSelector((state) => state.transaction.filterBy);
  const voidMenu = useSelector((state) => state.menu.voidMenu);
  const viewAccountingEntries = useSelector(
    (state) => state.menu.viewAccountingEntries
  );

  const { data: documentType, isLoading: loadingDocument } =
    useDocumentTypeQuery({
      status: "active",
      pagination: "none",
    });

  const { data: tagYearMonth, isLoading: loadingTagYearMonth } =
    useTagYearMonthQuery({ state: state });

  const [readTransaction] = useReadTransactionJournalMutation();

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
              <TableCell>
                <TableSortLabel
                  active={params.tagYear !== ""}
                  onClick={(e) => setAnchorE1(e.currentTarget)}
                  direction={"desc"}
                  IconComponent={FilterAltOutlinedIcon}
                >
                  Allocation
                </TableSortLabel>

                {params.tagYear !== "" && (
                  <TableSortLabel
                    active={
                      params.sorts === "gtag_no" || params.sorts === "-gtag_no"
                    }
                    onClick={() =>
                      onSortTable(
                        params.sorts === "gtag_no" ? "-gtag_no" : "gtag_no"
                      )
                    }
                    direction={params.sorts === `-gtag_no` ? "asc" : "desc"}
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
            {loadingDocument || isLoading || loadingTagYearMonth ? (
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
                      dispatch(setVoucher("journal"));
                      tag?.is_read === 0 && handleRead(tag);
                      tag?.state === "approved" && dispatch(setViewMenu(true));

                      tag?.state === "For Approval" &&
                        dispatch(setCheckMenu(true));

                      tag?.state === "returned" && dispatch(setViewMenu(true));

                      tag?.state === "For Voiding" &&
                        dispatch(setVoidMenu(true));

                      tag?.state === "voided" &&
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
                        {`${tag?.invoice_no || ""}`}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {tag?.state === "For Approval" && (
                        <StatusIndicator
                          status="For Approval"
                          className="checked-indicator"
                        />
                      )}
                      {tag?.state === "returned" && (
                        <StatusIndicator
                          status="Returned"
                          className="inActive-indicator"
                        />
                      )}
                      {tag?.state === "approved" && (
                        <StatusIndicator
                          status="Approved"
                          className="received-indicator"
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
          disablePortal
          id="combo-box-demo"
          options={tagYearMonth?.result || []}
          onKeyDown={(e) =>
            e?.key.toLowerCase() === "enter" && e.preventDefault()
          }
          value={filterBy || null}
          onClose={(e) => {
            dispatch(setFilterBy(e.target.textContent));
            onOrderBy(e.target.textContent);
            setAnchorE1(null);
          }}
          renderInput={(params, e) => (
            <TextField
              {...params}
              label="Tag Year Month"
              className="table-sort-select-tag-transaction"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}

                    {filterBy !== "" && (
                      <IconButton
                        onClick={() => {
                          onOrderBy("");
                          dispatch(setFilterBy(""));
                          setAnchorE1(null);
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
        open={viewMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <TransactionModalApprover approved />
      </Dialog>

      <Dialog
        open={updateMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu(false))}
      >
        <TransactionModalAp transactionData={menuData} update />
      </Dialog>

      <Dialog
        open={voidMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <TransactionModalApprover transactionData={menuData} voiding />
      </Dialog>

      <Dialog
        open={viewAccountingEntries}
        className="transaction-modal-dialog"
        onClose={() => dispatch(setViewAccountingEntries(false))}
      >
        <TransactionModalApprover viewAccountingEntries voiding />
      </Dialog>

      <Dialog
        open={checkMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <TransactionModalApprover transactionData={menuData} checked />
      </Dialog>
    </Box>
  );
};

export default JournalTable;

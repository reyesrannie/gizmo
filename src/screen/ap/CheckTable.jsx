import React from "react";

import {
  Autocomplete,
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
  setCheckMenu,
  setMenuData,
  setUpdateMenu,
} from "../../services/slice/menuSlice";

import {
  useDocumentTypeQuery,
  useSupplierQuery,
  useTagYearMonthQuery,
} from "../../services/store/request";
import { setFilterBy } from "../../services/slice/transactionSlice";
import TransactionModalAp from "../../components/customs/modal/TransactionModalAp";
import { setVoucher } from "../../services/slice/optionsSlice";

const CheckTable = ({
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
  const receiveMenu = useSelector((state) => state.menu.receiveMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const viewMenu = useSelector((state) => state.menu.viewMenu);
  const checkMenu = useSelector((state) => state.menu.checkMenu);
  const filterBy = useSelector((state) => state.transaction.filterBy);

  const { data: supplier, isLoading: loadingSupplier } = useSupplierQuery({
    status: "active",
    pagination: "none",
  });

  const { data: documentType, isLoading: loadingDocument } =
    useDocumentTypeQuery({
      status: "active",
      pagination: "none",
    });

  const { data: tagYearMonth, isLoading: loadingTagYearMonth } =
    useTagYearMonthQuery({ state: state });

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
            {loadingDocument ||
            loadingSupplier ||
            isLoading ||
            loadingTagYearMonth ||
            status === "pending" ? (
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
                const supplierName = supplier?.result?.find(
                  (sup) => tag?.transactions?.supplier_id === sup?.id || null
                );
                return (
                  <TableRow
                    className="table-body-tag-transaction"
                    key={tag?.id}
                  >
                    <TableCell>{tag?.transactions?.tag_no}</TableCell>
                    <TableCell>
                      <Typography className="tag-transaction-company-name">
                        {supplierName?.company_name === null ? (
                          <>&mdash;</>
                        ) : (
                          supplierName?.company_name
                        )}
                      </Typography>
                      <Typography className="tag-transaction-company-tin">
                        {supplierName === null ? (
                          <>&mdash;</>
                        ) : (
                          supplierName?.tin
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
                    </TableCell>
                    <TableCell align="center">
                      {moment(tag?.updated_at).format("MMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          dispatch(setMenuData(tag));
                          dispatch(setVoucher("check"));
                          tag?.state === "For Computation" &&
                            dispatch(setUpdateMenu(true));

                          tag?.state === "For Approval" &&
                            dispatch(setCheckMenu(true));
                        }}
                      >
                        <RemoveRedEyeOutlinedIcon className="tag-transaction-icon-actions" />
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
                    rowsPerPageOptions={[5, 10, 25, 100]}
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

      <Dialog open={receiveMenu} className="transaction-modal-dialog">
        <TransactionModalAp transactionData={menuData} receive />
      </Dialog>

      <Dialog open={viewMenu} className="transaction-modal-dialog">
        <TransactionModalAp transactionData={menuData} view />
      </Dialog>

      <Dialog open={updateMenu} className="transaction-modal-dialog">
        <TransactionModalAp transactionData={menuData} update />
      </Dialog>

      <Dialog open={checkMenu} className="transaction-modal-dialog">
        <TransactionModalAp transactionData={menuData} checked />
      </Dialog>
    </Box>
  );
};

export default CheckTable;

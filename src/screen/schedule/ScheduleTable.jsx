import React from "react";

import {
  Box,
  Dialog,
  IconButton,
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

import {
  resetMenu,
  setMenuData,
  setUpdateMenu,
  setViewMenu,
} from "../../services/slice/menuSlice";

import TransactionModal from "../../components/customs/modal/TransactionModal";
import { useSupplierQuery } from "../../services/store/request";
import ScheduleModal from "../../components/customs/modal/ScheduleModal";

const ScheduleTable = ({
  params,
  onSortTable,
  isError,
  tagTransaction,
  isFetching,
  onPageChange,
  onRowChange,
}) => {
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const createMenu = useSelector((state) => state.menu.createMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const viewMenu = useSelector((state) => state.menu.viewMenu);

  const { data: supplier, isLoading: loadingSupplier } = useSupplierQuery({
    status: "active",
    pagination: "none",
  });

  return (
    <Box className="tag-transaction-body-container">
      <TableContainer className="tag-transaction-table-container">
        <Table stickyHeader>
          <TableHead>
            <TableRow className="table-header1-import-tag-transaction">
              <TableCell>ID</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell> Date Scheduled</TableCell>

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
            {loadingSupplier ? (
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
                const supplierName = supplier?.result?.find(
                  (sup) => tag?.supplier_id === sup?.id || null
                );

                const getOrdinalSuffix = (day) => {
                  if (day > 3 && day < 21) return "th"; // covers 11th to 19th
                  switch (day % 10) {
                    case 1:
                      return "st";
                    case 2:
                      return "nd";
                    case 3:
                      return "rd";
                    default:
                      return "th";
                  }
                };

                const coverageFrom = tag?.coverage_from;
                const day = moment(coverageFrom).format("D");
                const dayWithSuffix = day + getOrdinalSuffix(Number(day));

                return (
                  <TableRow
                    className="table-body-tag-transaction"
                    key={tag?.id}
                    onClick={() => {
                      dispatch(setMenuData(tag));

                      tag?.state === "pending" && dispatch(setUpdateMenu(true));
                      tag?.gas_status === "archived" &&
                        dispatch(setViewMenu(true));
                      tag?.gas_status === "returned" &&
                        dispatch(setUpdateMenu(true));
                      tag?.gas_status === "received" &&
                        dispatch(setViewMenu(true));
                      tag?.gas_status === "checked" &&
                        dispatch(setViewMenu(true));
                      tag?.gas_status === "approved" &&
                        dispatch(setViewMenu(true));
                    }}
                  >
                    <TableCell>{tag?.id}</TableCell>
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
                      <Typography className="tag-transaction-company-name"></Typography>
                      <Typography className="tag-transaction-company-type">
                        {`Every ${dayWithSuffix} of the month`}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {tag?.state === "pending" && (
                        <StatusIndicator
                          status="Pending"
                          className="pending-indicator"
                        />
                      )}
                      {tag?.gas_status === "received" && (
                        <StatusIndicator
                          status="Received"
                          className="checked-indicator"
                        />
                      )}
                      {tag?.gas_status === "archived" && (
                        <StatusIndicator
                          status="Archived"
                          className="inActive-indicator"
                        />
                      )}
                      {tag?.gas_status === "returned" && (
                        <StatusIndicator
                          status="Returned"
                          className="inActive-indicator"
                        />
                      )}
                      {tag?.gas_status === "checked" && (
                        <StatusIndicator
                          status="Checking"
                          className="checked-indicator"
                        />
                      )}
                      {tag?.gas_status === "approved" && (
                        <StatusIndicator
                          status="Approved"
                          className="received-indicator"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {moment(tag?.updated_at).format("MMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => {
                          dispatch(setMenuData(tag));

                          tag?.states === "pending" &&
                            dispatch(setUpdateMenu(true));
                          tag?.gas_status === "archived" &&
                            dispatch(setViewMenu(true));
                          tag?.gas_status === "returned" &&
                            dispatch(setUpdateMenu(true));
                          tag?.gas_status === "received" &&
                            dispatch(setViewMenu(true));
                          tag?.gas_status === "checked" &&
                            dispatch(setViewMenu(true));
                          tag?.gas_status === "approved" &&
                            dispatch(setViewMenu(true));
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

      <Dialog open={createMenu} className="transaction-modal-dialog">
        <TransactionModal create />
      </Dialog>

      <Dialog open={viewMenu} className="transaction-modal-dialog">
        <TransactionModal transactionData={menuData} view />
      </Dialog>

      <Dialog
        open={updateMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <ScheduleModal update />
      </Dialog>
    </Box>
  );
};

export default ScheduleTable;

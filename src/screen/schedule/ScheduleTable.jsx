import React from "react";

import {
  Badge,
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
  setApproveMenu,
  setMenuData,
  setReceiveMenu,
  setSched,
  setSchedComputation,
  setUpdateMenu,
  setViewAccountingEntries,
  setViewMenu,
} from "../../services/slice/menuSlice";

import ScheduleModal from "../../components/customs/modal/ScheduleModal";
import ScheduleComputationModal from "../../components/customs/modal/ScheduleComputationModal";
import ScheduleTransactionApproverModal from "../../components/customs/modal/ScheduleTransactionApproverModal";
import DateChecker from "../../services/functions/DateChecker";
import { setVoucher } from "../../services/slice/optionsSlice";

const ScheduleTable = ({
  params,
  onSortTable,
  isError,
  tagTransaction,
  isFetching,
  onPageChange,
  onRowChange,
  ap = false,
  approver = false,
}) => {
  const dispatch = useDispatch();
  const receiveMenu = useSelector((state) => state.menu.receiveMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const viewMenu = useSelector((state) => state.menu.viewMenu);
  const schedComputation = useSelector((state) => state.menu.schedComputation);
  const approveMenu = useSelector((state) => state.menu.approveMenu);
  const { isCoverageTodayTable } = DateChecker();
  const viewAccountingEntries = useSelector(
    (state) => state.menu.viewAccountingEntries
  );

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
            {isFetching ? (
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
              tagTransaction?.result?.data?.map((tag, index) => {
                const isToday = isCoverageTodayTable(tag);

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

                const coverageFrom = tag?.start_date;
                const day = moment(coverageFrom).format("D");
                const dayWithSuffix = day + getOrdinalSuffix(Number(day));

                return (
                  <TableRow
                    className="table-body-tag-transaction"
                    key={index}
                    onClick={() => {
                      dispatch(setMenuData(tag));
                      dispatch(setVoucher("check"));
                      dispatch(setSched(true));

                      tag?.state === "pending" &&
                        !ap &&
                        dispatch(setUpdateMenu(true));

                      tag?.state === "pending" &&
                        ap &&
                        dispatch(setReceiveMenu(true));

                      tag?.state === "For Computation" &&
                        ap &&
                        dispatch(setSchedComputation(true));

                      tag?.state === "For Approval" &&
                        ap &&
                        dispatch(setViewMenu(true));

                      tag?.state === "For Approval" &&
                        !ap &&
                        approver &&
                        dispatch(setApproveMenu(true));

                      tag?.state === "returned" &&
                        approver &&
                        dispatch(setViewAccountingEntries(true));

                      tag?.state === "returned" &&
                        ap &&
                        dispatch(setSchedComputation(true));

                      tag?.state != "pending" &&
                        !ap &&
                        !approver &&
                        dispatch(setViewMenu(true));

                      tag?.state === "approved" && dispatch(setViewMenu(true));
                      tag?.state === "completed" && dispatch(setViewMenu(true));
                    }}
                  >
                    <TableCell>{tag?.id}</TableCell>
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
                      {tag?.state === "For Computation" && (
                        <StatusIndicator
                          status="Received"
                          className="checked-indicator"
                        />
                      )}
                      {tag?.state === "archived" && (
                        <StatusIndicator
                          status="Archived"
                          className="inActive-indicator"
                        />
                      )}
                      {tag?.state === "returned" && (
                        <StatusIndicator
                          status="Returned"
                          className="inActive-indicator"
                        />
                      )}
                      {tag?.state === "checked" && (
                        <StatusIndicator
                          status="Checking"
                          className="checked-indicator"
                        />
                      )}
                      {tag?.state === "approved" && (
                        <StatusIndicator
                          status="Approved"
                          className="checked-indicator"
                        />
                      )}
                      {tag?.state === "For Approval" && (
                        <StatusIndicator
                          status="For Approval"
                          className="pending-indicator"
                        />
                      )}
                      {tag?.state === "completed" && (
                        <StatusIndicator
                          status="Completed"
                          className="received-indicator"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {moment(tag?.updated_at).format("MMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton>
                        <Badge variant="dot" color="error" invisible={!isToday}>
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

      <Dialog
        open={updateMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <ScheduleModal update />
      </Dialog>

      <Dialog
        open={receiveMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <ScheduleModal receive />
      </Dialog>

      <Dialog
        open={schedComputation}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <ScheduleComputationModal checked />
      </Dialog>

      <Dialog
        open={viewMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        {ap ? (
          <ScheduleComputationModal checked view ap />
        ) : (
          <ScheduleComputationModal checked view />
        )}
      </Dialog>

      <Dialog
        open={viewAccountingEntries}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <ScheduleTransactionApproverModal viewAccountingEntries />
      </Dialog>

      <Dialog
        open={approveMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <ScheduleTransactionApproverModal view />
      </Dialog>
    </Box>
  );
};

export default ScheduleTable;

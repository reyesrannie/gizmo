import {
  Box,
  Button,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";

import Lottie from "lottie-react";
import moment from "moment";

import loading from "../../assets/lottie/Loading-2.json";
import noData from "../../assets/lottie/NoData.json";
import StatusIndicator from "../../components/customs/StatusIndicator";

import "../../components/styles/AccountsPayable.scss";
import "../../components/styles/RolesModal.scss";
import "../../components/styles/TransactionModal.scss";
import "../../components/styles/TagTransaction.scss";

import {
  useCutOffQuery,
  useTagYearMonthQuery,
} from "../../services/store/request";
import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";
import useReportHook from "../../services/hooks/useReportHook";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { useDispatch, useSelector } from "react-redux";
import ReportModal from "../../components/customs/modal/ReportModal";
import { setMenuData, setViewMenu } from "../../services/slice/menuSlice";

const TransactionReport = () => {
  const dispatch = useDispatch();
  const viewMenu = useSelector((state) => state.menu.viewMenu);
  const menuData = useSelector((state) => state.menu.menuData);

  const { params, onSearchData, onSortTable, onPageChange, onRowChange } =
    useReportHook();

  const {
    data: tagYear,
    isLoading,
    isError,
    isFetching,
  } = useTagYearMonthQuery(params);

  const { data: cutOff } = useCutOffQuery({
    state: "closed",
    pagination: "none",
  });

  const checkIfAvailable = (date) => {
    const hasValue = cutOff?.result?.find(
      (item) => date === moment(item?.date).format("YYMM")
    );
    if (hasValue) {
      return true;
    } else {
      return false;
    }
  };

  const displayReport = (tag) => {
    dispatch(setMenuData(tag));
    dispatch(setViewMenu(true));
  };

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="ap-head-container">
        <Typography className="page-text-indicator-ap">Transaction</Typography>
        <Box className="ap-button-container">
          <SearchText onSearchData={onSearchData} />
        </Box>
      </Box>
      <Box className="ap-body-container">
        <TableContainer className="ap-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow className="table-header-ap">
                <TableCell align="center">Tag</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Lottie animationData={loading} className="loading-ap" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Lottie animationData={noData} className="no-data-ap" />
                  </TableCell>
                </TableRow>
              ) : (
                tagYear?.result?.data?.map((tag, index) => (
                  <Tooltip
                    key={index}
                    title={
                      <Typography className="form-title-text-note">
                        {checkIfAvailable(tag?.tag_year)
                          ? "Tag is closed, and the report is now available"
                          : "The tag is either open or not yet closed, and the report is unavailable."}
                      </Typography>
                    }
                    arrow
                    color="secondary"
                  >
                    <TableRow
                      onClick={() =>
                        checkIfAvailable(tag?.tag_year)
                          ? displayReport(tag)
                          : null
                      }
                      className={
                        checkIfAvailable(tag?.tag_year)
                          ? "table-body-available"
                          : "table-body-ap"
                      }
                    >
                      <TableCell align="center">{tag?.tag_year}</TableCell>
                      <TableCell align="center">
                        {checkIfAvailable(tag?.tag_year) ? (
                          <StatusIndicator
                            status="Available"
                            className="received-indicator"
                          />
                        ) : (
                          <StatusIndicator
                            status="Unavailable"
                            className="pending-indicator"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  </Tooltip>
                ))
              )}
            </TableBody>

            {!isFetching && !isError && (
              <TableFooter style={{ position: "sticky", bottom: 0 }}>
                <TableRow className="table-footer-ap">
                  <TableCell colSpan={2}>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        {
                          label: "All",
                          value:
                            tagYear?.result?.total > 100
                              ? tagYear?.result?.total
                              : 100,
                        },
                      ]}
                      count={tagYear?.result?.total || 0}
                      rowsPerPage={tagYear?.result?.per_page || 10}
                      page={tagYear?.result?.current_page - 1 || 0}
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
      </Box>

      <Dialog
        open={viewMenu}
        onClose={() => dispatch(setViewMenu(false))}
        className="transaction-modal-dialog-tax"
      >
        <ReportModal />
      </Dialog>
    </Box>
  );
};

export default TransactionReport;

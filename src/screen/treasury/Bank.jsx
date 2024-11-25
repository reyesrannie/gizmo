import React, { useEffect, useRef, useState } from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";

import {
  Box,
  Button,
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

import "../../components/styles/TagTransaction.scss";
import "../../components/styles/AccountsPayable.scss";
import "../../components/styles/RolesModal.scss";

import loading from "../../assets/lottie/Loading-2.json";
import noData from "../../assets/lottie/NoData.json";

import {
  resetMenu,
  setCreateMenu,
  setMenuData,
  setUpdateData,
  setUpdateMenu,
} from "../../services/slice/menuSlice";
import { useDispatch, useSelector } from "react-redux";
import Lottie from "lottie-react";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";
import StatusIndicator from "../../components/customs/StatusIndicator";
import moment from "moment";

import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import useParamsHook from "../../services/hooks/useParamsHook";
import BankAccountModal from "../../components/customs/modal/BankAccountModal";
import { useBankQuery } from "../../services/api/bankApi";

const Bank = () => {
  const dispatch = useDispatch();
  const [anchorE1, setAnchorE1] = useState(null);

  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const createMenu = useSelector((state) => state.menu.createMenu);

  const { convertToPeso } = AdditionalFunction();

  const { params, onPageChange, onRowChange, onSearchData, onSortTable } =
    useParamsHook();

  const {
    data: tagTransaction,
    isLoading,
    isError,
    isFetching,
    status,
  } = useBankQuery(params);

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="tag-transaction-head-container">
        <Box className="tag-transaction-navigation-container">
          <Typography className="page-text-indicator-tag-transaction">
            Bank
          </Typography>
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
      <Box className="ap-body-container">
        <TableContainer className="ap-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow className="table-header-ap">
                <TableCell>
                  <TableSortLabel
                    active={params.sorts === "id" || params.sorts === "-id"}
                    onClick={() =>
                      onSortTable(params.sorts === "id" ? "-id" : "id")
                    }
                    direction={params.sorts === "id" ? "asc" : "desc"}
                  >
                    ID No.
                  </TableSortLabel>
                </TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>Account Title</TableCell>
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
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading || status === "pending" ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Lottie animationData={loading} className="loading-ap" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Lottie animationData={noData} className="no-data-ap" />
                  </TableCell>
                </TableRow>
              ) : (
                tagTransaction?.result?.data?.map((comp) => (
                  <TableRow
                    className="table-body-ap"
                    key={comp?.id}
                    onClick={() => {
                      dispatch(setMenuData(comp));
                      dispatch(setUpdateMenu(true));
                    }}
                  >
                    <TableCell>{comp?.id}</TableCell>
                    <TableCell>{comp?.name}</TableCell>
                    <TableCell>{comp?.coa?.name}</TableCell>
                    <TableCell align="center">
                      {params.status === "active" && (
                        <StatusIndicator
                          status="Active"
                          className="active-indicator"
                        />
                      )}
                      {params.status === "inactive" && (
                        <StatusIndicator
                          status="Inactive"
                          className="inActive-indicator"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {moment(comp?.updated_at).format("MMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => {
                          dispatch(setMenuData(comp));
                          setAnchorE1(e.currentTarget);
                        }}
                      >
                        <MoreVertOutlinedIcon className="ap-icon-actions" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

            {!isFetching && !isError && (
              <TableFooter style={{ position: "sticky", bottom: 0 }}>
                <TableRow className="table-footer-ap">
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
      </Box>

      <Dialog
        open={updateMenu}
        className="transaction-modal-dialog-bank"
        onClose={() => dispatch(resetMenu())}
      >
        <BankAccountModal />
      </Dialog>

      <Dialog
        open={createMenu}
        className="transaction-modal-dialog-tax"
        onClose={() => dispatch(setCreateMenu())}
      >
        <BankAccountModal />
      </Dialog>
    </Box>
  );
};

export default Bank;

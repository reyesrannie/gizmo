import React from "react";

import {
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

import {
  resetMenu,
  setMenuData,
  setUpdateMenu,
  setViewMenu,
} from "../../services/slice/menuSlice";

import TransactionModal from "../../components/customs/modal/TransactionModal";
import { useDocumentTypeQuery } from "../../services/store/request";
import { setFilterBy } from "../../services/slice/transactionSlice";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";

const TaggingTable = ({
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
  const createMenu = useSelector((state) => state.menu.createMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const viewMenu = useSelector((state) => state.menu.viewMenu);

  const { convertToPeso } = AdditionalFunction();

  const { data: documentType, isLoading: loadingDocument } =
    useDocumentTypeQuery({
      status: "active",
      pagination: "none",
    });

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
                  (doc) => tag?.documentType?.id === doc?.id || null
                );

                return (
                  <TableRow
                    className="table-body-tag-transaction"
                    key={tag?.id}
                    onClick={() => {
                      dispatch(setMenuData(tag));

                      tag?.gas_status === "pending" &&
                        dispatch(setUpdateMenu(true));
                      tag?.gas_status === "archived" &&
                        dispatch(setUpdateMenu(true));
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

                          tag?.gas_status === "pending" &&
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
        open={createMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <TransactionModal create />
      </Dialog>

      <Dialog
        open={viewMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <TransactionModal transactionData={menuData} view />
      </Dialog>

      <Dialog
        open={updateMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <TransactionModal transactionData={menuData} update />
      </Dialog>
    </Box>
  );
};

export default TaggingTable;

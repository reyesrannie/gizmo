import {
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
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
import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import {
  resetMenu,
  setCreateMenu,
  setImportError,
  setImportMenu,
  setMenuData,
  setUpdateMenu,
} from "../../services/slice/menuSlice";
import { resetPrompt, setWarning } from "../../services/slice/promptSlice";
import { singleError } from "../../services/functions/errorResponse";
import Lottie from "lottie-react";
import moment from "moment";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";
import loading from "../../assets/lottie/Loading-2.json";
import loadingLight from "../../assets/lottie/Loading.json";
import noData from "../../assets/lottie/NoData.json";
import StatusIndicator from "../../components/customs/StatusIndicator";

import "../../components/styles/AccountsPayable.scss";
import "../../components/styles/RolesModal.scss";

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import useParamsHook from "../../services/hooks/useParamsHook";
import {
  useApQuery,
  useArchiveAPMutation,
  useImportAPMutation,
} from "../../services/store/request";
import AccountsPayableModal from "../../components/customs/modal/AccountsPayableModal";
import { generateExcel } from "../../services/functions/exportFile";
import ImportModal from "../../components/customs/modal/ImportModal";
import { useBBalanceQuery } from "../../services/store/seconAPIRequest";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";
import BalanceModal from "../../components/customs/modal/BalanceModal";
import { useParams } from "react-router-dom";

const Balance = () => {
  const excelItems = ["ID", "CODE", "NAME", "CREATED AT", "DATE MODIFIED"];

  const [anchorE1, setAnchorE1] = useState(null);
  const { convertToPeso } = AdditionalFunction();
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const createMenu = useSelector((state) => state.menu.createMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);

  const {
    params,
    onStatusChange,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
  } = useParamsHook();

  const {
    data: ap,
    isLoading,
    isError,
    isFetching,
    status,
  } = useBBalanceQuery(params);

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="ap-head-container">
        <Typography className="page-text-indicator-ap">
          Beginning Balance
        </Typography>
        <Box className="ap-button-container">
          <SearchText onSearchData={onSearchData} />
          <Button
            variant="contained"
            color="secondary"
            className="button-add-ap"
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
              {/* <TableRow className="table-header1-ap">
                <TableCell colSpan={7}>
                  <Stack flexDirection={"row"} justifyContent="space-between">
                    <FormControlLabel
                      className="check-box-archive-ap"
                      control={<Checkbox color="secondary" />}
                      label="Archive"
                      checked={params?.status === "inactive"}
                      onChange={() =>
                        onStatusChange(
                          params?.status === "active" ? "inactive" : "active"
                        )
                      }
                    />
                  </Stack>
                </TableCell>
              </TableRow> */}
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
                <TableCell>Amount</TableCell>
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
                ap?.result?.data?.map((comp) => (
                  <TableRow
                    className="table-body-ap"
                    key={comp?.id}
                    onClick={() => {
                      dispatch(setMenuData(comp));
                      dispatch(setUpdateMenu(true));
                    }}
                  >
                    <TableCell>{comp?.id}</TableCell>
                    <TableCell>{convertToPeso(comp?.amount)}</TableCell>
                    <TableCell>{comp?.bank?.name}</TableCell>
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
                            ap?.result?.total > 100 ? ap?.result?.total : 100,
                        },
                      ]}
                      count={ap?.result?.total || 0}
                      rowsPerPage={ap?.result?.per_page || 10}
                      page={ap?.result?.current_page - 1 || 0}
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
        open={createMenu || updateMenu}
        onClose={() => dispatch(resetMenu())}
      >
        <BalanceModal params={params} />
      </Dialog>
    </Box>
  );
};

export default Balance;

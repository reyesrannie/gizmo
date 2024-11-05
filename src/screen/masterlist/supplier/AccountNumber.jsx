import React from "react";

import Breadcrums from "../../../components/customs/Breadcrums";
import SearchText from "../../../components/customs/SearchText";
import useParamsHook from "../../../services/hooks/useParamsHook";

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

import moment from "moment";
import Lottie from "lottie-react";

import { useDispatch, useSelector } from "react-redux";
import {
  useAccountNumberQuery,
  useArchiveAccountNumberMutation,
  useImportAccountNumberMutation,
} from "../../../services/store/request";

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import loading from "../../../assets/lottie/Loading-2.json";
import loadingLight from "../../../assets/lottie/Loading.json";
import noData from "../../../assets/lottie/NoData.json";
import StatusIndicator from "../../../components/customs/StatusIndicator";
import warning from "../../../assets/svg/warning.svg";
import "../../../components/styles/AccountNumber.scss";
import "../../../components/styles/RolesModal.scss";

import { useState } from "react";
import { resetPrompt, setWarning } from "../../../services/slice/promptSlice";
import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";
import AppPrompt from "../../../components/customs/AppPrompt";
import {
  resetMenu,
  setCreateMenu,
  setImportError,
  setImportMenu,
  setMenuData,
  setUpdateMenu,
} from "../../../services/slice/menuSlice";
import { generateExcelAccount } from "../../../services/functions/exportFile";
import ImportModal from "../../../components/customs/modal/ImportModal";
import AccountNumberModal from "../../../components/customs/modal/AccountNumberModal";

const AccountNumber = () => {
  const excelItems = [
    "ID",
    "ACCOUNT NUMBER",
    "LOCATION",
    "SUPPLIER",
    "DATE MODIFIED",
  ];
  const [anchorE1, setAnchorE1] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const openWarning = useSelector((state) => state.prompt.warning);
  const createMenu = useSelector((state) => state.menu.createMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const importMenu = useSelector((state) => state.menu.importMenu);

  const {
    params,
    onStatusChange,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
  } = useParamsHook();

  const [archiveAccountNumber, { isLoading: archiveLoading }] =
    useArchiveAccountNumberMutation();

  const [importSupplier, { isLoading: loadingImport }] =
    useImportAccountNumberMutation();

  const {
    data: accountNumber,
    isLoading,
    isError,
    isFetching,
    status,
  } = useAccountNumberQuery(params);

  const handleArchive = async () => {
    try {
      const res = await archiveAccountNumber(menuData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const importCompanyHandler = async (submitData) => {
    const obj = submitData?.map((items) => ({
      account_no: items?.account_no,
      supplier_id: items.supplier,
      location_id: items?.location,
    }));

    try {
      const res = await importSupplier(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      dispatch(setImportError(error?.data?.errors));
      singleError(error, enqueueSnackbar);
    }
  };

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="account-number-head-container">
        <Typography className="page-text-indicator-account-number">
          Account Number
        </Typography>
        <Box className="account-number-button-container">
          <SearchText onSearchData={onSearchData} />
          <Button
            variant="contained"
            color="secondary"
            className="button-add-account-number"
            startIcon={<AddToPhotosOutlinedIcon />}
            onClick={() => dispatch(setCreateMenu(true))}
          >
            Add
          </Button>
        </Box>
      </Box>
      <Box className="account-number-body-container">
        <TableContainer className="account-number-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow className="table-header1-account-number">
                <TableCell colSpan={8}>
                  <Stack flexDirection={"row"} justifyContent="space-between">
                    <FormControlLabel
                      className="check-box-archive-account-number"
                      control={<Checkbox color="secondary" />}
                      label="Archive"
                      checked={params?.status === "inactive"}
                      onChange={() =>
                        onStatusChange(
                          params?.status === "active" ? "inactive" : "active"
                        )
                      }
                    />
                    <Box>
                      <Button
                        variant="contained"
                        className="button-export-account-number"
                        startIcon={<FileUploadOutlinedIcon />}
                        onClick={() =>
                          generateExcelAccount(
                            "Account Number",
                            accountNumber?.result?.data,
                            excelItems
                          )
                        }
                      >
                        Export
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        className="button-export-account-number"
                        startIcon={<FileDownloadOutlinedIcon />}
                        onClick={() => dispatch(setImportMenu(true))}
                      >
                        Import
                      </Button>
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow className="table-header-account-number">
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
                <TableCell>
                  <TableSortLabel
                    active={
                      params.sorts === "company_name" ||
                      params.sorts === "-company_name"
                    }
                    onClick={() =>
                      onSortTable(
                        params.sorts === "company_name"
                          ? "-company_name"
                          : "company_name"
                      )
                    }
                    direction={params.sorts === "company_name" ? "asc" : "desc"}
                  >
                    Account Number
                  </TableSortLabel>
                </TableCell>
                <TableCell>Supplier</TableCell>

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
                    <Lottie
                      animationData={loading}
                      className="loading-account-number"
                    />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Lottie
                      animationData={noData}
                      className="no-data-account-number"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                accountNumber?.result?.data?.map((account) => (
                  <TableRow
                    className="table-body-account-number"
                    key={account?.id}
                  >
                    <TableCell>{account?.id}</TableCell>
                    <TableCell>{account?.account_no}</TableCell>
                    <TableCell>{account?.supplier?.company_name}</TableCell>

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
                      {moment(account?.updated_at).format("MMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => {
                          dispatch(setMenuData(account));
                          setAnchorE1(e.currentTarget);
                        }}
                      >
                        <MoreVertOutlinedIcon className="account-number-icon-actions" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {!isFetching && !isError && (
              <TableFooter style={{ position: "sticky", bottom: 0 }}>
                <TableRow className="table-footer-account-number">
                  <TableCell colSpan={6}>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        {
                          label: "All",
                          value:
                            accountNumber?.result?.total > 100
                              ? accountNumber?.result?.total
                              : 100,
                        },
                      ]}
                      count={accountNumber?.result?.total || 0}
                      rowsPerPage={accountNumber?.result?.per_page || 10}
                      page={accountNumber?.result?.current_page - 1 || 0}
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

      <Menu
        anchorEl={anchorE1}
        open={Boolean(anchorE1)}
        onClose={() => {
          setAnchorE1(null);
        }}
      >
        {params?.status === "active" && (
          <MenuItem
            onClick={() => {
              dispatch(setUpdateMenu(true));
              setAnchorE1(null);
            }}
          >
            <ListItemIcon>
              <ModeEditOutlineOutlinedIcon className="account-number-menu-icons" />
            </ListItemIcon>
            <Typography className="account-number-menu-text">
              Update Account
            </Typography>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAnchorE1(null);
            dispatch(setWarning(true));
          }}
        >
          <ListItemIcon>
            {params.status === "inactive" ? (
              <SettingsBackupRestoreOutlinedIcon className="account-number-menu-icons" />
            ) : (
              <DeleteForeverOutlinedIcon className="account-number-menu-icons" />
            )}
          </ListItemIcon>
          <Typography className="account-number-menu-text">
            {params.status === "inactive" ? "Restore" : "Archive"}
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog open={archiveLoading} className="loading-role-create">
        <Lottie animationData={loadingLight} loop={archiveLoading} />
      </Dialog>

      <Dialog open={createMenu} className="account-number-modal-dialog">
        <AccountNumberModal />
      </Dialog>

      <Dialog open={updateMenu} className="account-number-modal-dialog">
        <AccountNumberModal accountNumberData={menuData} update />
      </Dialog>

      <Dialog open={importMenu}>
        <ImportModal
          title="Account Number"
          importData={importCompanyHandler}
          isLoading={loadingImport}
        />
      </Dialog>

      <Dialog open={openWarning}>
        <AppPrompt
          image={warning}
          title={
            params.status === "active"
              ? "Archive this Account?"
              : "Restore this Account?"
          }
          message={
            params.status === "active"
              ? "You are about to archive this Account"
              : "You are about to restore this Account"
          }
          nextLineMessage={"Please confirm to continue"}
          confirmButton={
            params.status === "active" ? "Yes, Archive it!" : "Yes, Restore it!"
          }
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
            dispatch(resetMenu());
          }}
          confirmOnClick={() => handleArchive()}
        />
      </Dialog>
    </Box>
  );
};

export default AccountNumber;

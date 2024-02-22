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
  useArchiveSupplierMutation,
  useImportSupplierMutation,
  useSupplierQuery,
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
import "../../../components/styles/Supplier.scss";

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
import { generateExcelwSupplier } from "../../../services/functions/exportFile";
import SupplierModal from "../../../components/customs/modal/SupplierModal";
import ImportModal from "../../../components/customs/modal/ImportModal";

const Supplier = () => {
  const excelItems = [
    "ID",
    "COMPANY",
    "ADDRESS",
    "TIN",
    "PROPRIETOR",
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

  const [archiveSupplier, { isLoading: archiveLoading }] =
    useArchiveSupplierMutation();

  const [importSupplier, { isLoading: loadingImport }] =
    useImportSupplierMutation();

  const {
    data: supplier,
    isLoading,
    isError,
    isFetching,
    status,
  } = useSupplierQuery(params);

  const handleArchive = async () => {
    try {
      const res = await archiveSupplier(menuData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const importCompanyHandler = async (submitData) => {
    try {
      const res = await importSupplier(submitData).unwrap();
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
      <Box className="supplier-head-container">
        <Typography className="page-text-indicator-supplier">
          Supplier
        </Typography>
        <Box className="supplier-button-container">
          <SearchText onSearchData={onSearchData} />
          <Button
            variant="contained"
            color="secondary"
            className="button-add-supplier"
            startIcon={<AddToPhotosOutlinedIcon />}
            onClick={() => dispatch(setCreateMenu(true))}
          >
            Add
          </Button>
        </Box>
      </Box>
      <Box className="supplier-body-container">
        <TableContainer className="supplier-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow className="table-header1-supplier">
                <TableCell colSpan={5}>
                  <Stack flexDirection={"row"} justifyContent="space-between">
                    <FormControlLabel
                      className="check-box-archive-supplier"
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
                        className="button-export-supplier"
                        startIcon={<FileUploadOutlinedIcon />}
                        onClick={() =>
                          generateExcelwSupplier(
                            "Supplier",
                            supplier?.result?.data,
                            excelItems
                          )
                        }
                      >
                        Export
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        className="button-export-supplier"
                        startIcon={<FileDownloadOutlinedIcon />}
                        onClick={() => dispatch(setImportMenu(true))}
                      >
                        Import
                      </Button>
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow className="table-header-supplier">
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
                    Company
                  </TableSortLabel>
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
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading || status === "pending" ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Lottie
                      animationData={loading}
                      className="loading-supplier"
                    />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Lottie
                      animationData={noData}
                      className="no-data-supplier"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                supplier?.result?.data?.map((comp) => (
                  <TableRow className="table-body-supplier" key={comp?.id}>
                    <TableCell>{comp?.id}</TableCell>
                    <TableCell>
                      <Stack>
                        <Typography className="supplier-company-name">
                          {comp?.company_name}
                        </Typography>
                        <Typography className="supplier-company-tin">
                          {comp?.tin}
                        </Typography>
                        <Typography className="supplier-company-address">
                          {comp?.company_address}
                        </Typography>
                        <Typography className="supplier-company-proprietor">
                          {comp?.proprietor !== "" ? comp?.proprietor : ""}
                        </Typography>
                      </Stack>
                    </TableCell>

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
                        <MoreVertOutlinedIcon className="supplier-icon-actions" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {!isFetching && !isError && (
              <TableFooter style={{ position: "sticky", bottom: 0 }}>
                <TableRow className="table-footer-supplier">
                  <TableCell colSpan={6}>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 100]}
                      count={supplier?.result?.total || 0}
                      rowsPerPage={supplier?.result?.per_page || 10}
                      page={supplier?.result?.current_page - 1 || 0}
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
              <ModeEditOutlineOutlinedIcon className="supplier-menu-icons" />
            </ListItemIcon>
            <Typography className="supplier-menu-text">
              Update Supplier
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
              <SettingsBackupRestoreOutlinedIcon className="supplier-menu-icons" />
            ) : (
              <DeleteForeverOutlinedIcon className="supplier-menu-icons" />
            )}
          </ListItemIcon>
          <Typography className="supplier-menu-text">
            {params.status === "inactive" ? "Restore" : "Archive"}
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog open={archiveLoading} className="loading-role-create">
        <Lottie animationData={loadingLight} loop={archiveLoading} />
      </Dialog>

      <Dialog open={createMenu} className="supplier-modal-dialog">
        <SupplierModal />
      </Dialog>

      <Dialog open={updateMenu} className="supplier-modal-dialog">
        <SupplierModal supplierData={menuData} update />
      </Dialog>

      <Dialog open={importMenu}>
        <ImportModal
          title="Supplier"
          importData={importCompanyHandler}
          isLoading={loadingImport}
          supplier
          withTag
        />
      </Dialog>

      <Dialog open={openWarning}>
        <AppPrompt
          image={warning}
          title={
            params.status === "active"
              ? "Archive this Supplier?"
              : "Restore this Supplier?"
          }
          message={
            params.status === "active"
              ? "You are about to archive this supplier"
              : "You are about to restore this supplier"
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

export default Supplier;
